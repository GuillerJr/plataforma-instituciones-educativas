import { pool } from '../db/pool.js';

export type AuthProfileScope = {
  institutionId: string | null;
  roleCodes: string[];
  teacherId?: string | null;
  studentId?: string | null;
  userId?: string | null;
};

export type ResolvedProfileScope = {
  isSuperAdmin: boolean;
  isInstitutionAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isRepresentative: boolean;
  teacherId: string | null;
  studentId: string | null;
  representativeStudentIds: string[];
};

export async function resolveProfileScope(auth: AuthProfileScope | undefined): Promise<ResolvedProfileScope> {
  const roleCodes = auth?.roleCodes ?? [];
  const isSuperAdmin = roleCodes.includes('superadmin');
  const isInstitutionAdmin = roleCodes.includes('admin_institucional');
  const isTeacher = roleCodes.includes('docente');
  const isStudent = roleCodes.includes('estudiante');
  const isRepresentative = roleCodes.includes('representante');

  let representativeStudentIds: string[] = [];

  if (isRepresentative && auth?.userId && auth.institutionId) {
    const result = await pool.query(
      `
        SELECT student_id AS "studentId"
        FROM edu_student_guardians
        WHERE representative_user_id = $1
          AND institution_id = $2
        ORDER BY created_at ASC
      `,
      [auth.userId, auth.institutionId],
    );

    representativeStudentIds = result.rows.map((row) => row.studentId as string);
  }

  return {
    isSuperAdmin,
    isInstitutionAdmin,
    isTeacher,
    isStudent,
    isRepresentative,
    teacherId: auth?.teacherId ?? null,
    studentId: auth?.studentId ?? null,
    representativeStudentIds,
  };
}

export function canAccessGlobalInstitutionScope(scope: ResolvedProfileScope) {
  return scope.isSuperAdmin || scope.isInstitutionAdmin;
}
