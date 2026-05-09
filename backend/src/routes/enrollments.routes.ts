import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageAcademic } from '../utils/access-control.js';

const router = Router();

const enrollmentSchema = z.object({
  studentId: z.string().uuid(),
  sectionId: z.string().uuid(),
  enrollmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['active', 'withdrawn', 'cancelled']).default('active'),
  notes: z.string().max(500).optional().or(z.literal('')),
});

const enrollmentParamsSchema = z.object({
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

async function resolveStudent(client: Pick<typeof pool, 'query'>, institutionId: string, studentId: string) {
  const result = await client.query(
    `
      SELECT
        st.id,
        st.full_name AS "fullName",
        st.identity_document AS "identityDocument",
        st.enrollment_code AS "enrollmentCode",
        st.status,
        st.section_id AS "currentSectionId",
        s.name AS "currentSectionName",
        g.name AS "currentGradeName",
        l.name AS "currentLevelName"
      FROM edu_students st
      INNER JOIN edu_academic_sections s ON s.id = st.section_id
      INNER JOIN edu_academic_grades g ON g.id = st.grade_id
      INNER JOIN edu_academic_levels l ON l.id = st.level_id
      WHERE st.id = $1 AND st.institution_id = $2
      LIMIT 1
    `,
    [studentId, institutionId],
  );

  const student = result.rows[0] as {
    id: string;
    fullName: string;
    identityDocument: string;
    enrollmentCode: string;
    status: string;
    currentSectionId: string;
    currentSectionName: string;
    currentGradeName: string;
    currentLevelName: string;
  } | undefined;

  if (!student) {
    throw new Error('El estudiante seleccionado no existe en la institución actual.');
  }

  return student;
}

async function resolveSection(client: Pick<typeof pool, 'query'>, institutionId: string, sectionId: string) {
  const result = await client.query(
    `
      SELECT
        s.id,
        s.name,
        s.shift,
        s.capacity,
        g.id AS "gradeId",
        g.name AS "gradeName",
        l.id AS "levelId",
        l.name AS "levelName"
      FROM edu_academic_sections s
      INNER JOIN edu_academic_grades g ON g.id = s.grade_id
      INNER JOIN edu_academic_levels l ON l.id = g.level_id
      WHERE s.id = $1 AND s.institution_id = $2
      LIMIT 1
    `,
    [sectionId, institutionId],
  );

  const section = result.rows[0] as {
    id: string;
    name: string;
    shift?: 'matutina' | 'vespertina' | null;
    capacity?: number | null;
    gradeId: string;
    gradeName: string;
    levelId: string;
    levelName: string;
  } | undefined;

  if (!section) {
    throw new Error('La sección seleccionada no existe en la institución actual.');
  }

  return section;
}

router.get('/', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar matrículas.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const [enrollmentsResult, studentsResult, levelsResult, gradesResult, sectionsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          e.id,
          e.student_id AS "studentId",
          e.section_id AS "sectionId",
          e.school_year_label AS "schoolYearLabel",
          e.enrollment_date AS "enrollmentDate",
          e.status,
          e.notes,
          e.created_at AS "createdAt",
          st.full_name AS "studentName",
          st.identity_document AS "studentDocument",
          st.enrollment_code AS "studentEnrollmentCode",
          l.id AS "levelId",
          l.name AS "levelName",
          g.id AS "gradeId",
          g.name AS "gradeName",
          s.name AS "sectionName",
          s.shift,
          s.capacity
        FROM edu_enrollments e
        INNER JOIN edu_students st ON st.id = e.student_id
        INNER JOIN edu_academic_sections s ON s.id = e.section_id
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE e.institution_id = $1
        ORDER BY e.enrollment_date DESC, e.created_at DESC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          st.id,
          st.full_name AS "fullName",
          st.enrollment_code AS "enrollmentCode",
          st.identity_document AS "identityDocument",
          st.status,
          st.level_id AS "levelId",
          st.grade_id AS "gradeId",
          st.section_id AS "sectionId",
          l.name AS "levelName",
          g.name AS "gradeName",
          s.name AS "sectionName"
        FROM edu_students st
        INNER JOIN edu_academic_levels l ON l.id = st.level_id
        INNER JOIN edu_academic_grades g ON g.id = st.grade_id
        INNER JOIN edu_academic_sections s ON s.id = st.section_id
        WHERE st.institution_id = $1
        ORDER BY st.full_name ASC
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
          s.shift,
          s.capacity
        FROM edu_academic_sections s
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE s.institution_id = $1
        ORDER BY l.sort_order ASC, g.sort_order ASC, s.name ASC, s.created_at ASC
      `,
      [institution.id],
    ),
  ]);

  const activeEnrollments = enrollmentsResult.rows.filter((row) => row.status === 'active').length;

  return response.json(successResponse('Matrículas cargadas.', {
    institution,
    summary: {
      enrollments: enrollmentsResult.rows.length,
      activeEnrollments,
      uniqueStudents: new Set(enrollmentsResult.rows.map((row) => row.studentId as string)).size,
      sectionsInUse: new Set(enrollmentsResult.rows.map((row) => row.sectionId as string)).size,
    },
    enrollments: enrollmentsResult.rows,
    students: studentsResult.rows,
    academicOptions: {
      levels: levelsResult.rows,
      grades: gradesResult.rows,
      sections: sectionsResult.rows,
    },
  }));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear matrículas.' });
  }

  const payload = enrollmentSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const schoolYearLabel = institution.activeSchoolYearLabel?.trim() || new Date().getFullYear().toString();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const student = await resolveStudent(client, institution.id, payload.studentId);
    const section = await resolveSection(client, institution.id, payload.sectionId);

    const result = await client.query(
      `
        INSERT INTO edu_enrollments (
          institution_id,
          student_id,
          section_id,
          school_year_label,
          enrollment_date,
          status,
          notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
          id,
          student_id AS "studentId",
          section_id AS "sectionId",
          school_year_label AS "schoolYearLabel",
          enrollment_date AS "enrollmentDate",
          status,
          notes,
          created_at AS "createdAt"
      `,
      [
        institution.id,
        payload.studentId,
        payload.sectionId,
        schoolYearLabel,
        payload.enrollmentDate ?? new Date().toISOString().slice(0, 10),
        payload.status,
        payload.notes?.trim() || null,
      ],
    );

    await client.query(
      `
        UPDATE edu_students
        SET
          level_id = $2,
          grade_id = $3,
          section_id = $4,
          updated_at = NOW()
        WHERE id = $1
      `,
      [payload.studentId, section.levelId, section.gradeId, section.id],
    );

    await client.query('COMMIT');

    return response.status(201).json(successResponse('Matrícula creada.', {
      ...result.rows[0],
      studentName: student.fullName,
      studentDocument: student.identityDocument,
      studentEnrollmentCode: student.enrollmentCode,
      levelId: section.levelId,
      levelName: section.levelName,
      gradeId: section.gradeId,
      gradeName: section.gradeName,
      sectionName: section.name,
      shift: section.shift,
      capacity: section.capacity,
    }));
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof Error && error.message.includes('no existe en la institución actual')) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

router.patch('/:id', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para actualizar matrículas.' });
  }

  const params = enrollmentParamsSchema.parse(request.params);
  const payload = enrollmentSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const student = await resolveStudent(client, institution.id, payload.studentId);
    const section = await resolveSection(client, institution.id, payload.sectionId);
    const result = await client.query(
      `
        UPDATE edu_enrollments
        SET
          student_id = $1,
          section_id = $2,
          enrollment_date = $3,
          status = $4,
          notes = $5,
          updated_at = NOW()
        WHERE id = $6 AND institution_id = $7
        RETURNING
          id,
          student_id AS "studentId",
          section_id AS "sectionId",
          school_year_label AS "schoolYearLabel",
          enrollment_date AS "enrollmentDate",
          status,
          notes,
          created_at AS "createdAt"
      `,
      [
        payload.studentId,
        payload.sectionId,
        payload.enrollmentDate ?? new Date().toISOString().slice(0, 10),
        payload.status,
        payload.notes?.trim() || null,
        params.id,
        institution.id,
      ],
    );

    if (!result.rows[0]) {
      await client.query('ROLLBACK');
      return response.status(404).json({ success: false, message: 'La matrícula seleccionada no existe en la institución actual.' });
    }

    await client.query(
      `
        UPDATE edu_students
        SET
          level_id = $2,
          grade_id = $3,
          section_id = $4,
          updated_at = NOW()
        WHERE id = $1 AND institution_id = $5
      `,
      [payload.studentId, section.levelId, section.gradeId, section.id, institution.id],
    );

    await client.query('COMMIT');

    return response.json(successResponse('Matrícula actualizada.', {
      ...result.rows[0],
      studentName: student.fullName,
      studentDocument: student.identityDocument,
      studentEnrollmentCode: student.enrollmentCode,
      levelId: section.levelId,
      levelName: section.levelName,
      gradeId: section.gradeId,
      gradeName: section.gradeName,
      sectionName: section.name,
      shift: section.shift,
      capacity: section.capacity,
    }));
  } catch (error) {
    await client.query('ROLLBACK');

    if (error instanceof Error && error.message.includes('no existe en la institución actual')) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

export default router;
