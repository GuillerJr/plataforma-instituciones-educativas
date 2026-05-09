import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageInstitution } from '../utils/access-control.js';

const router = Router();

const institutionSchema = z.object({
  name: z.string().min(3).max(180),
  slug: z.string().min(3).max(120),
  institutionType: z.enum(['publica', 'privada']),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  activeSchoolYearLabel: z.string().optional().or(z.literal('')),
});

router.get('/', requireAuth, async (request, response) => {
  if (!canManageInstitution(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar instituciones.' });
  }

  const result = await pool.query(
    `
      SELECT
        id,
        name,
        slug,
        institution_type AS "institutionType",
        contact_email AS "contactEmail",
        contact_phone AS "contactPhone",
        address,
        active_school_year_label AS "activeSchoolYearLabel",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM edu_institutions
      ORDER BY created_at DESC
    `,
  );

  return response.json(successResponse('Instituciones cargadas.', result.rows));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canManageInstitution(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para crear instituciones.' });
  }

  const payload = institutionSchema.parse(request.body);
  const result = await pool.query(
    `
      INSERT INTO edu_institutions (
        name,
        slug,
        institution_type,
        contact_email,
        contact_phone,
        address,
        active_school_year_label
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        name,
        slug,
        institution_type AS "institutionType",
        contact_email AS "contactEmail",
        contact_phone AS "contactPhone",
        address,
        active_school_year_label AS "activeSchoolYearLabel",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
    `,
    [
      payload.name,
      payload.slug,
      payload.institutionType,
      payload.contactEmail || null,
      payload.contactPhone || null,
      payload.address || null,
      payload.activeSchoolYearLabel || null,
    ],
  );

  return response.status(201).json(successResponse('Institución creada.', result.rows[0]));
});

export default router;
