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
    description: 'Resumen de operación, accesos y actividad reciente del colegio.',
  },
  {
    href: '/instituciones',
    title: 'Institución',
    description: 'Datos base, sedes y contacto operativo de la institución.',
  },
  {
    href: '/usuarios',
    title: 'Usuarios y roles',
    description: 'Accesos, estados, permisos y responsables operativos.',
  },
  {
    href: '/academico',
    title: 'Estructura académica',
    description: 'Niveles, cursos o grados y secciones reales para la institución actual.',
  },
  {
    href: '/docentes',
    title: 'Docentes',
    description: 'Planta docente y asignación académica visible sobre la estructura del colegio.',
  },
  {
    href: '/estudiantes',
    title: 'Estudiantes',
    description: 'Matrícula mínima con ubicación coherente por nivel, curso y sección.',
  },
  {
    href: '/matriculas',
    title: 'Matrículas',
    description: 'Inscripciones del periodo escolar conectadas con estudiantes y secciones reales.',
  },
  {
    href: '/materias',
    title: 'Materias',
    description: 'Oferta curricular base en español para la institución educativa activa.',
  },
  {
    href: '/asignaciones-academicas',
    title: 'Asignaciones académicas',
    description: 'Carga docente enlazada con materia, nivel, curso y sección.',
  },
  {
    href: '/evaluaciones',
    title: 'Evaluaciones y calificaciones',
    description: 'Instrumentos, notas y seguimiento académico por estudiante matriculado.',
  },
  {
    href: '/asistencia',
    title: 'Asistencia',
    description: 'Control diario por fecha y sección enlazado con matrículas reales del periodo activo.',
  },
];

const highlights = [
  {
    title: 'Autoridades',
    description: 'Indicadores claros para rectorado y coordinación sin sobrecargar la pantalla.',
  },
  {
    title: 'Gestión diaria',
    description: 'Procesos de alta, consulta y seguimiento en vistas más compactas.',
  },
  {
    title: 'Equipo institucional',
    description: 'Una base visual consistente para administración, soporte y seguimiento académico.',
  },
];

export default async function HomePage() {
  const authBootstrap = await getAuthBootstrap();

  return (
    <main className="page-main">
      <section className="hero-panel">
        <div className="hero-grid xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.65fr)]">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">Software institucional</span>
              <span className="info-chip">UX compacta</span>
            </div>
            <div className="space-y-3">
              <h1 className="section-title max-w-4xl">
                Un sistema más claro para operar una sola institución educativa.
              </h1>
              <p className="section-copy max-w-3xl">
                El nuevo frente visual concentra la lectura diaria del colegio en vistas compactas, tablas responsivas y acciones directas para rectorado, coordinación y administración.
              </p>
            </div>

            <div className="summary-strip">
              <div className="dark-metric-card">
                <p className="text-sm font-medium text-slate-300">Retención académica</p>
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
                <p className="mt-1 text-sm text-slate-500">Matrícula consolidada.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Soporte</p>
                <p className="summary-value">18</p>
                <p className="mt-1 text-sm text-slate-500">Pendientes operativos hoy.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/panel" className="primary-button w-full sm:w-auto">
                Abrir panel diario
              </Link>
              <Link href="/instituciones" className="secondary-button w-full sm:w-auto">
                Revisar institución
              </Link>
              <Link href="/usuarios" className="secondary-button w-full sm:w-auto">
                Gestionar accesos
              </Link>
              <Link href="/academico" className="secondary-button w-full sm:w-auto">
                Abrir estructura académica
              </Link>
              <Link href="/docentes" className="secondary-button w-full sm:w-auto">
                Gestionar docentes
              </Link>
              <Link href="/estudiantes" className="secondary-button w-full sm:w-auto">
                Gestionar estudiantes
              </Link>
              <Link href="/matriculas" className="secondary-button w-full sm:w-auto">
                Gestionar matrículas
              </Link>
              <Link href="/materias" className="secondary-button w-full sm:w-auto">
                Gestionar materias
              </Link>
              <Link href="/asignaciones-academicas" className="secondary-button w-full sm:w-auto">
                Gestionar asignaciones
              </Link>
              <Link href="/evaluaciones" className="secondary-button w-full sm:w-auto">
                Gestionar evaluaciones
              </Link>
              <Link href="/asistencia" className="secondary-button w-full sm:w-auto">
                Gestionar asistencia
              </Link>
            </div>
          </div>

          <aside className="side-note-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Acceso de demostración</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Operación lista para pruebas</h2>
              </div>
              <span className="info-chip">Base activa</span>
            </div>

            <div className="mt-6 stack-list">
              <div className="stack-list-item">
                <p className="text-sm text-slate-500">Correo institucional</p>
                <p className="mt-2 font-semibold text-slate-950">admin@educa.local</p>
              </div>
              <div className="stack-list-item">
                <p className="text-sm text-slate-500">Clave temporal</p>
                <p className="mt-2 font-semibold text-slate-950">Educa2026!</p>
              </div>
              <div className="stack-list-item">
                <p className="text-sm text-slate-500">Autenticación</p>
                <p className="mt-2 text-sm text-slate-700">
                  {authBootstrap ? `${authBootstrap.currentStatus} · ${authBootstrap.sessionStrategy}` : 'Sin información disponible.'}
                </p>
              </div>
              <div className="stack-list-item bg-slate-950 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Criterio visual</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">Tarjetas más compactas, jerarquía clara y navegación rápida para no parecer una plantilla genérica.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-grid-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Módulos principales</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Navegación rápida del sistema</h2>
            <p className="mt-2 text-sm text-slate-500">Accesos más directos y legibles para los flujos que más se usan.</p>
          </div>
          <span className="info-chip">11 módulos activos</span>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {quickModules.map((module) => (
            <article key={module.href} className="flex h-full flex-col rounded-[22px] border border-slate-200 bg-slate-50/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Módulo</p>
              <h3 className="mt-3 text-lg font-semibold text-slate-950">{module.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{module.description}</p>
              <Link href={module.href} className="compact-button mt-5 w-full sm:w-fit">
                Abrir módulo
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="section-grid-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Bloques operativos</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-950">Lectura académica y administrativa en la misma vista</h3>
            </div>
            <span className="info-chip">Oferta 2026-2027</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Cursos</p>
              <p className="mt-2 text-base font-semibold text-slate-950">Planificación por nivel y sección</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Estudiantes</p>
              <p className="mt-2 text-base font-semibold text-slate-950">Seguimiento de matrícula y permanencia</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Evaluaciones</p>
              <p className="mt-2 text-base font-semibold text-slate-950">Resultados visibles para coordinación</p>
            </div>
            <div className="surface-muted p-4">
               <p className="text-sm text-slate-500">Asistencia</p>
               <p className="mt-2 text-base font-semibold text-slate-950">Seguimiento diario por sección y estudiante</p>
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
