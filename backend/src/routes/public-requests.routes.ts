import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageUsers } from '../utils/access-control.js';

const router = Router();

const publicRequestSchema = z.object({
  fullName: z.string().min(3, 'Ingresa tu nombre completo.').max(180),
  email: z.string().email('Ingresa un correo válido.').max(180),
  relationship: z.enum(['familia', 'docente', 'administrativo', 'aspirante']),
  requestType: z.enum(['acceso', 'admision', 'informacion']),
  message: z.string().max(1500).optional().or(z.literal('')),
  sourceContext: z.string().max(120).optional().or(z.literal('')),
});

function isSuperAdmin(roleCodes: string[] | undefined) {
  return (roleCodes ?? []).includes('superadmin');
}

router.post('/', async (request, response) => {
  const payload = publicRequestSchema.parse(request.body);

  const fallbackInstitution = await pool.query(
    `SELECT id FROM edu_institutions ORDER BY created_at ASC LIMIT 1`,
  );
  const institutionId = fallbackInstitution.rows[0]?.id ?? null;

  const result = await pool.query(
    `
      INSERT INTO edu_public_requests (
        institution_id,
        full_name,
        email,
        relationship,
        request_type,
        message,
        source_context
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        full_name AS "fullName",
        email,
        relationship,
        request_type AS "requestType",
        status,
        created_at AS "createdAt"
    `,
    [
      institutionId,
      payload.fullName,
      payload.email.trim().toLowerCase(),
      payload.relationship,
      payload.requestType,
      payload.message?.trim() || null,
      payload.sourceContext?.trim() || null,
    ],
  );

  return response.status(201).json(successResponse('Solicitud registrada correctamente.', result.rows[0]));
});

router.get('/', requireAuth, async (request, response) => {
  if (!canManageUsers(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar solicitudes públicas.' });
  }

  const scopedInstitutionId = isSuperAdmin(request.auth?.roleCodes) ? null : request.auth?.institutionId;
  const whereClause = scopedInstitutionId ? 'WHERE pr.institution_id = $1' : '';
  const values = scopedInstitutionId ? [scopedInstitutionId] : [];

  const result = await pool.query(
    `
      SELECT
        pr.id,
        pr.institution_id AS "institutionId",
        i.name AS "institutionName",
        pr.full_name AS "fullName",
        pr.email,
        pr.relationship,
        pr.request_type AS "requestType",
        pr.message,
        pr.source_context AS "sourceContext",
        pr.status,
        pr.created_at AS "createdAt"
      FROM edu_public_requests pr
      LEFT JOIN edu_institutions i ON i.id = pr.institution_id
      ${whereClause}
      ORDER BY pr.created_at DESC
      LIMIT 100
    `,
    values,
  );

  return response.json(successResponse('Solicitudes públicas cargadas.', result.rows));
});

export default router;
