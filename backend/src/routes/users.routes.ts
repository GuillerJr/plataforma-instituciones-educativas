import { Router, type Response } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canManageUsers } from '../utils/access-control.js';

const router = Router();

const userSchema = z.object({
  institutionId: z.string().uuid().nullable().optional(),
  fullName: z.string().min(3).max(180),
  email: z.string().email(),
  password: z.string().min(8),
  status: z.enum(['pending', 'active', 'blocked']).default('active'),
  roleCodes: z.array(z.string().min(3)).min(1),
  teacherId: z.string().uuid().nullable().optional(),
  studentId: z.string().uuid().nullable().optional(),
  representativeStudentIds: z.array(z.string().uuid()).optional().default([]),
});

function isSuperAdmin(roleCodes: string[] | undefined) {
  return (roleCodes ?? []).includes('superadmin');
}

function getScopedInstitutionId(requestInstitutionId: string | null | undefined, requestedInstitutionId?: string | null) {
  if (requestInstitutionId) return requestInstitutionId;
  return requestedInstitutionId ?? null;
}

function ensureCanManageUsers(roleCodes: string[] | undefined, response: Response) {
  if (canManageUsers(roleCodes)) return true;

  response.status(403).json({ success: false, message: 'No tienes permisos para administrar usuarios.' });
  return false;
}

async function assertProfileBelongsToInstitution(
  client: Pick<typeof pool, 'query'>,
  table: 'edu_teachers' | 'edu_students',
  id: string,
  institutionId: string,
) {
  const result = await client.query(
    `SELECT id FROM ${table} WHERE id = $1 AND institution_id = $2 LIMIT 1`,
    [id, institutionId],
  );

  return Boolean(result.rows[0]);
}

router.get('/', requireAuth, async (request, response) => {
  if (!ensureCanManageUsers(request.auth?.roleCodes, response)) return;

  const scopedInstitutionId = isSuperAdmin(request.auth?.roleCodes) ? null : request.auth?.institutionId;
  const whereClause = scopedInstitutionId ? 'WHERE u.institution_id = $1' : '';
  const values = scopedInstitutionId ? [scopedInstitutionId] : [];

  const result = await pool.query(
    `
      SELECT
        u.id,
        u.institution_id AS "institutionId",
        i.name AS "institutionName",
        u.full_name AS "fullName",
        u.email,
        u.status,
        up.teacher_id AS "teacherId",
        up.student_id AS "studentId",
        COALESCE(array_agg(r.code) FILTER (WHERE r.code IS NOT NULL), '{}') AS "roleCodes",
        COALESCE(guardians.guardianships, '[]'::json) AS guardianships,
        u.created_at AS "createdAt"
      FROM edu_users u
      LEFT JOIN edu_institutions i ON i.id = u.institution_id
      LEFT JOIN edu_user_roles ur ON ur.user_id = u.id
      LEFT JOIN edu_roles r ON r.id = ur.role_id
      LEFT JOIN edu_user_profiles up ON up.user_id = u.id
      LEFT JOIN LATERAL (
        SELECT json_agg(json_build_object(
          'studentId', sg.student_id,
          'studentName', st.full_name,
          'relationshipLabel', sg.relationship_label,
          'isPrimary', sg.is_primary
        ) ORDER BY st.full_name ASC) AS guardianships
        FROM edu_student_guardians sg
        INNER JOIN edu_students st ON st.id = sg.student_id
        WHERE sg.representative_user_id = u.id
      ) guardians ON TRUE
      ${whereClause}
      GROUP BY u.id, i.name, up.teacher_id, up.student_id, guardians.guardianships
      ORDER BY u.created_at DESC
    `,
    values,
  );

  return response.json(successResponse('Usuarios cargados.', result.rows));
});

router.post('/', requireAuth, async (request, response) => {
  if (!ensureCanManageUsers(request.auth?.roleCodes, response)) return;

  const payload = userSchema.parse(request.body);
  const targetInstitutionId = getScopedInstitutionId(
    isSuperAdmin(request.auth?.roleCodes) ? null : request.auth?.institutionId,
    payload.institutionId,
  );

  if (!isSuperAdmin(request.auth?.roleCodes) && payload.institutionId && payload.institutionId !== request.auth?.institutionId) {
    return response.status(403).json({ success: false, message: 'No puedes crear usuarios fuera de tu institución.' });
  }

  if ((payload.teacherId || payload.studentId || payload.representativeStudentIds.length > 0) && !targetInstitutionId) {
    return response.status(400).json({ success: false, message: 'Selecciona una institución para vincular perfiles académicos.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    if (payload.teacherId && targetInstitutionId) {
      const teacherExists = await assertProfileBelongsToInstitution(client, 'edu_teachers', payload.teacherId, targetInstitutionId);

      if (!teacherExists) {
        await client.query('ROLLBACK');
        return response.status(400).json({ success: false, message: 'El docente seleccionado no existe en la institución indicada.' });
      }
    }

    if (payload.studentId && targetInstitutionId) {
      const studentExists = await assertProfileBelongsToInstitution(client, 'edu_students', payload.studentId, targetInstitutionId);

      if (!studentExists) {
        await client.query('ROLLBACK');
        return response.status(400).json({ success: false, message: 'El estudiante seleccionado no existe en la institución indicada.' });
      }
    }

    if (payload.representativeStudentIds.length > 0 && targetInstitutionId) {
      const studentsResult = await client.query(
        `SELECT id FROM edu_students WHERE institution_id = $1 AND id = ANY($2::uuid[])`,
        [targetInstitutionId, payload.representativeStudentIds],
      );

      if (studentsResult.rows.length !== payload.representativeStudentIds.length) {
        await client.query('ROLLBACK');
        return response.status(400).json({ success: false, message: 'Uno o más estudiantes asociados no existen en la institución indicada.' });
      }
    }

    const insertedUser = await client.query(
      `
        INSERT INTO edu_users (
          institution_id,
          full_name,
          email,
          password_hash,
          status
        ) VALUES ($1, $2, $3, crypt($4, gen_salt('bf')), $5)
        RETURNING id, institution_id AS "institutionId", full_name AS "fullName", email, status, created_at AS "createdAt"
      `,
      [targetInstitutionId, payload.fullName, payload.email.trim().toLowerCase(), payload.password, payload.status],
    );

    const createdUser = insertedUser.rows[0] as {
      id: string;
      institutionId: string | null;
      fullName: string;
      email: string;
      status: string;
      createdAt: string;
    };

    const roleRows = await client.query(
      `SELECT id, code FROM edu_roles WHERE code = ANY($1::text[])`,
      [payload.roleCodes],
    );

    if (roleRows.rows.length !== payload.roleCodes.length) {
      await client.query('ROLLBACK');
      return response.status(400).json({ success: false, message: 'Uno o más roles no existen.' });
    }

    for (const role of roleRows.rows) {
      await client.query(
        `INSERT INTO edu_user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [createdUser.id, role.id],
      );
    }

    if (targetInstitutionId && (payload.teacherId || payload.studentId)) {
      await client.query(
        `
          INSERT INTO edu_user_profiles (user_id, institution_id, teacher_id, student_id)
          VALUES ($1, $2, $3, $4)
        `,
        [createdUser.id, targetInstitutionId, payload.teacherId ?? null, payload.studentId ?? null],
      );
    }

    if (targetInstitutionId && payload.representativeStudentIds.length > 0) {
      for (const studentId of payload.representativeStudentIds) {
        await client.query(
          `
            INSERT INTO edu_student_guardians (institution_id, student_id, representative_user_id, relationship_label, is_primary)
            VALUES ($1, $2, $3, 'Representante', FALSE)
            ON CONFLICT (student_id, representative_user_id) DO NOTHING
          `,
          [targetInstitutionId, studentId, createdUser.id],
        );
      }
    }

    await client.query('COMMIT');

    return response.status(201).json(successResponse('Usuario creado.', {
      ...createdUser,
      roleCodes: roleRows.rows.map((row) => row.code),
      teacherId: payload.teacherId ?? null,
      studentId: payload.studentId ?? null,
      guardianships: payload.representativeStudentIds.map((studentId) => ({
        studentId,
        relationshipLabel: 'Representante',
        isPrimary: false,
      })),
    }));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

router.get('/profile-options', requireAuth, async (request, response) => {
  if (!ensureCanManageUsers(request.auth?.roleCodes, response)) return;

  const scopedInstitutionId = isSuperAdmin(request.auth?.roleCodes) ? null : request.auth?.institutionId;
  const teacherWhereClause = scopedInstitutionId ? 'WHERE t.institution_id = $1' : '';
  const studentWhereClause = scopedInstitutionId ? 'WHERE st.institution_id = $1' : '';
  const values = scopedInstitutionId ? [scopedInstitutionId] : [];

  const [teachersResult, studentsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          t.id,
          t.full_name AS "fullName",
          t.email,
          t.status,
          i.name AS "institutionName"
        FROM edu_teachers t
        INNER JOIN edu_institutions i ON i.id = t.institution_id
        ${teacherWhereClause}
        ORDER BY t.full_name ASC
      `,
      values,
    ),
    pool.query(
      `
        SELECT
          st.id,
          st.full_name AS "fullName",
          st.enrollment_code AS "enrollmentCode",
          st.status,
          i.name AS "institutionName"
        FROM edu_students st
        INNER JOIN edu_institutions i ON i.id = st.institution_id
        ${studentWhereClause}
        ORDER BY st.full_name ASC
      `,
      values,
    ),
  ]);

  return response.json(successResponse('Opciones de vinculación cargadas.', {
    teachers: teachersResult.rows,
    students: studentsResult.rows,
  }));
});

router.get('/roles', requireAuth, async (request, response) => {
  if (!ensureCanManageUsers(request.auth?.roleCodes, response)) return;

  const result = await pool.query(
    `
      SELECT
        id,
        code,
        name,
        is_system AS "isSystem",
        created_at AS "createdAt"
      FROM edu_roles
      ORDER BY is_system DESC, name ASC
    `,
  );

  return response.json(successResponse('Roles cargados.', result.rows));
});

export default router;
