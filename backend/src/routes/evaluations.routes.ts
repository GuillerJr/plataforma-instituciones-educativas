import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canReadAcademic, canWorkOnEvaluations } from '../utils/access-control.js';
import { appendRepresentativeScope, appendStudentScope, appendTeacherAssignmentScope, resolveAcademicIdentityScope } from '../utils/profile-academic-filters.js';

const router = Router();

const evaluationSchema = z.object({
  academicAssignmentId: z.string().uuid(),
  title: z.string().trim().min(3).max(180),
  evaluationType: z.enum(['diagnostica', 'tarea', 'taller', 'prueba', 'proyecto', 'examen', 'quimestre']),
  periodLabel: z.string().trim().min(2).max(80),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
  maxScore: z.coerce.number().positive().max(100),
  weightPercentage: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : value),
    z.coerce.number().min(0).max(100).nullable(),
  ).optional(),
  description: z.string().max(600).optional().or(z.literal('')),
});

const evaluationParamsSchema = z.object({
  id: z.string().uuid(),
});

async function resolveInstitutionId(preferredInstitutionId?: string | null) {
  if (preferredInstitutionId) {
    const institution = await pool.query(
      `
        SELECT id, name, active_school_year_label AS "activeSchoolYearLabel"
        FROM edu_institutions
        WHERE id = $1
        LIMIT 1
      `,
      [preferredInstitutionId],
    );

    if (institution.rows[0]) {
      return institution.rows[0] as { id: string; name: string; activeSchoolYearLabel?: string | null };
    }
  }

  const fallback = await pool.query(
    `
      SELECT id, name, active_school_year_label AS "activeSchoolYearLabel"
      FROM edu_institutions
      ORDER BY created_at ASC
      LIMIT 1
    `,
  );

  if (!fallback.rows[0]) {
    throw new Error('No hay una institución base configurada.');
  }

  return fallback.rows[0] as { id: string; name: string; activeSchoolYearLabel?: string | null };
}

async function resolveAssignment(client: Pick<typeof pool, 'query'>, institutionId: string, academicAssignmentId: string) {
  const result = await client.query(
    `
      SELECT
        aa.id,
        aa.teacher_id AS "teacherId",
        aa.subject_id AS "subjectId",
        aa.level_id AS "levelId",
        aa.grade_id AS "gradeId",
        aa.section_id AS "sectionId",
        t.full_name AS "teacherName",
        t.status AS "teacherStatus",
        sub.name AS "subjectName",
        sub.code AS "subjectCode",
        sub.status AS "subjectStatus",
        l.name AS "levelName",
        g.name AS "gradeName",
        s.name AS "sectionName"
      FROM edu_academic_assignments aa
      INNER JOIN edu_teachers t ON t.id = aa.teacher_id
      INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
      INNER JOIN edu_academic_levels l ON l.id = aa.level_id
      INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
      LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
      WHERE aa.id = $1 AND aa.institution_id = $2
      LIMIT 1
    `,
    [academicAssignmentId, institutionId],
  );

  const assignment = result.rows[0] as {
    id: string;
    teacherId: string;
    subjectId: string;
    levelId: string;
    gradeId: string;
    sectionId?: string | null;
    teacherName: string;
    teacherStatus: 'active' | 'inactive' | 'licencia';
    subjectName: string;
    subjectCode: string;
    subjectStatus: 'active' | 'inactive';
    levelName: string;
    gradeName: string;
    sectionName?: string | null;
  } | undefined;

  if (!assignment) {
    throw new Error('La asignación académica seleccionada no existe en la institución actual.');
  }

  if (assignment.subjectStatus !== 'active') {
    throw new Error('La materia de la asignación seleccionada está inactiva.');
  }

  return assignment;
}

router.get('/', requireAuth, async (request, response) => {
  if (!canReadAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar evaluaciones.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const scope = await resolveAcademicIdentityScope(request.auth, institution.id);
  const evaluationConditions = ['e.institution_id = $1'];
  const evaluationValues: Array<string | string[]> = [institution.id];
  const assignmentConditions = ['aa.institution_id = $1'];
  const assignmentValues: Array<string | string[]> = [institution.id];

  appendTeacherAssignmentScope(scope, evaluationConditions, evaluationValues, 'aa.teacher_id');
  appendStudentScope(scope, evaluationConditions, evaluationValues, 'eg.student_id');
  appendRepresentativeScope(scope, evaluationConditions, evaluationValues, 'eg.student_id');
  appendTeacherAssignmentScope(scope, assignmentConditions, assignmentValues, 'aa.teacher_id');

  const [evaluationsResult, assignmentsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          e.id,
          e.academic_assignment_id AS "academicAssignmentId",
          e.school_year_label AS "schoolYearLabel",
          e.title,
          e.evaluation_type AS "evaluationType",
          e.period_label AS "periodLabel",
          e.due_date AS "dueDate",
          e.max_score::float8 AS "maxScore",
          e.weight_percentage::float8 AS "weightPercentage",
          e.description,
          e.created_at AS "createdAt",
          aa.teacher_id AS "teacherId",
          aa.subject_id AS "subjectId",
          aa.level_id AS "levelId",
          aa.grade_id AS "gradeId",
          aa.section_id AS "sectionId",
          t.full_name AS "teacherName",
          sub.name AS "subjectName",
          sub.code AS "subjectCode",
          l.name AS "levelName",
          g.name AS "gradeName",
          s.name AS "sectionName",
          COUNT(eg.id)::int AS "registeredGrades"
        FROM edu_evaluations e
        INNER JOIN edu_academic_assignments aa ON aa.id = e.academic_assignment_id
        INNER JOIN edu_teachers t ON t.id = aa.teacher_id
        INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
        INNER JOIN edu_academic_levels l ON l.id = aa.level_id
        INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
        LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
        LEFT JOIN edu_evaluation_grades eg ON eg.evaluation_id = e.id
        WHERE ${evaluationConditions.join(' AND ')}
        GROUP BY e.id, aa.id, t.id, sub.id, l.id, g.id, s.id
        ORDER BY COALESCE(e.due_date, CURRENT_DATE) DESC, e.created_at DESC
      `,
      evaluationValues,
    ),
    pool.query(
      `
        SELECT
          aa.id,
          aa.teacher_id AS "teacherId",
          aa.subject_id AS "subjectId",
          aa.level_id AS "levelId",
          aa.grade_id AS "gradeId",
          aa.section_id AS "sectionId",
          aa.weekly_hours AS "weeklyHours",
          aa.notes,
          t.full_name AS "teacherName",
          t.status AS "teacherStatus",
          sub.name AS "subjectName",
          sub.code AS "subjectCode",
          sub.status AS "subjectStatus",
          l.name AS "levelName",
          g.name AS "gradeName",
          s.name AS "sectionName"
        FROM edu_academic_assignments aa
        INNER JOIN edu_teachers t ON t.id = aa.teacher_id
        INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
        INNER JOIN edu_academic_levels l ON l.id = aa.level_id
        INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
        LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
        WHERE ${assignmentConditions.join(' AND ')}
        ORDER BY t.full_name ASC, sub.name ASC, g.sort_order ASC, s.name ASC NULLS FIRST, aa.created_at DESC
      `,
      assignmentValues,
    ),
  ]);

  const sectionScoped = evaluationsResult.rows.filter((row) => Boolean(row.sectionId)).length;
  const registeredGrades = evaluationsResult.rows.reduce((total, row) => total + Number(row.registeredGrades ?? 0), 0);

  return response.json(successResponse('Evaluaciones cargadas.', {
    institution,
    summary: {
      evaluations: evaluationsResult.rows.length,
      sectionScoped,
      registeredGrades,
    },
    evaluations: evaluationsResult.rows,
    assignments: assignmentsResult.rows,
  }));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canWorkOnEvaluations(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear evaluaciones.' });
  }

  const payload = evaluationSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const schoolYearLabel = institution.activeSchoolYearLabel?.trim() || new Date().getFullYear().toString();
  const client = await pool.connect();

  try {
    const assignment = await resolveAssignment(client, institution.id, payload.academicAssignmentId);
    const result = await client.query(
      `
        INSERT INTO edu_evaluations (
          institution_id,
          academic_assignment_id,
          school_year_label,
          title,
          evaluation_type,
          period_label,
          due_date,
          max_score,
          weight_percentage,
          description
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING
          id,
          academic_assignment_id AS "academicAssignmentId",
          school_year_label AS "schoolYearLabel",
          title,
          evaluation_type AS "evaluationType",
          period_label AS "periodLabel",
          due_date AS "dueDate",
          max_score::float8 AS "maxScore",
          weight_percentage::float8 AS "weightPercentage",
          description,
          created_at AS "createdAt"
      `,
      [
        institution.id,
        payload.academicAssignmentId,
        schoolYearLabel,
        payload.title.trim(),
        payload.evaluationType,
        payload.periodLabel.trim(),
        payload.dueDate?.trim() || null,
        payload.maxScore,
        payload.weightPercentage ?? null,
        payload.description?.trim() || null,
      ],
    );

    return response.status(201).json(successResponse('Evaluación creada.', {
      ...result.rows[0],
      teacherId: assignment.teacherId,
      subjectId: assignment.subjectId,
      levelId: assignment.levelId,
      gradeId: assignment.gradeId,
      sectionId: assignment.sectionId,
      teacherName: assignment.teacherName,
      subjectName: assignment.subjectName,
      subjectCode: assignment.subjectCode,
      levelName: assignment.levelName,
      gradeName: assignment.gradeName,
      sectionName: assignment.sectionName,
      registeredGrades: 0,
    }));
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('no existe en la institución actual')
      || error.message.includes('está inactiva')
    )) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

router.patch('/:id', requireAuth, async (request, response) => {
  if (!canWorkOnEvaluations(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para actualizar evaluaciones.' });
  }

  const params = evaluationParamsSchema.parse(request.params);
  const payload = evaluationSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const client = await pool.connect();

  try {
    const assignment = await resolveAssignment(client, institution.id, payload.academicAssignmentId);
    const result = await client.query(
      `
        UPDATE edu_evaluations
        SET
          academic_assignment_id = $1,
          title = $2,
          evaluation_type = $3,
          period_label = $4,
          due_date = $5,
          max_score = $6,
          weight_percentage = $7,
          description = $8,
          updated_at = NOW()
        WHERE id = $9 AND institution_id = $10
        RETURNING
          id,
          academic_assignment_id AS "academicAssignmentId",
          school_year_label AS "schoolYearLabel",
          title,
          evaluation_type AS "evaluationType",
          period_label AS "periodLabel",
          due_date AS "dueDate",
          max_score::float8 AS "maxScore",
          weight_percentage::float8 AS "weightPercentage",
          description,
          created_at AS "createdAt"
      `,
      [
        payload.academicAssignmentId,
        payload.title.trim(),
        payload.evaluationType,
        payload.periodLabel.trim(),
        payload.dueDate?.trim() || null,
        payload.maxScore,
        payload.weightPercentage ?? null,
        payload.description?.trim() || null,
        params.id,
        institution.id,
      ],
    );

    if (!result.rows[0]) {
      return response.status(404).json({ success: false, message: 'La evaluación seleccionada no existe en la institución actual.' });
    }

    const gradesResult = await client.query(
      `SELECT COUNT(*)::int AS total FROM edu_evaluation_grades WHERE evaluation_id = $1`,
      [params.id],
    );

    return response.json(successResponse('Evaluación actualizada.', {
      ...result.rows[0],
      teacherId: assignment.teacherId,
      subjectId: assignment.subjectId,
      levelId: assignment.levelId,
      gradeId: assignment.gradeId,
      sectionId: assignment.sectionId,
      teacherName: assignment.teacherName,
      subjectName: assignment.subjectName,
      subjectCode: assignment.subjectCode,
      levelName: assignment.levelName,
      gradeName: assignment.gradeName,
      sectionName: assignment.sectionName,
      registeredGrades: gradesResult.rows[0]?.total ?? 0,
    }));
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('no existe en la institución actual')
      || error.message.includes('está inactiva')
    )) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

export default router;
