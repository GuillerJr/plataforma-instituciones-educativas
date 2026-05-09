import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageAcademic } from '../utils/access-control.js';

const router = Router();

const assignmentSchema = z.object({
  teacherId: z.string().uuid(),
  subjectId: z.string().uuid(),
  levelId: z.string().uuid(),
  gradeId: z.string().uuid(),
  sectionId: z.string().uuid().optional().or(z.literal('')),
  weeklyHours: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : value),
    z.coerce.number().int().min(1).max(60).nullable(),
  ).optional(),
  notes: z.string().max(500).optional().or(z.literal('')),
});

async function resolveInstitutionId(preferredInstitutionId?: string | null) {
  if (preferredInstitutionId) {
    const institution = await pool.query(
      `SELECT id, name FROM edu_institutions WHERE id = $1 LIMIT 1`,
      [preferredInstitutionId],
    );

    if (institution.rows[0]) {
      return institution.rows[0] as { id: string; name: string };
    }
  }

  const fallback = await pool.query(
    `SELECT id, name FROM edu_institutions ORDER BY created_at ASC LIMIT 1`,
  );

  if (!fallback.rows[0]) {
    throw new Error('No hay una institución base configurada.');
  }

  return fallback.rows[0] as { id: string; name: string };
}

async function resolveAssignmentReferences(
  client: Pick<typeof pool, 'query'>,
  institutionId: string,
  payload: z.infer<typeof assignmentSchema>,
) {
  const [teacherResult, subjectResult, gradeResult] = await Promise.all([
    client.query(
      `
        SELECT id, full_name AS "fullName"
        FROM edu_teachers
        WHERE id = $1 AND institution_id = $2
        LIMIT 1
      `,
      [payload.teacherId, institutionId],
    ),
    client.query(
      `
        SELECT id, name, code, level_id AS "levelId"
        FROM edu_subjects
        WHERE id = $1 AND institution_id = $2
        LIMIT 1
      `,
      [payload.subjectId, institutionId],
    ),
    client.query(
      `
        SELECT
          g.id,
          g.level_id AS "levelId",
          g.name,
          l.name AS "levelName"
        FROM edu_academic_grades g
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE g.id = $1 AND g.institution_id = $2
        LIMIT 1
      `,
      [payload.gradeId, institutionId],
    ),
  ]);

  if (!teacherResult.rows[0]) {
    throw new Error('El docente seleccionado no existe en la institución actual.');
  }

  if (!subjectResult.rows[0]) {
    throw new Error('La materia seleccionada no existe en la institución actual.');
  }

  if (!gradeResult.rows[0]) {
    throw new Error('El curso o grado seleccionado no existe en la institución actual.');
  }

  const subject = subjectResult.rows[0] as { id: string; name: string; code: string; levelId?: string | null };
  const grade = gradeResult.rows[0] as { id: string; levelId: string; name: string; levelName: string };

  if (payload.levelId !== grade.levelId) {
    throw new Error('El nivel no coincide con el curso o grado seleccionado.');
  }

  if (subject.levelId && subject.levelId !== grade.levelId) {
    throw new Error('La materia seleccionada pertenece a otro nivel académico.');
  }

  let section:
    | {
        id: string;
        name: string;
      }
    | undefined;

  if (payload.sectionId) {
    const sectionResult = await client.query(
      `
        SELECT id, name
        FROM edu_academic_sections
        WHERE id = $1 AND institution_id = $2 AND grade_id = $3
        LIMIT 1
      `,
      [payload.sectionId, institutionId, grade.id],
    );

    section = sectionResult.rows[0] as { id: string; name: string } | undefined;

    if (!section) {
      throw new Error('La sección seleccionada no existe o no corresponde al curso o grado indicado.');
    }
  }

    return {
      teacherName: teacherResult.rows[0].fullName as string,
      subjectName: subject.name,
      subjectCode: subject.code,
      levelId: grade.levelId,
      levelName: grade.levelName,
    gradeId: grade.id,
    gradeName: grade.name,
    sectionId: section?.id ?? null,
    sectionName: section?.name ?? null,
  };
}

router.get('/', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar asignaciones académicas.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const [assignmentsResult, teachersResult, subjectsResult, levelsResult, gradesResult, sectionsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          aa.id,
          aa.teacher_id AS "teacherId",
          t.full_name AS "teacherName",
          aa.subject_id AS "subjectId",
          sub.name AS "subjectName",
          sub.code AS "subjectCode",
          aa.level_id AS "levelId",
          l.name AS "levelName",
          aa.grade_id AS "gradeId",
          g.name AS "gradeName",
          aa.section_id AS "sectionId",
          s.name AS "sectionName",
          aa.weekly_hours AS "weeklyHours",
          aa.notes,
          aa.created_at AS "createdAt"
        FROM edu_academic_assignments aa
        INNER JOIN edu_teachers t ON t.id = aa.teacher_id
        INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
        INNER JOIN edu_academic_levels l ON l.id = aa.level_id
        INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
        LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
        WHERE aa.institution_id = $1
        ORDER BY aa.created_at DESC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          id,
          full_name AS "fullName",
          specialty,
          status
        FROM edu_teachers
        WHERE institution_id = $1
        ORDER BY full_name ASC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          s.id,
          s.level_id AS "levelId",
          l.name AS "levelName",
          s.name,
          s.code,
          s.area,
          s.weekly_hours AS "weeklyHours",
          s.status
        FROM edu_subjects s
        LEFT JOIN edu_academic_levels l ON l.id = s.level_id
        WHERE s.institution_id = $1
        ORDER BY s.name ASC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          id,
          name,
          code,
          educational_stage AS "educationalStage",
          sort_order AS "sortOrder"
        FROM edu_academic_levels
        WHERE institution_id = $1
        ORDER BY sort_order ASC, created_at ASC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          g.id,
          g.level_id AS "levelId",
          l.name AS "levelName",
          g.name,
          g.code,
          g.sort_order AS "sortOrder"
        FROM edu_academic_grades g
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE g.institution_id = $1
        ORDER BY l.sort_order ASC, g.sort_order ASC, g.created_at ASC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          s.id,
          s.grade_id AS "gradeId",
          g.level_id AS "levelId",
          l.name AS "levelName",
          g.name AS "gradeName",
          s.name,
          s.code,
          s.shift
        FROM edu_academic_sections s
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE s.institution_id = $1
        ORDER BY l.sort_order ASC, g.sort_order ASC, s.name ASC, s.created_at ASC
      `,
      [institution.id],
    ),
  ]);

  const withSection = assignmentsResult.rows.filter((row) => Boolean(row.sectionId)).length;
  const linkedTeachers = new Set(assignmentsResult.rows.map((row) => row.teacherId as string)).size;

  return response.json(successResponse('Asignaciones académicas cargadas.', {
    institution,
    summary: {
      assignments: assignmentsResult.rows.length,
      withSection,
      linkedTeachers,
    },
    assignments: assignmentsResult.rows,
    options: {
      teachers: teachersResult.rows,
      subjects: subjectsResult.rows,
      levels: levelsResult.rows,
      grades: gradesResult.rows,
      sections: sectionsResult.rows,
    },
  }));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear asignaciones académicas.' });
  }

  const payload = assignmentSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const client = await pool.connect();

  try {
    const assignmentContext = await resolveAssignmentReferences(client, institution.id, payload);

    const result = await client.query(
      `
        INSERT INTO edu_academic_assignments (
          institution_id,
          teacher_id,
          subject_id,
          level_id,
          grade_id,
          section_id,
          weekly_hours,
          notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
          id,
          teacher_id AS "teacherId",
          subject_id AS "subjectId",
          level_id AS "levelId",
          grade_id AS "gradeId",
          section_id AS "sectionId",
          weekly_hours AS "weeklyHours",
          notes,
          created_at AS "createdAt"
      `,
      [
        institution.id,
        payload.teacherId,
        payload.subjectId,
        assignmentContext.levelId,
        assignmentContext.gradeId,
        assignmentContext.sectionId,
        payload.weeklyHours ?? null,
        payload.notes?.trim() || null,
      ],
    );

    return response.status(201).json(successResponse('Asignación académica creada.', {
      ...result.rows[0],
      teacherName: assignmentContext.teacherName,
      subjectName: assignmentContext.subjectName,
      subjectCode: assignmentContext.subjectCode,
      levelName: assignmentContext.levelName,
      gradeName: assignmentContext.gradeName,
      sectionName: assignmentContext.sectionName,
    }));
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('no existe')
      || error.message.includes('no coincide')
      || error.message.includes('pertenece a otro nivel')
      || error.message.includes('no corresponde al curso o grado indicado')
    )) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

export default router;
