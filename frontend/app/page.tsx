import Link from 'next/link';

type AuthBootstrap = {
  mode: string;
  sessionStrategy: string;
  currentStatus: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

async function getAuthBootstrap(): Promise<AuthBootstrap | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/system/auth/bootstrap`, { cache: 'no-store' });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: AuthBootstrap };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

const quickModules = [
  {
    href: '/panel',
    title: 'Panel diario',
    description: 'Resumen de operaci\u00f3n, accesos y actividad reciente del colegio.',
  },
  {
    href: '/instituciones',
    title: 'Instituci\u00f3n y sedes',
    description: 'Datos institucionales, a\u00f1o lectivo y sedes registradas en el sistema.',
  },
  {
    href: '/usuarios',
    title: 'Usuarios y roles',
    description: 'Accesos, estados, permisos y responsables operativos.',
  },
];

const highlights = [
  {
    title: 'Autoridades',
    description: 'Indicadores claros para rectorado y coordinaci\u00f3n sin sobrecargar la pantalla.',
  },
  {
    title: 'Gestión diaria',
    description: 'Procesos de alta, consulta y seguimiento en vistas m\u00e1s compactas.',
  },
  {
    title: 'Equipo institucional',
    description: 'Una base visual consistente para administraci\u00f3n, soporte y seguimiento acad\u00e9mico.',
  },
];

export default async function HomePage() {
  const authBootstrap = await getAuthBootstrap();

  return (
    <main className="space-y-6 pb-8">
      <section className="glass-panel px-6 py-7 sm:px-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">Software institucional</span>
              <span className="info-chip">UX compacta</span>
            </div>
            <div className="space-y-3">
              <h1 className="section-title max-w-4xl">
                Un sistema m\u00e1s claro para operar una sola instituci\u00f3n educativa.
              </h1>
              <p className="section-copy max-w-3xl">
                El nuevo frente visual concentra la lectura diaria del colegio en vistas compactas, tablas responsivas y acciones directas para rectorado, coordinaci\u00f3n y administraci\u00f3n.
              </p>
            </div>

            <div className="summary-strip">
              <div className="dark-metric-card">
                <p className="text-sm font-medium text-slate-300">Retenci\u00f3n acad\u00e9mica</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">94%</p>
                <p className="mt-2 text-sm text-slate-300">Continuidad estudiantil del periodo actual.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Cursos</p>
                <p className="summary-value">128</p>
                <p className="mt-1 text-sm text-slate-500">Oferta activa por nivel.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Estudiantes</p>
                <p className="summary-value">2.4k</p>
                <p className="mt-1 text-sm text-slate-500">Matr\u00edcula consolidada.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Soporte</p>
                <p className="summary-value">18</p>
                <p className="mt-1 text-sm text-slate-500">Pendientes operativos hoy.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/panel" className="primary-button">
                Abrir panel diario
              </Link>
              <Link href="/instituciones" className="secondary-button">
                Revisar instituci\u00f3n
              </Link>
              <Link href="/usuarios" className="secondary-button">
                Gestionar accesos
              </Link>
            </div>
          </div>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Acceso de demostraci\u00f3n</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Operaci\u00f3n lista para pruebas</h2>
              </div>
              <span className="info-chip">Base activa</span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Correo institucional</p>
                <p className="mt-2 font-semibold text-slate-950">admin@educa.local</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Clave temporal</p>
                <p className="mt-2 font-semibold text-slate-950">Educa2026!</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Autenticación</p>
                <p className="mt-2 text-sm text-slate-700">
                  {authBootstrap ? `${authBootstrap.currentStatus} · ${authBootstrap.sessionStrategy}` : 'Sin información disponible.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="table-shell">
        <div className="table-toolbar soft-divider">
          <div>
            <p className="eyebrow">M\u00f3dulos principales</p>
            <h2 className="table-title">Navegaci\u00f3n r\u00e1pida del sistema</h2>
            <p className="table-subtitle">Accede a las vistas operativas m\u00e1s usadas sin depender de bloques extensos.</p>
          </div>
          <span className="info-chip">3 m\u00f3dulos activos</span>
        </div>
        <div className="table-scroller">
          <table className="data-table min-w-[720px]">
            <thead>
              <tr>
                <th>M\u00f3dulo</th>
                <th>Uso principal</th>
                <th>Acci\u00f3n</th>
              </tr>
            </thead>
            <tbody>
              {quickModules.map((module) => (
                <tr key={module.href}>
                  <td>
                    <p className="font-semibold text-slate-950">{module.title}</p>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{module.description}</p>
                  </td>
                  <td>
                    <Link href={module.href} className="compact-button">
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-grid-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Bloques operativos</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">Lectura acad\u00e9mica y administrativa en la misma vista</h3>
            </div>
            <span className="info-chip">Lectivo 2026-2027</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Cursos</p>
              <p className="mt-2 text-base font-semibold text-slate-950">Planificaci\u00f3n por nivel y secci\u00f3n</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Estudiantes</p>
              <p className="mt-2 text-base font-semibold text-slate-950">Seguimiento de matr\u00edcula y permanencia</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Evaluaciones</p>
              <p className="mt-2 text-base font-semibold text-slate-950">Resultados visibles para coordinaci\u00f3n</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Actividades</p>
              <p className="mt-2 text-base font-semibold text-slate-950">Agenda operativa y pendientes</p>
            </div>
          </div>
        </div>

        <div className="section-grid-card">
          <p className="eyebrow">Experiencia institucional</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Resumen ejecutivo de la nueva experiencia</h3>
          <div className="mt-5 space-y-3">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-4 rounded-[18px] border border-slate-200 bg-slate-50 p-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                <div>
                  <p className="font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
