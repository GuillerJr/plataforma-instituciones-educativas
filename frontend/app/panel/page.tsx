import Link from 'next/link';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';

export const dynamic = 'force-dynamic';

type DashboardPayload = {
  metrics: {
    institutions: number;
    users: number;
    activeUsers: number;
    roles: number;
  };
  institutions: Array<{
    id: string;
    name: string;
    slug: string;
    activeSchoolYearLabel?: string | null;
  }>;
  recentUsers: Array<{
    id: string;
    fullName: string;
    email: string;
    status: string;
    institutionName?: string | null;
  }>;
};

async function loadDashboard() {
  try {
    const dashboard = await fetchDemoApi<DashboardPayload>('/system/dashboard');
    return { dashboard, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { dashboard: null as DashboardPayload | null, error: error.message };
    }

    return { dashboard: null as DashboardPayload | null, error: 'No fue posible cargar el dashboard.' };
  }
}

export default async function PanelPage() {
  const { dashboard, error } = await loadDashboard();

  return (
    <main className="space-y-8 pb-10">
      <section className="glass-panel px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Panel administrativo</p>
            <h1 className="section-title mt-3">Vista central de operación institucional</h1>
            <p className="section-copy mt-4 max-w-3xl">
              Un panel ejecutivo más limpio para leer el estado actual de instituciones, usuarios y gobierno operativo sin perder foco.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/instituciones" className="secondary-button">Instituciones</Link>
            <Link href="/usuarios" className="secondary-button">Usuarios y roles</Link>
          </div>
        </div>
      </section>

      {error || !dashboard ? (
        <div className="surface-panel px-5 py-4 text-sm text-rose-200">{error ?? 'No hay datos del dashboard.'}</div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Instituciones" value={dashboard.metrics.institutions} helper="Unidades activas en la plataforma" />
            <MetricCard label="Usuarios" value={dashboard.metrics.users} helper="Cuentas registradas" />
            <MetricCard label="Usuarios activos" value={dashboard.metrics.activeUsers} helper="Accesos operativos habilitados" />
            <MetricCard label="Roles" value={dashboard.metrics.roles} helper="Perfiles de gobierno disponibles" />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="surface-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="eyebrow">Instituciones recientes</p>
                  <p className="mt-2 text-sm text-slate-400">Lectura rápida de las unidades institucionales activas.</p>
                </div>
                <span className="info-chip">{dashboard.institutions.length} visibles</span>
              </div>
              <div className="space-y-3 p-4">
                {dashboard.institutions.map((institution) => (
                  <article key={institution.id} className="surface-muted p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{institution.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{institution.slug}</p>
                      </div>
                      <span className="info-chip">{institution.activeSchoolYearLabel ?? 'Año por definir'}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="surface-panel overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                <div>
                  <p className="eyebrow">Usuarios recientes</p>
                  <p className="mt-2 text-sm text-slate-400">Personas con acceso creadas recientemente.</p>
                </div>
                <span className="info-chip">{dashboard.recentUsers.length} visibles</span>
              </div>
              <div className="space-y-3 p-4">
                {dashboard.recentUsers.map((user) => (
                  <article key={user.id} className="surface-muted p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{user.fullName}</h3>
                        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                        <p className="mt-3 text-sm text-slate-300">{user.institutionName ?? 'Acceso global sin institucion'}</p>
                      </div>
                      <span className="info-chip">{translateUserStatus(user.status)}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function translateUserStatus(status: string) {
  if (status === 'active') return 'Activo';
  if (status === 'pending') return 'Pendiente';
  if (status === 'blocked') return 'Bloqueado';
  return status;
}

function MetricCard({ label, value, helper }: { label: string; value: number; helper: string }) {
  return (
    <div className="metric-card">
      <p className="eyebrow">{label}</p>
      <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm text-slate-400">{helper}</p>
    </div>
  );
}
