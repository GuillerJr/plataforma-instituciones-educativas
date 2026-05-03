import Link from 'next/link';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';

export const dynamic = 'force-dynamic';

type DashboardPayload = {
  metrics: {
    institutions: number;
    users: number;
    activeUsers: number;
    roles: number;
    academicLevels: number;
    academicGrades: number;
    academicSections: number;
  };
  institutions: Array<{
    id: string;
    name: string;
    slug: string;
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
    <main className="page-main">
      <section className="hero-panel">
        <div className="hero-grid">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">Panel administrativo</p>
              <span className="info-chip">Operación del día</span>
            </div>
            <h1 className="section-title">Lectura inmediata de operación, accesos y actividad reciente</h1>
            <p className="section-copy max-w-3xl">
              El panel prioriza el seguimiento diario del colegio con indicadores compactos, listados claros y menos bloques decorativos para acelerar decisiones.
            </p>
          </div>

          <aside className="side-note-card">
            <div className="summary-strip xl:grid-cols-2">
              <div className="summary-item">
                <p className="summary-label">Sedes visibles</p>
                <p className="summary-value">{institutionCoverage}</p>
                <p className="mt-1 text-sm text-slate-500">Estructura cargada para la operación.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Actividad reciente</p>
                <p className="summary-value">{trackedUsers}</p>
                <p className="mt-1 text-sm text-slate-500">Altas recientes monitoreadas.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Lectura operativa</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">La vista se reorganiza para que métricas, tablas y acciones tengan la misma densidad visual en móvil, tablet y desktop.</p>
            </div>
          </aside>
        </div>
      </section>

      {error || !dashboard ? (
        <div className="surface-panel px-5 py-4 text-sm text-rose-700">{error ?? 'No hay datos del panel.'}</div>
      ) : (
        <>
          <section className="kpi-grid">
            <MetricCard label="Estructura institucional" value={dashboard.metrics.institutions} helper="Sede principal y sedes cargadas" />
            <MetricCard label="Usuarios" value={dashboard.metrics.users} helper="Cuentas registradas" />
            <MetricCard label="Usuarios activos" value={dashboard.metrics.activeUsers} helper="Accesos habilitados" />
            <MetricCard label="Roles" value={dashboard.metrics.roles} helper="Perfiles disponibles" />
            <MetricCard label="Niveles" value={dashboard.metrics.academicLevels} helper="Etapas académicas reales" />
            <MetricCard label="Cursos o grados" value={dashboard.metrics.academicGrades} helper="Oferta base cargada" />
            <MetricCard label="Secciones" value={dashboard.metrics.academicSections} helper="Paralelos visibles" />
          </section>

          <section className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="section-grid-card">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Cursos y rendimiento</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">Base académica real del periodo</h2>
                </div>
                <span className="info-chip">Datos vivos</span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="surface-muted p-4">
                  <p className="text-sm text-slate-500">Niveles cargados</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{dashboard.metrics.academicLevels}</p>
                  <p className="mt-2 text-sm text-slate-600">Estructura troncal visible en la institución.</p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm text-slate-500">Cursos o grados activos</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{dashboard.metrics.academicGrades}</p>
                  <p className="mt-2 text-sm text-slate-600">Base mínima real para la oferta académica.</p>
                </div>
                <div className="surface-muted p-4 md:col-span-2">
                  <p className="text-sm text-slate-500">Secciones operativas</p>
                  <p className="mt-2 text-base font-semibold text-slate-950">{dashboard.metrics.academicSections} paralelos listos para organización, matrícula y seguimiento posterior</p>
                  <Link href="/academico" className="compact-button mt-4 w-full sm:w-fit">Gestionar estructura académica</Link>
                </div>
              </div>
            </div>

            <div className="table-shell">
              <div className="table-toolbar soft-divider">
                <div>
                  <p className="eyebrow">Estructura institucional</p>
                  <h2 className="table-title">Sedes visibles recientemente</h2>
                  <p className="table-subtitle">Acceso rápido a la estructura disponible del colegio.</p>
                </div>
                <span className="info-chip">{dashboard.institutions.length} visibles</span>
              </div>
              <div className="table-scroller">
                <table className="data-table min-w-[520px]">
                  <thead>
                    <tr>
                      <th>Registro</th>
                      <th>Acción</th>
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
                          <div className="table-actions">
                            <Link href="/instituciones" className="compact-button">Gestionar</Link>
                          </div>
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
                  <p className="table-subtitle">Personas habilitadas para la operación institucional.</p>
                </div>
                <span className="info-chip">{dashboard.recentUsers.length} visibles</span>
              </div>
              <div className="table-scroller">
                <table className="data-table min-w-[900px]">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Sede</th>
                      <th>Estado</th>
                      <th>Acción</th>
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
                          <p className="text-sm text-slate-600">{user.institutionName ?? 'Sin sede asociada'}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateUserStatus(user.status)}</span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <Link href="/usuarios" className="compact-button">Gestionar</Link>
                          </div>
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
