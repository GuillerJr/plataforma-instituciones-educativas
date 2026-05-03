import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';

const router = Router();

router.get('/health', (_request, response) => {
  return response.json(successResponse('Educa API healthy', {
    service: 'educa-api',
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));
});

router.get('/bootstrap', (_request, response) => {
  return response.json(successResponse('Bootstrap snapshot loaded', {
    project: 'plataforma-instituciones-educativas',
    phase: 'foundation',
    publicUrl: 'https://educa.hacktrickstore.com',
    modules: ['auth-base', 'instituciones', 'usuarios', 'roles', 'academico-base'],
  }));
});

router.get('/auth/bootstrap', (_request, response) => {
  return response.json(successResponse('Auth bootstrap loaded', {
    mode: 'credentials',
    sessionStrategy: 'jwt + refresh (planned)',
    currentStatus: 'base preparada, flujo real pendiente',
  }));
});

router.get('/dashboard', requireAuth, async (_request, response) => {
  const [institutionsCount, usersCount, activeUsersCount, rolesCount, levelsCount, gradesCount, sectionsCount, institutions, users] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_institutions`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_users`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_users WHERE status = 'active'`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_roles`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_academic_levels`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_academic_grades`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_academic_sections`),
    pool.query(`SELECT id, name, slug, active_school_year_label AS "activeSchoolYearLabel" FROM edu_institutions ORDER BY created_at DESC LIMIT 5`),
    pool.query(`
      SELECT
        u.id,
        u.full_name AS "fullName",
        u.email,
        u.status,
        i.name AS "institutionName"
      FROM edu_users u
      LEFT JOIN edu_institutions i ON i.id = u.institution_id
      ORDER BY u.created_at DESC
      LIMIT 5
    `),
  ]);

  return response.json(successResponse('Dashboard administrativo cargado.', {
    metrics: {
      institutions: institutionsCount.rows[0]?.total ?? 0,
      users: usersCount.rows[0]?.total ?? 0,
      activeUsers: activeUsersCount.rows[0]?.total ?? 0,
      roles: rolesCount.rows[0]?.total ?? 0,
      academicLevels: levelsCount.rows[0]?.total ?? 0,
      academicGrades: gradesCount.rows[0]?.total ?? 0,
      academicSections: sectionsCount.rows[0]?.total ?? 0,
    },
    institutions: institutions.rows,
    recentUsers: users.rows,
  }));
});

export default router;
