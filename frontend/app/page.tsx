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
    title: 'Panel ejecutivo',
    description: 'Lectura inmediata del estado institucional, usuarios y operación general.',
  },
  {
    href: '/instituciones',
    title: 'Instituciones',
    description: 'Registro institucional, datos principales y seguimiento del año lectivo activo.',
  },
  {
    href: '/usuarios',
    title: 'Usuarios y roles',
    description: 'Accesos, estados, asignación institucional y perfiles operativos.',
  },
];

const highlights = [
  {
    title: 'Autoridades',
    description: 'Indicadores visibles, contexto ejecutivo y acceso rápido a los módulos más usados.',
  },
  {
    title: 'Gestión diaria',
    description: 'Procesos de alta y consulta con menos ruido visual y mejor legibilidad.',
  },
  {
    title: 'Comunidad educativa',
    description: 'Una base visual profesional para seguir creciendo hacia servicios estudiantiles.',
  },
];

export default async function HomePage() {
  const authBootstrap = await getAuthBootstrap();

  return (
    <main className="space-y-8 pb-10">
      <section className="glass-panel px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
          <div className="space-y-6">
            <span className="eyebrow">Plataforma institucional educativa</span>
            <div className="space-y-4">
              <h1 className="section-title max-w-4xl">
                Una experiencia clara y profesional para dirigir, administrar y acompañar la vida institucional.
              </h1>
              <p className="section-copy max-w-3xl">
                Educa concentra el trabajo de autoridades, equipos administrativos y comunidad estudiantil en una interfaz más ordenada,
                confiable y fácil de recorrer desde el primer uso.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/panel" className="primary-button">
                Ir al panel principal
              </Link>
              <Link href="/instituciones" className="secondary-button">
                Gestionar instituciones
              </Link>
              <Link href="/usuarios" className="secondary-button">
                Gestionar usuarios y roles
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item) => (
                <div key={item.title} className="surface-muted p-5">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="surface-panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Acceso institucional</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Ingreso demo operativo</h2>
              </div>
              <span className="info-chip">Base activa</span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Correo</p>
                <p className="mt-2 font-medium text-slate-950">admin@educa.local</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Clave</p>
                <p className="mt-2 font-medium text-slate-950">Educa2026!</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Estado de autenticación</p>
                <p className="mt-2 text-sm text-slate-700">
                  {authBootstrap ? `${authBootstrap.currentStatus} · ${authBootstrap.sessionStrategy}` : 'Sin información disponible.'}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {quickModules.map((module) => (
          <Link key={module.href} href={module.href} className="surface-panel p-6 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_22px_48px_rgba(14,165,233,0.1)]">
            <p className="eyebrow">Módulo</p>
            <h3 className="mt-3 text-2xl font-semibold text-slate-950">{module.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{module.description}</p>
            <span className="mt-6 inline-flex text-sm font-semibold text-sky-700">Entrar</span>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface-panel p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Institución de referencia</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">Unidad Educativa Demo Educa</h3>
            </div>
            <span className="info-chip">2026-2027</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Tipo institucional</p>
              <p className="mt-2 text-slate-950">Privada</p>
            </div>
            <div className="surface-muted p-4">
              <p className="text-sm text-slate-500">Contacto base</p>
              <p className="mt-2 text-slate-950">info@educa.demo</p>
            </div>
            <div className="surface-muted p-4 md:col-span-2">
              <p className="text-sm text-slate-500">Dirección operativa</p>
              <p className="mt-2 text-slate-950">Quito, Ecuador</p>
            </div>
          </div>
        </div>

        <div className="surface-panel p-6">
          <p className="eyebrow">Ruta del producto</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">Próximas capas del sistema</h3>
          <ul className="mt-6 space-y-3 text-sm text-slate-600">
            <li>Consolidar una experiencia visual operativa para directivos y estudiantes.</li>
            <li>Ampliar CRUD y búsqueda en los módulos principales.</li>
            <li>Introducir estructura académica base por fases.</li>
            <li>Evolucionar hacia una plataforma institucional más completa.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
