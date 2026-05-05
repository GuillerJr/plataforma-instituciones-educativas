import type { AuthPayload } from '../middleware/require-auth.js';
import { resolveProfileScope } from './profile-scope.js';

export type AcademicIdentityScope = {
  institutionId: string;
  teacherId: string | null;
  studentId: string | null;
  representativeStudentIds: string[];
  isTeacher: boolean;
  isStudent: boolean;
  isRepresentative: boolean;
  isGlobalScope: boolean;
};

export async function resolveAcademicIdentityScope(auth: AuthPayload | undefined, institutionId: string) {
  const profile = await resolveProfileScope({
    institutionId,
    roleCodes: auth?.roleCodes ?? [],
    teacherId: auth?.teacherId,
    studentId: auth?.studentId,
    userId: auth?.sub,
  });

  return {
    institutionId,
    teacherId: profile.teacherId,
    studentId: profile.studentId,
    representativeStudentIds: profile.representativeStudentIds,
    isTeacher: profile.isTeacher,
    isStudent: profile.isStudent,
    isRepresentative: profile.isRepresentative,
    isGlobalScope: profile.isSuperAdmin || profile.isInstitutionAdmin,
  } satisfies AcademicIdentityScope;
}

export function appendTeacherAssignmentScope(
  scope: AcademicIdentityScope,
  conditions: string[],
  values: Array<string | string[]>,
  teacherColumn: string,
) {
  if (scope.isTeacher && scope.teacherId && !scope.isGlobalScope) {
    values.push(scope.teacherId);
    conditions.push(`${teacherColumn} = $${values.length}`);
  }
}

export function appendStudentScope(
  scope: AcademicIdentityScope,
  conditions: string[],
  values: Array<string | string[]>,
  studentColumn: string,
) {
  if (scope.isStudent && scope.studentId && !scope.isGlobalScope) {
    values.push(scope.studentId);
    conditions.push(`${studentColumn} = $${values.length}`);
  }
}

export function appendRepresentativeScope(
  scope: AcademicIdentityScope,
  conditions: string[],
  values: Array<string | string[]>,
  studentColumn: string,
) {
  if (scope.isRepresentative && !scope.isGlobalScope) {
    if (scope.representativeStudentIds.length === 0) {
      conditions.push('1 = 0');
      return;
    }

    values.push(scope.representativeStudentIds);
    conditions.push(`${studentColumn} = ANY($${values.length}::uuid[])`);
  }
}
