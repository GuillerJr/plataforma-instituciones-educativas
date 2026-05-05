import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canAccessGlobalInstitutionScope, resolveProfileScope } from '../utils/profile-scope.js';

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
    phase: 'academic-7-asistencia',
    publicUrl: 'https://educa.hacktrickstore.com',
    modules: ['auth-base', 'instituciones', 'usuarios', 'roles', 'academico-base', 'docentes', 'estudiantes', 'matriculas', 'materias', 'asignaciones-academicas', 'evaluaciones', 'calificaciones', 'asistencia'],
  }));
});

router.get('/auth/bootstrap', (_request, response) => {
  return response.json(successResponse('Auth bootstrap loaded', {
    mode: 'credentials',
    sessionStrategy: 'jwt + refresh (planned)',
    currentStatus: 'base preparada, flujo real pendiente',
  }));
});

router.get('/dashboard', requireAuth, async (request, response) => {
  const institutionId = request.auth?.institutionId ?? null;
  const userRoles = request.auth?.roleCodes ?? [];
  const profileScope = await resolveProfileScope({
    institutionId,
    roleCodes: userRoles,
    teacherId: request.auth?.teacherId,
    studentId: request.auth?.studentId,
    userId: request.auth?.sub,
  });
  const isGlobalScope = canAccessGlobalInstitutionScope(profileScope);
  const isSuperAdmin = profileScope.isSuperAdmin;

  const scopeClause = isGlobalScope || !institutionId ? '' : ' WHERE institution_id = $1';
  const scopeParams = isGlobalScope || !institutionId ? [] : [institutionId];

  const [institutionsCount, usersCount, activeUsersCount, rolesCount, levelsCount, gradesCount, sectionsCount, teachersCount, studentsCount, enrollmentsCount, activeEnrollmentsCount, subjectsCount, academicAssignmentsCount, evaluationsCount, evaluationGradesCount, attendanceRecordsCount, institutions, users, attendanceByStatus, studentsByStatus, teacherByStatus, evaluationAverage, teacherAssignments, teacherEvaluations, studentPerformance, representativeStudents, studentAttendanceSummary] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_institutions`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_users${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_users${scopeClause ? `${scopeClause} AND status = 'active'` : ` WHERE status = 'active'`}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_roles`),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_academic_levels${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_academic_grades${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_academic_sections${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_teachers${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_students${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_enrollments${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_enrollments${scopeClause ? `${scopeClause} AND status = 'active'` : ` WHERE status = 'active'`}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_subjects${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_academic_assignments${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_evaluations${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_evaluation_grades${scopeClause}`, scopeParams),
    pool.query(`SELECT COUNT(*)::int AS total FROM edu_attendance_records${scopeClause}`, scopeParams),
    pool.query(
      `SELECT id, name, slug, active_school_year_label AS "activeSchoolYearLabel"
       FROM edu_institutions
       ${isSuperAdmin || !institutionId ? '' : 'WHERE id = $1'}
       ORDER BY created_at DESC
       LIMIT 5`,
      isSuperAdmin || !institutionId ? [] : [institutionId],
    ),
    pool.query(
      `SELECT
        u.id,
        u.full_name AS "fullName",
        u.email,
        u.status,
        i.name AS "institutionName",
        COALESCE(array_agg(r.code) FILTER (WHERE r.code IS NOT NULL), '{}') AS "roleCodes"
      FROM edu_users u
      LEFT JOIN edu_institutions i ON i.id = u.institution_id
      LEFT JOIN edu_user_roles ur ON ur.user_id = u.id
      LEFT JOIN edu_roles r ON r.id = ur.role_id
      ${scopeClause.replace(/institution_id/g, 'u.institution_id')}
      GROUP BY u.id, i.name
      ORDER BY u.created_at DESC
      LIMIT 6`,
      scopeParams,
    ),
    pool.query(
      `SELECT attendance_status AS status, COUNT(*)::int AS total
       FROM edu_attendance_records
       ${scopeClause}
       GROUP BY attendance_status`,
      scopeParams,
    ),
    pool.query(
      `SELECT status, COUNT(*)::int AS total
       FROM edu_students
       ${scopeClause}
       GROUP BY status`,
      scopeParams,
    ),
    pool.query(
      `SELECT status, COUNT(*)::int AS total
       FROM edu_teachers
       ${scopeClause}
       GROUP BY status`,
      scopeParams,
    ),
    pool.query(
      `SELECT COALESCE(ROUND(AVG(score)::numeric, 2), 0)::float AS average
       FROM edu_evaluation_grades
       ${scopeClause}`,
      scopeParams,
    ),
    profileScope.isTeacher && profileScope.teacherId && institutionId
      ? pool.query(
          `
            SELECT
              aa.id,
              sub.name AS "subjectName",
              sub.code AS "subjectCode",
              g.name AS "gradeName",
              s.name AS "sectionName",
              COUNT(DISTINCT e.id)::int AS "evaluationsCount"
            FROM edu_academic_assignments aa
            INNER JOIN edu_subjects sub ON sub.id = aa.subject_id
            INNER JOIN edu_academic_grades g ON g.id = aa.grade_id
            LEFT JOIN edu_academic_sections s ON s.id = aa.section_id
            LEFT JOIN edu_evaluations e ON e.academic_assignment_id = aa.id
            WHERE aa.institution_id = $1
              AND aa.teacher_id = $2
            GROUP BY aa.id, sub.name, sub.code, g.name, s.name
            ORDER BY sub.name ASC, g.name ASC, s.name ASC NULLS FIRST
          `,
          [institutionId, profileScope.teacherId],
        )
      : Promise.resolve({ rows: [] }),
    profileScope.isTeacher && profileScope.teacherId && institutionId
      ? pool.query(
          `
            SELECT COUNT(*)::int AS total
            FROM edu_evaluations e
            INNER JOIN edu_academic_assignments aa ON aa.id = e.academic_assignment_id
            WHERE e.institution_id = $1
              AND aa.teacher_id = $2
          `,
          [institutionId, profileScope.teacherId],
        )
      : Promise.resolve({ rows: [] }),
    profileScope.isStudent && profileScope.studentId && institutionId
      ? pool.query(
          `
            SELECT
              COUNT(eg.id)::int AS "gradesCount",
              COALESCE(ROUND(AVG(eg.score)::numeric, 2), 0)::float AS "averageScore",
              COUNT(DISTINCT ar.id)::int AS "attendanceCount",
              COUNT(DISTINCT CASE WHEN ar.attendance_status = 'absent' THEN ar.id END)::int AS "absences"
            FROM edu_students st
            LEFT JOIN edu_evaluation_grades eg ON eg.student_id = st.id AND eg.institution_id = st.institution_id
            LEFT JOIN edu_attendance_records ar ON ar.student_id = st.id AND ar.institution_id = st.institution_id
            WHERE st.institution_id = $1
              AND st.id = $2
            GROUP BY st.id
          `,
          [institutionId, profileScope.studentId],
        )
      : Promise.resolve({ rows: [] }),
    profileScope.isRepresentative && institutionId && profileScope.representativeStudentIds.length > 0
      ? pool.query(
          `
            SELECT
              st.id,
              st.full_name AS "fullName",
              st.enrollment_code AS "enrollmentCode",
              st.status,
              g.name AS "gradeName",
              s.name AS "sectionName"
            FROM edu_students st
            LEFT JOIN edu_academic_grades g ON g.id = st.grade_id
            LEFT JOIN edu_academic_sections s ON s.id = st.section_id
            WHERE st.institution_id = $1
              AND st.id = ANY($2::uuid[])
            ORDER BY st.full_name ASC
          `,
          [institutionId, profileScope.representativeStudentIds],
        )
      : Promise.resolve({ rows: [] }),
    profileScope.isStudent && profileScope.studentId && institutionId
      ? pool.query(
          `
            SELECT
              COUNT(*) FILTER (WHERE attendance_status = 'present')::int AS present,
              COUNT(*) FILTER (WHERE attendance_status = 'absent')::int AS absent,
              COUNT(*) FILTER (WHERE attendance_status = 'late')::int AS late,
              COUNT(*) FILTER (WHERE attendance_status = 'justified')::int AS justified
            FROM edu_attendance_records
            WHERE institution_id = $1
              AND student_id = $2
          `,
          [institutionId, profileScope.studentId],
        )
      : Promise.resolve({ rows: [] }),
  ]);

  return response.json(successResponse('Dashboard administrativo cargado.', {
    scope: {
      institutionId,
      userRoles,
      isSuperAdmin,
      teacherId: profileScope.teacherId,
      studentId: profileScope.studentId,
      representativeStudentIds: profileScope.representativeStudentIds,
      isInstitutionAdmin: profileScope.isInstitutionAdmin,
      isTeacher: profileScope.isTeacher,
      isStudent: profileScope.isStudent,
      isRepresentative: profileScope.isRepresentative,
    },
    metrics: {
      institutions: institutionsCount.rows[0]?.total ?? 0,
      users: usersCount.rows[0]?.total ?? 0,
      activeUsers: activeUsersCount.rows[0]?.total ?? 0,
      roles: rolesCount.rows[0]?.total ?? 0,
      academicLevels: levelsCount.rows[0]?.total ?? 0,
      academicGrades: gradesCount.rows[0]?.total ?? 0,
      academicSections: sectionsCount.rows[0]?.total ?? 0,
      teachers: teachersCount.rows[0]?.total ?? 0,
      students: studentsCount.rows[0]?.total ?? 0,
      enrollments: enrollmentsCount.rows[0]?.total ?? 0,
      activeEnrollments: activeEnrollmentsCount.rows[0]?.total ?? 0,
      subjects: subjectsCount.rows[0]?.total ?? 0,
      academicAssignments: academicAssignmentsCount.rows[0]?.total ?? 0,
      evaluations: evaluationsCount.rows[0]?.total ?? 0,
      evaluationGrades: evaluationGradesCount.rows[0]?.total ?? 0,
      attendanceRecords: attendanceRecordsCount.rows[0]?.total ?? 0,
      averageGrade: evaluationAverage.rows[0]?.average ?? 0,
    },
    distributions: {
      attendanceByStatus: attendanceByStatus.rows,
      studentsByStatus: studentsByStatus.rows,
      teachersByStatus: teacherByStatus.rows,
    },
    institutions: institutions.rows,
    recentUsers: users.rows,
    profile: {
      teacherAssignments: teacherAssignments.rows,
      teacherEvaluations: teacherEvaluations.rows[0]?.total ?? 0,
      studentPerformance: studentPerformance.rows[0] ?? null,
      representativeStudents: representativeStudents.rows,
      studentAttendanceSummary: studentAttendanceSummary.rows[0] ?? null,
    },
  }));
});

export default router;
