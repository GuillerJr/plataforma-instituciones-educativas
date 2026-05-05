export type AppRole = 'superadmin' | 'admin_institucional' | 'docente' | 'estudiante' | 'representante';

export function hasAnyRole(roleCodes: string[] | undefined, allowed: AppRole[]) {
  return (roleCodes ?? []).some((role) => allowed.includes(role as AppRole));
}

export function canManageUsers(roleCodes: string[] | undefined) {
  return hasAnyRole(roleCodes, ['superadmin', 'admin_institucional']);
}

export function canManageInstitution(roleCodes: string[] | undefined) {
  return hasAnyRole(roleCodes, ['superadmin', 'admin_institucional']);
}

export function canManageAcademic(roleCodes: string[] | undefined) {
  return hasAnyRole(roleCodes, ['superadmin', 'admin_institucional']);
}

export function canManageTeaching(roleCodes: string[] | undefined) {
  return hasAnyRole(roleCodes, ['superadmin', 'admin_institucional']);
}

export function canWorkOnAttendance(roleCodes: string[] | undefined) {
  return hasAnyRole(roleCodes, ['superadmin', 'admin_institucional', 'docente']);
}

export function canWorkOnEvaluations(roleCodes: string[] | undefined) {
  return hasAnyRole(roleCodes, ['superadmin', 'admin_institucional', 'docente']);
}

export function canReadAcademic(roleCodes: string[] | undefined) {
  return hasAnyRole(roleCodes, ['superadmin', 'admin_institucional', 'docente', 'estudiante', 'representante']);
}
