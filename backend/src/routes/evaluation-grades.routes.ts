import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canReadAcademic, canWorkOnEvaluations } from '../utils/access-control.js';
import { appendRepresentativeScope, appendStudentScope, appendTeacherAssignmentScope, resolveAcademicIdentityScope } from '../utils/profile-academic-filters.js';

const router = Router();

const gradeSchema = z.object({
  evaluationId: z.string().uuid(),
  studentId: z.string().uuid(),
  score: z.coerce.number().min(0).max(100),
  feedback: z.string().max(600).optional().or(z.literal('')),
  gradedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal('')),
});

const gradeParamsSchema = z.object({
  id: z.string().uuid(),
});

const gradeFiltersSchema = z.object({
  evaluationId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
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

async function resolveEvaluation(client: Pick<typeof pool, 'query'>, institutionId: string, evaluationId: string) {
  const result = await client.query(
    `
      SELECT
        e.id,
        e.school_year_label AS "schoolYearLabel",
        e.title,
        e.evaluation_type AS "evaluationType",
        e.period_label AS "periodLabel",
        e.max_score::float8 AS "maxScore",
        aa.id AS "academicAssignmentId",
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
        s.name AS "sectionName"
      FROM edu_evaluations e
      INNER JOIN edu_academic_assignments aa ON aa.id = e.academic_assignment_id
      INNER JOIN edu_teachers t ON t.id = aa.teacher_id
      INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
      INNER JOIN edu_academic_levels l ON l.id = aa.level_id
      INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
      LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
      WHERE e.id = $1 AND e.institution_id = $2
      LIMIT 1
    `,
    [evaluationId, institutionId],
  );

  const evaluation = result.rows[0] as {
    id: string;
    schoolYearLabel: string;
    title: string;
    evaluationType: string;
    periodLabel: string;
    maxScore: number;
    academicAssignmentId: string;
    teacherId: string;
    subjectId: string;
    levelId: string;
    gradeId: string;
    sectionId?: string | null;
    teacherName: string;
    subjectName: string;
    subjectCode: string;
    levelName: string;
    gradeName: string;
    sectionName?: string | null;
  } | undefined;

  if (!evaluation) {
    throw new Error('La evaluación seleccionada no existe en la institución actual.');
  }

  return evaluation;
}

async function resolveEligibleEnrollment(
  client: Pick<typeof pool, 'query'>,
  institutionId: string,
  studentId: string,
  evaluation: Awaited<ReturnType<typeof resolveEvaluation>>,
) {
  const result = await client.query(
    `
      SELECT
        e.id AS "enrollmentId",
        e.school_year_label AS "schoolYearLabel",
        e.status AS "enrollmentStatus",
        st.id AS "studentId",
        st.full_name AS "studentName",
        st.identity_document AS "studentDocument",
        st.enrollment_code AS "studentEnrollmentCode",
        s.id AS "sectionId",
        s.name AS "sectionName",
        g.id AS "gradeId",
        g.name AS "gradeName",
        l.id AS "levelId",
        l.name AS "levelName"
      FROM edu_enrollments e
      INNER JOIN edu_students st ON st.id = e.student_id
      INNER JOIN edu_academic_sections s ON s.id = e.section_id
      INNER JOIN edu_academic_grades g ON g.id = s.grade_id
      INNER JOIN edu_academic_levels l ON l.id = g.level_id
      WHERE e.student_id = $1
        AND e.institution_id = $2
        AND e.school_year_label = $3
        AND e.status = 'active'
      ORDER BY e.enrollment_date DESC, e.created_at DESC
      LIMIT 1
    `,
    [studentId, institutionId, evaluation.schoolYearLabel],
  );

  const enrollment = result.rows[0] as {
    enrollmentId: string;
    schoolYearLabel: string;
    enrollmentStatus: 'active';
    studentId: string;
    studentName: string;
    studentDocument: string;
    studentEnrollmentCode: string;
    sectionId: string;
    sectionName: string;
    gradeId: string;
    gradeName: string;
    levelId: string;
    levelName: string;
  } | undefined;

  if (!enrollment) {
    throw new Error('El estudiante no tiene una matrícula activa en el periodo escolar de la evaluación.');
  }

  if (evaluation.sectionId) {
    if (enrollment.sectionId !== evaluation.sectionId) {
      throw new Error('El estudiante no pertenece a la sección cubierta por la evaluación seleccionada.');
    }
  } else if (enrollment.gradeId !== evaluation.gradeId || enrollment.levelId !== evaluation.levelId) {
    throw new Error('El estudiante no pertenece al curso o grado cubierto por la evaluación seleccionada.');
  }

  return enrollment;
}

router.get('/', requireAuth, async (request, response) => {
  if (!canReadAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar calificaciones.' });
  }

  const filters = gradeFiltersSchema.parse(request.query);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const scope = await resolveAcademicIdentityScope(request.auth, institution.id);
  const conditions = ['eg.institution_id = $1'];
  const values: Array<string | string[]> = [institution.id];

  appendTeacherAssignmentScope(scope, conditions, values, 'aa.teacher_id');
  appendStudentScope(scope, conditions, values, 'eg.student_id');
  appendRepresentativeScope(scope, conditions, values, 'eg.student_id');

  if (filters.evaluationId) {
    values.push(filters.evaluationId);
    conditions.push(`eg.evaluation_id = $${values.length}`);
  }

  if (filters.studentId) {
    values.push(filters.studentId);
    conditions.push(`eg.student_id = $${values.length}`);
  }

  const whereClause = conditions.join(' AND ');

  const [gradesResult, evaluationsResult, studentsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          eg.id,
          eg.evaluation_id AS "evaluationId",
          eg.student_id AS "studentId",
          eg.enrollment_id AS "enrollmentId",
          eg.score::float8 AS "score",
          eg.feedback,
          eg.graded_at AS "gradedAt",
          eg.created_at AS "createdAt",
          e.title AS "evaluationTitle",
          e.evaluation_type AS "evaluationType",
          e.period_label AS "periodLabel",
          e.max_score::float8 AS "maxScore",
          e.school_year_label AS "schoolYearLabel",
          st.full_name AS "studentName",
          st.identity_document AS "studentDocument",
          st.enrollment_code AS "studentEnrollmentCode",
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
          s.name AS "sectionName"
        FROM edu_evaluation_grades eg
        INNER JOIN edu_evaluations e ON e.id = eg.evaluation_id
        INNER JOIN edu_students st ON st.id = eg.student_id
        INNER JOIN edu_academic_assignments aa ON aa.id = e.academic_assignment_id
        INNER JOIN edu_teachers t ON t.id = aa.teacher_id
        INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
        INNER JOIN edu_academic_levels l ON l.id = aa.level_id
        INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
        LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
        WHERE ${whereClause}
        ORDER BY eg.graded_at DESC, eg.created_at DESC
      `,
      values,
    ),
    pool.query(
      `
        SELECT
          e.id,
          e.title,
          e.evaluation_type AS "evaluationType",
          e.period_label AS "periodLabel",
          e.max_score::float8 AS "maxScore",
          e.school_year_label AS "schoolYearLabel",
          e.due_date AS "dueDate",
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
          s.name AS "sectionName"
        FROM edu_evaluations e
        INNER JOIN edu_academic_assignments aa ON aa.id = e.academic_assignment_id
        INNER JOIN edu_teachers t ON t.id = aa.teacher_id
        INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
        INNER JOIN edu_academic_levels l ON l.id = aa.level_id
        INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
        LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
        WHERE e.institution_id = $1
        ORDER BY COALESCE(e.due_date, CURRENT_DATE) DESC, e.created_at DESC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          st.id,
          st.full_name AS "fullName",
          st.identity_document AS "identityDocument",
          st.enrollment_code AS "enrollmentCode",
          e.id AS "enrollmentId",
          e.school_year_label AS "schoolYearLabel",
          l.id AS "levelId",
          l.name AS "levelName",
          g.id AS "gradeId",
          g.name AS "gradeName",
          s.id AS "sectionId",
          s.name AS "sectionName"
        FROM edu_enrollments e
        INNER JOIN edu_students st ON st.id = e.student_id
        INNER JOIN edu_academic_sections s ON s.id = e.section_id
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE e.institution_id = $1
          AND e.status = 'active'
          AND (
            $2::boolean = TRUE
            OR ($3::boolean = TRUE AND st.id = $4::uuid)
            OR ($5::boolean = TRUE AND st.id = ANY($6::uuid[]))
            OR ($7::boolean = FALSE AND $8::boolean = FALSE)
          )
        ORDER BY st.full_name ASC, e.created_at DESC
      `,
      [
        institution.id,
        scope.isGlobalScope,
        scope.isStudent && Boolean(scope.studentId),
        scope.studentId ?? null,
        scope.isRepresentative && scope.representativeStudentIds.length > 0,
        scope.representativeStudentIds,
        scope.isStudent,
        scope.isRepresentative,
      ],
    ),
  ]);

  const scores = gradesResult.rows.map((row) => Number(row.score ?? 0));
  const averageScore = scores.length > 0 ? Number((scores.reduce((total, score) => total + score, 0) / scores.length).toFixed(2)) : null;

  return response.json(successResponse('Calificaciones cargadas.', {
    institution,
    filters,
    summary: {
      grades: gradesResult.rows.length,
      uniqueStudents: new Set(gradesResult.rows.map((row) => row.studentId as string)).size,
      evaluationsCovered: new Set(gradesResult.rows.map((row) => row.evaluationId as string)).size,
      averageScore,
    },
    grades: gradesResult.rows,
    options: {
      evaluations: evaluationsResult.rows,
      students: studentsResult.rows,
    },
  }));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canWorkOnEvaluations(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para registrar calificaciones.' });
  }

  const payload = gradeSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const evaluation = await resolveEvaluation(client, institution.id, payload.evaluationId);
    const enrollment = await resolveEligibleEnrollment(client, institution.id, payload.studentId, evaluation);

    if (payload.score > evaluation.maxScore) {
      throw new Error(`La nota no puede superar el puntaje máximo de ${evaluation.maxScore}.`);
    }

    const result = await client.query(
      `
        INSERT INTO edu_evaluation_grades (
          institution_id,
          evaluation_id,
          student_id,
          enrollment_id,
          score,
          feedback,
          graded_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          evaluation_id AS "evaluationId",
          student_id AS "studentId",
          enrollment_id AS "enrollmentId",
          score::float8 AS "score",
          feedback,
          graded_at AS "gradedAt",
          created_at AS "createdAt"
      `,
      [
        institution.id,
        payload.evaluationId,
        payload.studentId,
        enrollment.enrollmentId,
        payload.score,
        payload.feedback?.trim() || null,
        payload.gradedAt?.trim() || new Date().toISOString().slice(0, 10),
      ],
    );

    await client.query('COMMIT');

    return response.status(201).json(successResponse('Calificación registrada.', {
      ...result.rows[0],
      evaluationTitle: evaluation.title,
      evaluationType: evaluation.evaluationType,
      periodLabel: evaluation.periodLabel,
      maxScore: evaluation.maxScore,
      schoolYearLabel: evaluation.schoolYearLabel,
      studentName: enrollment.studentName,
      studentDocument: enrollment.studentDocument,
      studentEnrollmentCode: enrollment.studentEnrollmentCode,
      teacherId: evaluation.teacherId,
      subjectId: evaluation.subjectId,
      levelId: evaluation.levelId,
      gradeId: evaluation.gradeId,
      sectionId: evaluation.sectionId,
      teacherName: evaluation.teacherName,
      subjectName: evaluation.subjectName,
      subjectCode: evaluation.subjectCode,
      levelName: evaluation.levelName,
      gradeName: evaluation.gradeName,
      sectionName: evaluation.sectionName,
    }));
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof Error && (
      error.message.includes('no existe en la institución actual')
      || error.message.includes('no tiene una matrícula activa')
      || error.message.includes('no pertenece')
      || error.message.includes('no puede superar el puntaje máximo')
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
    return response.status(403).json({ success: false, message: 'No tienes permisos para actualizar calificaciones.' });
  }

  const params = gradeParamsSchema.parse(request.params);
  const payload = gradeSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const evaluation = await resolveEvaluation(client, institution.id, payload.evaluationId);
    const enrollment = await resolveEligibleEnrollment(client, institution.id, payload.studentId, evaluation);

    if (payload.score > evaluation.maxScore) {
      throw new Error(`La nota no puede superar el puntaje máximo de ${evaluation.maxScore}.`);
    }

    const result = await client.query(
      `
        UPDATE edu_evaluation_grades
        SET
          evaluation_id = $1,
          student_id = $2,
          enrollment_id = $3,
          score = $4,
          feedback = $5,
          graded_at = $6,
          updated_at = NOW()
        WHERE id = $7 AND institution_id = $8
        RETURNING
          id,
          evaluation_id AS "evaluationId",
          student_id AS "studentId",
          enrollment_id AS "enrollmentId",
          score::float8 AS "score",
          feedback,
          graded_at AS "gradedAt",
          created_at AS "createdAt"
      `,
      [
        payload.evaluationId,
        payload.studentId,
        enrollment.enrollmentId,
        payload.score,
        payload.feedback?.trim() || null,
        payload.gradedAt?.trim() || new Date().toISOString().slice(0, 10),
        params.id,
        institution.id,
      ],
    );

    if (!result.rows[0]) {
      await client.query('ROLLBACK');
      return response.status(404).json({ success: false, message: 'La calificación seleccionada no existe en la institución actual.' });
    }

    await client.query('COMMIT');

    return response.json(successResponse('Calificación actualizada.', {
      ...result.rows[0],
      evaluationTitle: evaluation.title,
      evaluationType: evaluation.evaluationType,
      periodLabel: evaluation.periodLabel,
      maxScore: evaluation.maxScore,
      schoolYearLabel: evaluation.schoolYearLabel,
      studentName: enrollment.studentName,
      studentDocument: enrollment.studentDocument,
      studentEnrollmentCode: enrollment.studentEnrollmentCode,
      teacherId: evaluation.teacherId,
      subjectId: evaluation.subjectId,
      levelId: evaluation.levelId,
      gradeId: evaluation.gradeId,
      sectionId: evaluation.sectionId,
      teacherName: evaluation.teacherName,
      subjectName: evaluation.subjectName,
      subjectCode: evaluation.subjectCode,
      levelName: evaluation.levelName,
      gradeName: evaluation.gradeName,
      sectionName: evaluation.sectionName,
    }));
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof Error && (
      error.message.includes('no existe en la institución actual')
      || error.message.includes('no tiene una matrícula activa')
      || error.message.includes('no pertenece')
      || error.message.includes('no puede superar el puntaje máximo')
    )) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

export default router;
