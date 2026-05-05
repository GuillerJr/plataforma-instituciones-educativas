import { DemoApiError, fetchDemoApi } from '../app/lib/demo-api';

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  status: 'pending' | 'active' | 'blocked';
  roleCodes: string[];
  institutionId: string | null;
  teacherId?: string | null;
  studentId?: string | null;
};

export async function getCurrentUser() {
  try {
    const user = await fetchDemoApi<CurrentUser>('/auth/me');
    return { user, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { user: null as CurrentUser | null, error: error.message };
    }

    return { user: null as CurrentUser | null, error: 'No fue posible cargar la sesión del usuario.' };
  }
}

export function hasSomeRole(user: CurrentUser | null, allowedRoles: string[]) {
  if (!user) return false;
  return user.roleCodes.some((role) => allowedRoles.includes(role));
}

export function getPrimaryRoleLabel(user: CurrentUser | null) {
  if (!user || user.roleCodes.length === 0) return 'Usuario institucional';

  if (user.roleCodes.includes('superadmin')) return 'Superadministración';
  if (user.roleCodes.includes('admin_institucional')) return 'Administración institucional';
  if (user.roleCodes.includes('docente')) return 'Docencia';
  if (user.roleCodes.includes('estudiante')) return 'Estudiante';
  if (user.roleCodes.includes('representante')) return 'Representante';

  return user.roleCodes[0];
}

export function canManageUsers(user: CurrentUser | null) {
  return hasSomeRole(user, ['superadmin', 'admin_institucional']);
}

export function canManageInstitution(user: CurrentUser | null) {
  return hasSomeRole(user, ['superadmin', 'admin_institucional']);
}

export function canManageAcademic(user: CurrentUser | null) {
  return hasSomeRole(user, ['superadmin', 'admin_institucional']);
}

export function canManageTeaching(user: CurrentUser | null) {
  return hasSomeRole(user, ['superadmin', 'admin_institucional']);
}

export function canWorkOnEvaluations(user: CurrentUser | null) {
  return hasSomeRole(user, ['superadmin', 'admin_institucional', 'docente']);
}

export function canWorkOnAttendance(user: CurrentUser | null) {
  return hasSomeRole(user, ['superadmin', 'admin_institucional', 'docente']);
}
