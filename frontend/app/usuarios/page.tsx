import Link from 'next/link';
import { UserCreateForm } from './user-create-form';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';

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

  return (
    <main className="space-y-8 pb-10">
      <section className="glass-panel px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Usuarios y roles</p>
            <h1 className="section-title mt-3">Gobernanza de acceso clara para la operación institucional</h1>
            <p className="section-copy mt-4 max-w-3xl">
              Registra usuarios, asigna permisos y revisa su relación con cada institución desde una vista más directa, sobria y fácil de entender.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/panel" className="secondary-button">Ver panel</Link>
            <Link href="/instituciones" className="secondary-button">Ver instituciones</Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <UserCreateForm institutions={institutions} roles={roles} />

          <aside className="surface-panel p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Catálogo de roles</p>
                <p className="mt-2 text-sm text-slate-500">Perfiles disponibles en la gobernanza inicial del sistema.</p>
              </div>
              <span className="info-chip">{roles.length} roles</span>
            </div>
            <div className="mt-5 space-y-3">
              {roles.map((role) => (
                <div key={role.id} className="surface-muted p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-950">{role.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{role.code}</p>
                    </div>
                    <span className="info-chip">{role.isSystem ? 'Sistema' : 'Editable'}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="surface-panel overflow-hidden">
          <div className="soft-divider flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Usuarios registrados</p>
              <p className="mt-2 text-sm text-slate-500">Lectura de accesos institucionales y globales.</p>
            </div>
            <span className="info-chip">{users.length} usuarios</span>
          </div>

          {error ? (
            <div className="px-6 py-6 text-sm text-rose-700">{error}</div>
          ) : users.length === 0 ? (
            <div className="px-6 py-6 text-sm text-slate-500">Todavía no hay usuarios registrados.</div>
          ) : (
            <div className="space-y-3 p-4">
              {users.map((user) => (
                <article key={user.id} className="table-row-card">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-950">{user.fullName}</h3>
                        <span className="info-chip">{translateUserStatus(user.status)}</span>
                      </div>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-sm text-slate-600">{user.institutionName ?? 'Acceso global sin institución'}</p>
                    </div>
                    <div className="space-y-2 lg:max-w-xs lg:text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Roles asignados</p>
                      <p className="text-sm text-slate-600">{user.roleCodes.join(', ')}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function translateUserStatus(status: EduUser['status']) {
  if (status === 'active') return 'Activo';
  if (status === 'pending') return 'Pendiente';
  return 'Bloqueado';
}
