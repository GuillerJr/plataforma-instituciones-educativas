import { getCurrentUser, canManageUsers } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { UsersWorkspace } from './users-workspace';

export const dynamic = 'force-dynamic';

type EduUser = {
  id: string;
  institutionId: string | null;
  institutionName?: string | null;
  fullName: string;
  email: string;
  status: 'pending' | 'active' | 'blocked';
  roleCodes: string[];
};

type EduRole = {
  id: string;
  code: string;
  name: string;
  isSystem: boolean;
};

type InstitutionOption = {
  id: string;
  name: string;
};

async function loginAndLoadUsers() {
  try {
    const [users, roles, institutions] = await Promise.all([
      fetchDemoApi<EduUser[]>('/users'),
      fetchDemoApi<EduRole[]>('/users/roles'),
      fetchDemoApi<InstitutionOption[]>('/institutions'),
    ]);

    return {
      users,
      roles,
      institutions,
      error: null,
    };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return {
        users: [] as EduUser[],
        roles: [] as EduRole[],
        institutions: [] as InstitutionOption[],
        error: error.message,
      };
    }

    return {
      users: [] as EduUser[],
      roles: [] as EduRole[],
      institutions: [] as InstitutionOption[],
      error: 'No fue posible cargar usuarios, roles o sedes.',
    };
  }
}

export default async function UsersPage() {
  const [{ users, roles, institutions, error }, { user }] = await Promise.all([loginAndLoadUsers(), getCurrentUser()]);
  const activeUsers = users.filter((user) => user.status === 'active').length;
  const blockedUsers = users.filter((user) => user.status === 'blocked').length;
  const canManage = canManageUsers(user);

  return (
    <main className="space-y-6">
      <PageHero
        badge="Usuarios y accesos"
        title="Gobierno de acceso con foco en perfiles, estados y permisos reales"
        description="La experiencia se reorganiza para revisar cuentas, roles e instituciones asociadas con menos fricción y sin tocar la lógica actual del backend."
        metrics={[
          { label: 'Usuarios activos', value: activeUsers, helper: 'Accesos operativos habilitados.' },
          { label: 'Bloqueados', value: blockedUsers, helper: 'Cuentas suspendidas para seguimiento.' },
        ]}
        noteTitle="Visibilidad operativa"
        noteDescription="Se priorizan estados, roles y acciones reales de fila para que la gestión de cuentas sea más rápida en escritorio y móvil."
      />

      {canManage ? (
        <UsersWorkspace users={users} roles={roles} institutions={institutions} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Este perfil no puede crear ni administrar usuarios. Si necesitas cambios de acceso, debe hacerlo administración institucional o superadministración."
        />
      )}
    </main>
  );
}
