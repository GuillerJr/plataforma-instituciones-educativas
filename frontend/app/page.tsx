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

export default async function HomePage() {
  const authBootstrap = await getAuthBootstrap();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <section className="space-y-6">
          <span className="inline-flex rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-1 text-sm text-sky-200">
            Educa · Fundación del producto
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Plataforma integral para instituciones educativas.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-300 md:text-lg">
              Ya existe una base publicada con backend real, frontend real y los primeros bloques del dominio.
              El siguiente foco es autenticación, instituciones, usuarios y roles.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/panel" className="inline-flex rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 transition hover:bg-emerald-400/20">
              Abrir panel administrativo
            </Link>
            <Link href="/instituciones" className="inline-flex rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 transition hover:bg-sky-400/20">
              Abrir módulo de instituciones
            </Link>
            <Link href="/usuarios" className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
              Abrir módulo de usuarios y roles
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Estado</p>
              <p className="mt-3 text-lg font-semibold text-white">Fundación publicada</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Auth</p>
              <p className="mt-3 text-lg font-semibold text-white">Base operable</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Instituciones</p>
              <p className="mt-3 text-lg font-semibold text-white">API inicial activa</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Despliegue</p>
              <p className="mt-3 text-lg font-semibold text-white">educa.hacktrickstore.com</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Acceso bootstrap</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-sm text-slate-400">Correo demo</p>
                <p className="mt-1 font-medium text-white">admin@educa.local</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="text-sm text-slate-400">Clave demo</p>
                <p className="mt-1 font-medium text-white">Educa2026!</p>
              </div>
            </div>
            {authBootstrap ? <p className="mt-4 text-sm text-slate-300">{authBootstrap.currentStatus} · {authBootstrap.sessionStrategy}</p> : null}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Instituciones demo</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-semibold text-white">Unidad Educativa Demo Educa</p>
                <p className="mt-1 text-sm text-slate-400">unidad-educativa-demo-educa · privada</p>
                <p className="mt-2 text-sm text-slate-300">Año activo: 2026-2027</p>
                <p className="mt-1 text-sm text-slate-500">info@educa.demo</p>
              </div>
              <p className="text-sm text-slate-400">La consulta completa de instituciones ya quedó protegida por autenticación real base.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Siguiente tramo</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>• login real con persistencia</li>
              <li>• CRUD serio de instituciones</li>
              <li>• usuarios y roles institucionales</li>
              <li>• dashboard administrativo inicial</li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
