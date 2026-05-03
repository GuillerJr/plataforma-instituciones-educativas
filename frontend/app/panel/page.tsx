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
  const trackedUsers = dashboard?.recentUsers.length ?? 0;
  const institutionCoverage = dashboard?.institutions.length ?? 0;

  return (
    <main className="space-y-6 pb-8">
      <section className="glass-panel px-6 py-7 sm:px-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">Panel administrativo</p>
              <span className="info-chip">Operación del día</span>
            </div>
            <h1 className="section-title">Lectura inmediata de operaci\u00f3n, accesos y actividad reciente</h1>
            <p className="section-copy max-w-3xl">
              El panel prioriza el seguimiento diario del colegio con indicadores compactos, listados claros y menos bloques decorativos para acelerar decisiones.
            </p>
          </div>

          <div className="summary-strip">
            <div className="summary-item">
              <p className="summary-label">Sedes o registros</p>
              <p className="summary-value">{institutionCoverage}</p>
              <p className="mt-1 text-sm text-slate-500">Estructura institucional visible.</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Actividad reciente</p>
              <p className="summary-value">{trackedUsers}</p>
              <p className="mt-1 text-sm text-slate-500">Altas recientes monitoreadas.</p>
            </div>
          </div>
        </div>
      </section>

      {error || !dashboard ? (
        <div className="surface-panel px-5 py-4 text-sm text-rose-700">{error ?? 'No hay datos del panel.'}</div>
      ) : (
        <>
          <section className="summary-strip">
            <MetricCard label="Registros institucionales" value={dashboard.metrics.institutions} helper="Sedes o registros cargados" />
            <MetricCard label="Usuarios" value={dashboard.metrics.users} helper="Cuentas registradas" />
            <MetricCard label="Usuarios activos" value={dashboard.metrics.activeUsers} helper="Accesos habilitados" />
            <MetricCard label="Roles" value={dashboard.metrics.roles} helper="Perfiles disponibles" />
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="section-grid-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Cursos y rendimiento</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">Panorama pedagógico resumido</h2>
                </div>
                <span className="info-chip">Actualizado hoy</span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="surface-muted p-4">
                  <p className="text-sm text-slate-500">Cursos monitoreados</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">36</p>
                  <p className="mt-2 text-sm text-slate-600">Distribuidos entre niveles y secciones.</p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm text-slate-500">Promedio de evaluaciones</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">8.9/10</p>
                  <p className="mt-2 text-sm text-slate-600">Resultado consolidado del periodo vigente.</p>
                </div>
                <div className="surface-muted p-4 md:col-span-2">
                  <p className="text-sm text-slate-500">Actividades priorizadas</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">Apertura de periodo, revisi\u00f3n de accesos y validaci\u00f3n acad\u00e9mica</p>
                </div>
              </div>
            </div>

            <div className="table-shell">
              <div className="table-toolbar soft-divider">
                <div>
                  <p className="eyebrow">Sedes o registros</p>
                  <h2 className="table-title">Estructura institucional reciente</h2>
                  <p className="table-subtitle">Registros visibles para la operaci\u00f3n actual del colegio.</p>
                </div>
                <span className="info-chip">{dashboard.institutions.length} visibles</span>
              </div>
              <div className="table-scroller">
                <table className="data-table min-w-[520px]">
                  <thead>
                    <tr>
                      <th>Registro</th>
                      <th>Ciclo activo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.institutions.map((institution) => (
                      <tr key={institution.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{institution.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{institution.slug}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{institution.activeSchoolYearLabel ?? 'Año por definir'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="table-shell lg:col-span-2">
              <div className="table-toolbar soft-divider">
                <div>
                  <p className="eyebrow">Usuarios recientes</p>
                  <h2 className="table-title">Accesos creados recientemente</h2>
                  <p className="table-subtitle">Personas habilitadas para la operaci\u00f3n institucional.</p>
                </div>
                <span className="info-chip">{dashboard.recentUsers.length} visibles</span>
              </div>
              <div className="table-scroller">
                <table className="data-table min-w-[760px]">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Sede o registro</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{user.fullName}</p>
                          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{user.institutionName ?? 'Sin sede asignada'}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateUserStatus(user.status)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
    <div className="summary-item">
      <p className="summary-label">{label}</p>
      <p className="summary-value">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{helper}</p>
    </div>
  );
}
