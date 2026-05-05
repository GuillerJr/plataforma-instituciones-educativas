import { getCurrentUser, canManageUsers } from '../../lib/current-user';
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
      <section className="panel-card overflow-hidden p-5 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-blue">Usuarios y roles</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Gobernanza de acceso con foco en perfiles, estados y permisos
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              La vista de usuarios se simplifica para el trabajo diario del colegio: listados compactos, roles visibles y acciones concentradas en modales sin tocar el backend actual.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Usuarios activos</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{activeUsers}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Accesos operativos habilitados.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Bloqueados</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{blockedUsers}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Cuentas suspendidas para seguimiento.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Lectura de acceso</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Se priorizan estados, roles y acciones de fila para reducir saltos visuales y mejorar la operación en pantallas pequeñas.
              </p>
            </div>
          </aside>
        </div>
      </section>

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
