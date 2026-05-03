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
      error: 'No fue posible cargar usuarios, roles o instituciones.',
    };
  }
}

export default async function UsersPage() {
  const { users, roles, institutions, error } = await loginAndLoadUsers();
  const activeUsers = users.filter((user) => user.status === 'active').length;
  const blockedUsers = users.filter((user) => user.status === 'blocked').length;

  return (
    <main className="space-y-6 pb-8">
      <section className="glass-panel px-6 py-7 sm:px-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div>
            <p className="eyebrow">Usuarios y roles</p>
            <h1 className="section-title mt-3">Gobernanza de acceso con foco en perfiles, estados y permisos</h1>
            <p className="section-copy mt-4 max-w-3xl">
              La vista de usuarios se simplifica para el trabajo diario del colegio: listados compactos, roles visibles y acciones concentradas en modales sin tocar el backend actual.
            </p>
          </div>
          <div className="summary-strip">
            <div className="summary-item">
              <p className="summary-label">Usuarios activos</p>
              <p className="summary-value">{activeUsers}</p>
              <p className="mt-1 text-sm text-slate-500">Accesos operativos habilitados.</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Bloqueados</p>
              <p className="summary-value">{blockedUsers}</p>
              <p className="mt-1 text-sm text-slate-500">Cuentas suspendidas para seguimiento.</p>
            </div>
          </div>
        </div>
      </section>

      <UsersWorkspace users={users} roles={roles} institutions={institutions} error={error} />
    </main>
  );
}
