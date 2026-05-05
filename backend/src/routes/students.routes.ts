import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageAcademic, canReadAcademic } from '../utils/access-control.js';
import { appendRepresentativeScope, appendStudentScope, resolveAcademicIdentityScope } from '../utils/profile-academic-filters.js';

const router = Router();

const studentSchema = z.object({
  fullName: z.string().min(3).max(180),
  identityDocument: z.string().min(3).max(40),
  enrollmentCode: z.string().min(3).max(40),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'retirado']).default('active'),
  levelId: z.string().uuid(),
  gradeId: z.string().uuid(),
  sectionId: z.string().uuid(),
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

async function resolveAcademicPlacement(
  client: Pick<typeof pool, 'query'>,
  institutionId: string,
  payload: z.infer<typeof studentSchema>,
) {
  const sectionResult = await client.query(
    `
      SELECT
        s.id,
        s.grade_id AS "gradeId",
        s.name,
        g.id AS "resolvedGradeId",
        g.level_id AS "levelId",
        g.name AS "gradeName",
        l.id AS "resolvedLevelId",
        l.name AS "levelName"
      FROM edu_academic_sections s
      INNER JOIN edu_academic_grades g ON g.id = s.grade_id
      INNER JOIN edu_academic_levels l ON l.id = g.level_id
      WHERE s.id = $1 AND s.institution_id = $2
      LIMIT 1
    `,
    [payload.sectionId, institutionId],
  );

  const section = sectionResult.rows[0] as {
    id: string;
    gradeId: string;
    name: string;
    resolvedGradeId: string;
    levelId: string;
    gradeName: string;
    resolvedLevelId: string;
    levelName: string;
  } | undefined;

  if (!section) {
    throw new Error('La sección seleccionada no existe en la institución actual.');
  }

  if (payload.gradeId !== section.resolvedGradeId) {
    throw new Error('El curso o grado no coincide con la sección seleccionada.');
  }

  if (payload.levelId !== section.resolvedLevelId) {
    throw new Error('El nivel no coincide con la sección seleccionada.');
  }

  return {
    levelId: section.resolvedLevelId,
    gradeId: section.resolvedGradeId,
    sectionId: section.id,
    levelName: section.levelName,
    gradeName: section.gradeName,
    sectionName: section.name,
  };
}

router.get('/', requireAuth, async (request, response) => {
  if (!canReadAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar estudiantes.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const scope = await resolveAcademicIdentityScope(request.auth, institution.id);
  const studentConditions = ['st.institution_id = $1'];
  const studentValues: Array<string | string[]> = [institution.id];

  appendStudentScope(scope, studentConditions, studentValues, 'st.id');
  appendRepresentativeScope(scope, studentConditions, studentValues, 'st.id');

  const [studentsResult, levelsResult, gradesResult, sectionsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          st.id,
          st.full_name AS "fullName",
          st.identity_document AS "identityDocument",
          st.enrollment_code AS "enrollmentCode",
          st.email,
          st.phone,
          st.status,
          st.level_id AS "levelId",
          st.grade_id AS "gradeId",
          st.section_id AS "sectionId",
          l.name AS "levelName",
          g.name AS "gradeName",
          s.name AS "sectionName",
          s.shift,
          st.created_at AS "createdAt"
        FROM edu_students st
        INNER JOIN edu_academic_levels l ON l.id = st.level_id
        INNER JOIN edu_academic_grades g ON g.id = st.grade_id
        INNER JOIN edu_academic_sections s ON s.id = st.section_id
        WHERE ${studentConditions.join(' AND ')}
        ORDER BY st.created_at DESC
      `,
      studentValues,
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

  const activeStudents = studentsResult.rows.filter((row) => row.status === 'active').length;

  return response.json(successResponse('Estudiantes cargados.', {
    institution,
    summary: {
      students: studentsResult.rows.length,
      activeStudents,
      sectionsInUse: new Set(studentsResult.rows.map((row) => row.sectionId as string)).size,
    },
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
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear estudiantes.' });
  }

  const payload = studentSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const client = await pool.connect();

  try {
    const placement = await resolveAcademicPlacement(client, institution.id, payload);

    const result = await client.query(
      `
        INSERT INTO edu_students (
          institution_id,
          level_id,
          grade_id,
          section_id,
          full_name,
          identity_document,
          enrollment_code,
          email,
          phone,
          status
        ) VALUES ($1, $2, $3, $4, $5, UPPER($6), UPPER($7), $8, $9, $10)
        RETURNING
          id,
          full_name AS "fullName",
          identity_document AS "identityDocument",
          enrollment_code AS "enrollmentCode",
          email,
          phone,
          status,
          level_id AS "levelId",
          grade_id AS "gradeId",
          section_id AS "sectionId",
          created_at AS "createdAt"
      `,
      [
        institution.id,
        placement.levelId,
        placement.gradeId,
        placement.sectionId,
        payload.fullName,
        payload.identityDocument,
        payload.enrollmentCode,
        payload.email?.trim() || null,
        payload.phone?.trim() || null,
        payload.status,
      ],
    );

    return response.status(201).json(successResponse('Estudiante creado.', {
      ...result.rows[0],
      levelName: placement.levelName,
      gradeName: placement.gradeName,
      sectionName: placement.sectionName,
    }));
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('no existe en la institución actual')
      || error.message.includes('no coincide con la sección seleccionada')
    )) {
      return response.status(400).json({ success: false, message: error.message });
    }

    throw error;
  } finally {
    client.release();
  }
});

export default router;
