import Link from 'next/link';
import { LoginForm } from '../../components/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f5f8fc_38%,_#e9eff6_100%)] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="glass-panel p-8 xl:p-10">
            <p className="eyebrow">Plataforma institucional</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Una entrada clara para el equipo institucional y un sistema interno protegido para la operación escolar.</h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-600">
              Educa separa la presencia institucional, la comunicación con familias y el acceso operativo del equipo académico para mantener orden, confianza y control en una sola experiencia coherente.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Oferta</p>
                <p className="mt-2 font-semibold text-slate-950">Inicial, primaria y secundaria</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Comunidad</p>
                <p className="mt-2 font-semibold text-slate-950">Familias, docentes y coordinación</p>
              </div>
              <div className="surface-muted p-4">
                <p className="text-sm text-slate-500">Acceso</p>
                <p className="mt-2 font-semibold text-slate-950">Seguro, trazable y separado del sitio público</p>
              </div>
            </div>
            <Link href="/" className="secondary-button mt-8 w-full sm:w-auto">
              Volver al sitio institucional
            </Link>
          </div>
        </section>

        <div className="flex w-full justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
