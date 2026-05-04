import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { env } from '../config/env.js';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';

const router = Router();

const loginSchema = z.object({
  email: z.string().email().optional(),
  identifier: z.string().min(1).optional(),
  password: z.string().min(6),
}).superRefine((value, ctx) => {
  if (!value.email && !value.identifier) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['email'],
      message: 'Ingresa tu usuario o correo institucional.',
    });
  }
});

function buildInstitutionalEmail(identifier: string) {
  const normalized = identifier.trim().toLowerCase();

  if (!normalized) return '';
  if (normalized.includes('@')) return normalized;

  return `${normalized}@educa.local`;
}

router.post('/login', async (request, response) => {
  const payload = loginSchema.parse(request.body);
  const email = payload.email?.trim().toLowerCase() || buildInstitutionalEmail(payload.identifier ?? '');

  const query = await pool.query(
    `
      SELECT
        u.id,
        u.institution_id,
        u.full_name,
        u.email,
        u.status,
        COALESCE(array_agg(r.code) FILTER (WHERE r.code IS NOT NULL), '{}') AS role_codes
      FROM edu_users u
      LEFT JOIN edu_user_roles ur ON ur.user_id = u.id
      LEFT JOIN edu_roles r ON r.id = ur.role_id
      WHERE u.email = $1
        AND u.password_hash = crypt($2, u.password_hash)
      GROUP BY u.id
      LIMIT 1
    `,
    [email, payload.password],
  );

  const user = query.rows[0] as {
    id: string;
    institution_id: string | null;
    full_name: string;
    email: string;
    status: 'pending' | 'active' | 'blocked';
    role_codes: string[];
  } | undefined;

  if (!user) {
    return response.status(401).json({ success: false, message: 'Credenciales inválidas.' });
  }

  if (user.status !== 'active') {
    return response.status(403).json({ success: false, message: 'El usuario no está activo.' });
  }

  const tokenPayload = {
    sub: user.id,
    email: user.email,
    roleCodes: user.role_codes,
    institutionId: user.institution_id,
  };

  const accessToken = jwt.sign(tokenPayload, env.JWT_ACCESS_SECRET, { expiresIn: '8h' });
  const refreshToken = jwt.sign(tokenPayload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  return response.json(successResponse('Autenticación correcta.', {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      status: user.status,
      roleCodes: user.role_codes,
      institutionId: user.institution_id,
    },
  }));
});

router.get('/me', requireAuth, async (request, response) => {
  const query = await pool.query(
    `
      SELECT
        u.id,
        u.institution_id,
        u.full_name,
        u.email,
        u.status,
        COALESCE(array_agg(r.code) FILTER (WHERE r.code IS NOT NULL), '{}') AS role_codes
      FROM edu_users u
      LEFT JOIN edu_user_roles ur ON ur.user_id = u.id
      LEFT JOIN edu_roles r ON r.id = ur.role_id
      WHERE u.id = $1
      GROUP BY u.id
      LIMIT 1
    `,
    [request.auth?.sub],
  );

  const user = query.rows[0];

  if (!user) {
    return response.status(404).json({ success: false, message: 'Usuario no encontrado.' });
  }

  return response.json(successResponse('Usuario actual cargado.', {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    status: user.status,
    roleCodes: user.role_codes,
    institutionId: user.institution_id,
  }));
});

export default router;
