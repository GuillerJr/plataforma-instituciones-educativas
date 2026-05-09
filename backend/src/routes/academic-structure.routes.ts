import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageAcademic, canReadAcademic } from '../utils/access-control.js';

const router = Router();

const levelSchema = z.object({
  name: z.string().min(3).max(120),
  code: z.string().min(2).max(40),
  educationalStage: z.enum(['inicial', 'basica', 'bachillerato']),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

const gradeSchema = z.object({
  levelId: z.string().uuid(),
  name: z.string().min(3).max(120),
  code: z.string().min(2).max(40),
  sortOrder: z.coerce.number().int().min(0).max(999),
});

const sectionSchema = z.object({
  gradeId: z.string().uuid(),
  name: z.string().min(1).max(80),
  code: z.string().min(2).max(40),
  shift: z.enum(['matutina', 'vespertina']).optional().or(z.literal('')),
  capacity: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : value),
    z.coerce.number().int().min(1).max(100).nullable(),
  ).optional(),
});

const academicEntityParamsSchema = z.object({
  id: z.string().uuid(),
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

router.get('/', requireAuth, async (request, response) => {
  if (!canReadAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar la estructura académica.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const [levelsResult, gradesResult, sectionsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          l.id,
          l.name,
          l.code,
          l.educational_stage AS "educationalStage",
          l.sort_order AS "sortOrder",
          COUNT(DISTINCT g.id)::int AS "gradesCount",
          COUNT(DISTINCT s.id)::int AS "sectionsCount",
          l.created_at AS "createdAt"
        FROM edu_academic_levels l
        LEFT JOIN edu_academic_grades g ON g.level_id = l.id
        LEFT JOIN edu_academic_sections s ON s.grade_id = g.id
        WHERE l.institution_id = $1
        GROUP BY l.id
        ORDER BY l.sort_order ASC, l.created_at ASC
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
          g.sort_order AS "sortOrder",
          COUNT(s.id)::int AS "sectionsCount",
          g.created_at AS "createdAt"
        FROM edu_academic_grades g
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        LEFT JOIN edu_academic_sections s ON s.grade_id = g.id
        WHERE g.institution_id = $1
        GROUP BY g.id, l.name, l.sort_order
        ORDER BY l.sort_order ASC, g.sort_order ASC, g.created_at ASC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          s.id,
          s.grade_id AS "gradeId",
          g.name AS "gradeName",
          l.name AS "levelName",
          s.name,
          s.code,
          s.shift,
          s.capacity,
          s.created_at AS "createdAt"
        FROM edu_academic_sections s
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE s.institution_id = $1
        ORDER BY l.sort_order ASC, g.sort_order ASC, s.name ASC, s.created_at ASC
      `,
      [institution.id],
    ),
  ]);

  return response.json(successResponse('Estructura académica cargada.', {
    institution,
    summary: {
      levels: levelsResult.rows.length,
      grades: gradesResult.rows.length,
      sections: sectionsResult.rows.length,
    },
    levels: levelsResult.rows,
    grades: gradesResult.rows,
    sections: sectionsResult.rows,
  }));
});

router.post('/levels', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear niveles académicos.' });
  }

  const payload = levelSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const result = await pool.query(
    `
      INSERT INTO edu_academic_levels (institution_id, name, code, educational_stage, sort_order)
      VALUES ($1, $2, UPPER($3), $4, $5)
      RETURNING
        id,
        name,
        code,
        educational_stage AS "educationalStage",
        sort_order AS "sortOrder",
        0::int AS "gradesCount",
        0::int AS "sectionsCount",
        created_at AS "createdAt"
    `,
    [institution.id, payload.name, payload.code, payload.educationalStage, payload.sortOrder],
  );

  return response.status(201).json(successResponse('Nivel creado.', result.rows[0]));
});

router.patch('/levels/:id', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para actualizar niveles académicos.' });
  }

  const params = academicEntityParamsSchema.parse(request.params);
  const payload = levelSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const result = await pool.query(
    `
      UPDATE edu_academic_levels
      SET
        name = $1,
        code = UPPER($2),
        educational_stage = $3,
        sort_order = $4,
        updated_at = NOW()
      WHERE id = $5 AND institution_id = $6
      RETURNING
        id,
        name,
        code,
        educational_stage AS "educationalStage",
        sort_order AS "sortOrder",
        (
          SELECT COUNT(*)::int
          FROM edu_academic_grades g
          WHERE g.level_id = edu_academic_levels.id
        ) AS "gradesCount",
        (
          SELECT COUNT(*)::int
          FROM edu_academic_sections s
          INNER JOIN edu_academic_grades g ON g.id = s.grade_id
          WHERE g.level_id = edu_academic_levels.id
        ) AS "sectionsCount",
        created_at AS "createdAt"
    `,
    [payload.name, payload.code, payload.educationalStage, payload.sortOrder, params.id, institution.id],
  );

  if (!result.rows[0]) {
    return response.status(404).json({ success: false, message: 'El nivel seleccionado no existe en la institución actual.' });
  }

  return response.json(successResponse('Nivel actualizado.', result.rows[0]));
});

router.post('/grades', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear cursos o grados.' });
  }

  const payload = gradeSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const levelResult = await pool.query(
    `SELECT id, name FROM edu_academic_levels WHERE id = $1 AND institution_id = $2 LIMIT 1`,
    [payload.levelId, institution.id],
  );

  if (!levelResult.rows[0]) {
    return response.status(400).json({ success: false, message: 'El nivel seleccionado no existe en la institución actual.' });
  }

  const result = await pool.query(
    `
      INSERT INTO edu_academic_grades (institution_id, level_id, name, code, sort_order)
      VALUES ($1, $2, $3, UPPER($4), $5)
      RETURNING
        id,
        level_id AS "levelId",
        $6::text AS "levelName",
        name,
        code,
        sort_order AS "sortOrder",
        0::int AS "sectionsCount",
        created_at AS "createdAt"
    `,
    [institution.id, payload.levelId, payload.name, payload.code, payload.sortOrder, levelResult.rows[0].name],
  );

  return response.status(201).json(successResponse('Curso o grado creado.', result.rows[0]));
});

router.patch('/grades/:id', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para actualizar cursos o grados.' });
  }

  const params = academicEntityParamsSchema.parse(request.params);
  const payload = gradeSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const levelResult = await pool.query(
    `SELECT id, name FROM edu_academic_levels WHERE id = $1 AND institution_id = $2 LIMIT 1`,
    [payload.levelId, institution.id],
  );

  if (!levelResult.rows[0]) {
    return response.status(400).json({ success: false, message: 'El nivel seleccionado no existe en la institución actual.' });
  }

  const result = await pool.query(
    `
      UPDATE edu_academic_grades
      SET
        level_id = $1,
        name = $2,
        code = UPPER($3),
        sort_order = $4,
        updated_at = NOW()
      WHERE id = $5 AND institution_id = $6
      RETURNING
        id,
        level_id AS "levelId",
        $7::text AS "levelName",
        name,
        code,
        sort_order AS "sortOrder",
        (
          SELECT COUNT(*)::int
          FROM edu_academic_sections s
          WHERE s.grade_id = edu_academic_grades.id
        ) AS "sectionsCount",
        created_at AS "createdAt"
    `,
    [payload.levelId, payload.name, payload.code, payload.sortOrder, params.id, institution.id, levelResult.rows[0].name],
  );

  if (!result.rows[0]) {
    return response.status(404).json({ success: false, message: 'El curso o grado seleccionado no existe en la institución actual.' });
  }

  return response.json(successResponse('Curso o grado actualizado.', result.rows[0]));
});

router.post('/sections', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear secciones.' });
  }

  const payload = sectionSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const gradeResult = await pool.query(
    `
      SELECT
        g.id,
        g.name,
        l.name AS "levelName"
      FROM edu_academic_grades g
      INNER JOIN edu_academic_levels l ON l.id = g.level_id
      WHERE g.id = $1 AND g.institution_id = $2
      LIMIT 1
    `,
    [payload.gradeId, institution.id],
  );

  if (!gradeResult.rows[0]) {
    return response.status(400).json({ success: false, message: 'El curso o grado seleccionado no existe en la institución actual.' });
  }

  const result = await pool.query(
    `
      INSERT INTO edu_academic_sections (institution_id, grade_id, name, code, shift, capacity)
      VALUES ($1, $2, UPPER($3), UPPER($4), $5, $6)
      RETURNING
        id,
        grade_id AS "gradeId",
        $7::text AS "gradeName",
        $8::text AS "levelName",
        name,
        code,
        shift,
        capacity,
        created_at AS "createdAt"
    `,
    [
      institution.id,
      payload.gradeId,
      payload.name,
      payload.code,
      payload.shift || null,
      payload.capacity ?? null,
      gradeResult.rows[0].name,
      gradeResult.rows[0].levelName,
    ],
  );

  return response.status(201).json(successResponse('Sección creada.', result.rows[0]));
});

router.patch('/sections/:id', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para actualizar secciones.' });
  }

  const params = academicEntityParamsSchema.parse(request.params);
  const payload = sectionSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const gradeResult = await pool.query(
    `
      SELECT
        g.id,
        g.name,
        l.name AS "levelName"
      FROM edu_academic_grades g
      INNER JOIN edu_academic_levels l ON l.id = g.level_id
      WHERE g.id = $1 AND g.institution_id = $2
      LIMIT 1
    `,
    [payload.gradeId, institution.id],
  );

  if (!gradeResult.rows[0]) {
    return response.status(400).json({ success: false, message: 'El curso o grado seleccionado no existe en la institución actual.' });
  }

  const result = await pool.query(
    `
      UPDATE edu_academic_sections
      SET
        grade_id = $1,
        name = UPPER($2),
        code = UPPER($3),
        shift = $4,
        capacity = $5,
        updated_at = NOW()
      WHERE id = $6 AND institution_id = $7
      RETURNING
        id,
        grade_id AS "gradeId",
        $8::text AS "gradeName",
        $9::text AS "levelName",
        name,
        code,
        shift,
        capacity,
        created_at AS "createdAt"
    `,
    [
      payload.gradeId,
      payload.name,
      payload.code,
      payload.shift || null,
      payload.capacity ?? null,
      params.id,
      institution.id,
      gradeResult.rows[0].name,
      gradeResult.rows[0].levelName,
    ],
  );

  if (!result.rows[0]) {
    return response.status(404).json({ success: false, message: 'La sección seleccionada no existe en la institución actual.' });
  }

  return response.json(successResponse('Sección actualizada.', result.rows[0]));
});

export default router;
