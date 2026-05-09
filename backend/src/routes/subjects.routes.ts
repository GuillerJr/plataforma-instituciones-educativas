import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageAcademic, canReadAcademic } from '../utils/access-control.js';

const router = Router();

const subjectSchema = z.object({
  name: z.string().min(3).max(140),
  code: z.string().min(2).max(40),
  area: z.string().max(120).optional().or(z.literal('')),
  levelId: z.string().uuid().optional().or(z.literal('')),
  weeklyHours: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : value),
    z.coerce.number().int().min(1).max(60).nullable(),
  ).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
});

const subjectParamsSchema = z.object({
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
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar materias.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);

  const [subjectsResult, levelsResult] = await Promise.all([
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
          s.status,
          COALESCE(assignments.total_assignments, 0)::int AS "assignmentsCount",
          s.created_at AS "createdAt"
        FROM edu_subjects s
        LEFT JOIN edu_academic_levels l ON l.id = s.level_id
        LEFT JOIN LATERAL (
          SELECT COUNT(*) AS total_assignments
          FROM edu_academic_assignments aa
          WHERE aa.subject_id = s.id
        ) assignments ON TRUE
        WHERE s.institution_id = $1
        ORDER BY s.created_at DESC
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
  ]);

  const activeSubjects = subjectsResult.rows.filter((row) => row.status === 'active').length;
  const scopedSubjects = subjectsResult.rows.filter((row) => Boolean(row.levelId)).length;

  return response.json(successResponse('Materias cargadas.', {
    institution,
    summary: {
      subjects: subjectsResult.rows.length,
      activeSubjects,
      scopedSubjects,
    },
    subjects: subjectsResult.rows,
    academicOptions: {
      levels: levelsResult.rows,
    },
  }));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear materias.' });
  }

  const payload = subjectSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  let levelName: string | null = null;

  if (payload.levelId) {
    const levelResult = await pool.query(
      `SELECT id, name FROM edu_academic_levels WHERE id = $1 AND institution_id = $2 LIMIT 1`,
      [payload.levelId, institution.id],
    );

    if (!levelResult.rows[0]) {
      return response.status(400).json({ success: false, message: 'El nivel seleccionado no existe en la institución actual.' });
    }

    levelName = levelResult.rows[0].name as string;
  }

  const result = await pool.query(
    `
      INSERT INTO edu_subjects (institution_id, level_id, name, code, area, weekly_hours, status)
      VALUES ($1, $2, $3, UPPER($4), $5, $6, $7)
      RETURNING
        id,
        level_id AS "levelId",
        name,
        code,
        area,
        weekly_hours AS "weeklyHours",
        status,
        0::int AS "assignmentsCount",
        created_at AS "createdAt"
    `,
    [
      institution.id,
      payload.levelId || null,
      payload.name,
      payload.code,
      payload.area?.trim() || null,
      payload.weeklyHours ?? null,
      payload.status,
    ],
  );

  return response.status(201).json(successResponse('Materia creada.', {
    ...result.rows[0],
    levelName,
  }));
});

router.patch('/:id', requireAuth, async (request, response) => {
  if (!canManageAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para actualizar materias.' });
  }

  const params = subjectParamsSchema.parse(request.params);
  const payload = subjectSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);

  let levelName: string | null = null;

  if (payload.levelId) {
    const levelResult = await pool.query(
      `SELECT id, name FROM edu_academic_levels WHERE id = $1 AND institution_id = $2 LIMIT 1`,
      [payload.levelId, institution.id],
    );

    if (!levelResult.rows[0]) {
      return response.status(400).json({ success: false, message: 'El nivel seleccionado no existe en la institución actual.' });
    }

    levelName = levelResult.rows[0].name as string;
  }

  const result = await pool.query(
    `
      UPDATE edu_subjects
      SET
        level_id = $1,
        name = $2,
        code = UPPER($3),
        area = $4,
        weekly_hours = $5,
        status = $6,
        updated_at = NOW()
      WHERE id = $7 AND institution_id = $8
      RETURNING
        id,
        level_id AS "levelId",
        name,
        code,
        area,
        weekly_hours AS "weeklyHours",
        status,
        (
          SELECT COUNT(*)::int
          FROM edu_academic_assignments aa
          WHERE aa.subject_id = edu_subjects.id
        ) AS "assignmentsCount",
        created_at AS "createdAt"
    `,
    [
      payload.levelId || null,
      payload.name,
      payload.code,
      payload.area?.trim() || null,
      payload.weeklyHours ?? null,
      payload.status,
      params.id,
      institution.id,
    ],
  );

  if (!result.rows[0]) {
    return response.status(404).json({ success: false, message: 'La materia seleccionada no existe en la institución actual.' });
  }

  return response.json(successResponse('Materia actualizada.', {
    ...result.rows[0],
    levelName,
  }));
});

export default router;
