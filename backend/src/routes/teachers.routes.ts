import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageTeaching } from '../utils/access-control.js';

const router = Router();

const teacherSchema = z.object({
  fullName: z.string().min(3).max(180),
  identityDocument: z.string().min(3).max(40),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  specialty: z.string().max(140).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'licencia']).default('active'),
  assignment: z.object({
    scope: z.enum(['nivel', 'curso', 'seccion']),
    assignmentTitle: z.string().min(3).max(140),
    levelId: z.string().uuid().optional(),
    gradeId: z.string().uuid().optional(),
    sectionId: z.string().uuid().optional(),
    notes: z.string().max(500).optional().or(z.literal('')),
  }).nullable().optional(),
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

async function resolveAssignmentContext(
  client: Pick<typeof pool, 'query'>,
  institutionId: string,
  assignment: NonNullable<z.infer<typeof teacherSchema>['assignment']>,
) {
  if (assignment.scope === 'nivel') {
    if (!assignment.levelId) {
      throw new Error('Debe seleccionar un nivel para la asignación.');
    }

    const levelResult = await client.query(
      `
        SELECT id, name
        FROM edu_academic_levels
        WHERE id = $1 AND institution_id = $2
        LIMIT 1
      `,
      [assignment.levelId, institutionId],
    );

    if (!levelResult.rows[0]) {
      throw new Error('El nivel seleccionado no existe en la institución actual.');
    }

    return {
      levelId: levelResult.rows[0].id as string,
      gradeId: null,
      sectionId: null,
      label: levelResult.rows[0].name as string,
    };
  }

  if (assignment.scope === 'curso') {
    if (!assignment.gradeId) {
      throw new Error('Debe seleccionar un curso o grado para la asignación.');
    }

    const gradeResult = await client.query(
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
      [assignment.gradeId, institutionId],
    );

    if (!gradeResult.rows[0]) {
      throw new Error('El curso o grado seleccionado no existe en la institución actual.');
    }

    return {
      levelId: gradeResult.rows[0].levelId as string,
      gradeId: gradeResult.rows[0].id as string,
      sectionId: null,
      label: `${gradeResult.rows[0].levelName} · ${gradeResult.rows[0].name}`,
    };
  }

  if (!assignment.sectionId) {
    throw new Error('Debe seleccionar una sección para la asignación.');
  }

  const sectionResult = await client.query(
    `
      SELECT
        s.id,
        s.grade_id AS "gradeId",
        s.name,
        g.level_id AS "levelId",
        g.name AS "gradeName",
        l.name AS "levelName"
      FROM edu_academic_sections s
      INNER JOIN edu_academic_grades g ON g.id = s.grade_id
      INNER JOIN edu_academic_levels l ON l.id = g.level_id
      WHERE s.id = $1 AND s.institution_id = $2
      LIMIT 1
    `,
    [assignment.sectionId, institutionId],
  );

  if (!sectionResult.rows[0]) {
    throw new Error('La sección seleccionada no existe en la institución actual.');
  }

  return {
    levelId: sectionResult.rows[0].levelId as string,
    gradeId: sectionResult.rows[0].gradeId as string,
    sectionId: sectionResult.rows[0].id as string,
    label: `${sectionResult.rows[0].levelName} · ${sectionResult.rows[0].gradeName} · ${sectionResult.rows[0].name}`,
  };
}

router.get('/', requireAuth, async (request, response) => {
  if (!canManageTeaching(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar docentes.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const [teachersResult, levelsResult, gradesResult, sectionsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          t.id,
          t.full_name AS "fullName",
          t.identity_document AS "identityDocument",
          t.email,
          t.phone,
          t.specialty,
          t.status,
          COALESCE(assignments.total_assignments, 0)::int AS "assignmentsCount",
          latest.assignment_title AS "assignmentTitle",
          latest.scope AS "assignmentScope",
          latest.reference_label AS "assignmentLabel",
          t.created_at AS "createdAt"
        FROM edu_teachers t
        LEFT JOIN LATERAL (
          SELECT COUNT(*) AS total_assignments
          FROM edu_teacher_assignments ta
          WHERE ta.teacher_id = t.id
        ) assignments ON TRUE
        LEFT JOIN LATERAL (
          SELECT
            ta.assignment_title,
            CASE
              WHEN ta.section_id IS NOT NULL THEN 'seccion'
              WHEN ta.grade_id IS NOT NULL THEN 'curso'
              ELSE 'nivel'
            END AS scope,
            CASE
              WHEN ta.section_id IS NOT NULL THEN CONCAT(l.name, ' · ', g.name, ' · ', s.name)
              WHEN ta.grade_id IS NOT NULL THEN CONCAT(l.name, ' · ', g.name)
              ELSE l.name
            END AS reference_label
          FROM edu_teacher_assignments ta
          LEFT JOIN edu_academic_levels l ON l.id = ta.level_id
          LEFT JOIN edu_academic_grades g ON g.id = ta.grade_id
          LEFT JOIN edu_academic_sections s ON s.id = ta.section_id
          WHERE ta.teacher_id = t.id
          ORDER BY ta.created_at DESC
          LIMIT 1
        ) latest ON TRUE
        WHERE t.institution_id = $1
        ORDER BY t.created_at DESC
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

  const activeTeachers = teachersResult.rows.filter((row) => row.status === 'active').length;
  const assignedTeachers = teachersResult.rows.filter((row) => Number(row.assignmentsCount) > 0).length;

  return response.json(successResponse('Docentes cargados.', {
    institution,
    summary: {
      teachers: teachersResult.rows.length,
      activeTeachers,
      assignedTeachers,
    },
    teachers: teachersResult.rows,
    academicOptions: {
      levels: levelsResult.rows,
      grades: gradesResult.rows,
      sections: sectionsResult.rows,
    },
  }));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canManageTeaching(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear docentes.' });
  }

  const payload = teacherSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const teacherResult = await client.query(
      `
        INSERT INTO edu_teachers (
          institution_id,
          full_name,
          identity_document,
          email,
          phone,
          specialty,
          status
        ) VALUES ($1, $2, UPPER($3), $4, $5, $6, $7)
        RETURNING
          id,
          full_name AS "fullName",
          identity_document AS "identityDocument",
          email,
          phone,
          specialty,
          status,
          created_at AS "createdAt"
      `,
      [
        institution.id,
        payload.fullName,
        payload.identityDocument,
        payload.email?.trim() || null,
        payload.phone?.trim() || null,
        payload.specialty?.trim() || null,
        payload.status,
      ],
    );

    const createdTeacher = teacherResult.rows[0] as {
      id: string;
      fullName: string;
      identityDocument: string;
      email?: string | null;
      phone?: string | null;
      specialty?: string | null;
      status: string;
    };

    let assignmentTitle: string | null = null;
    let assignmentScope: 'nivel' | 'curso' | 'seccion' | null = null;
    let assignmentLabel: string | null = null;

    if (payload.assignment) {
      const assignmentContext = await resolveAssignmentContext(client, institution.id, payload.assignment);

      await client.query(
        `
          INSERT INTO edu_teacher_assignments (
            institution_id,
            teacher_id,
            level_id,
            grade_id,
            section_id,
            assignment_title,
            notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          institution.id,
          createdTeacher.id,
          assignmentContext.levelId,
          assignmentContext.gradeId,
          assignmentContext.sectionId,
          payload.assignment.assignmentTitle,
          payload.assignment.notes?.trim() || null,
        ],
      );

      assignmentTitle = payload.assignment.assignmentTitle;
      assignmentScope = payload.assignment.scope;
      assignmentLabel = assignmentContext.label;
    }

    await client.query('COMMIT');

    return response.status(201).json(successResponse('Docente creado.', {
      ...createdTeacher,
      assignmentsCount: assignmentTitle ? 1 : 0,
      assignmentTitle,
      assignmentScope,
      assignmentLabel,
    }));
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof Error && error.message.startsWith('Debe seleccionar')) {
      return response.status(400).json({ success: false, message: error.message });
    }

    if (error instanceof Error && error.message.includes('no existe en la institución actual')) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

export default router;
