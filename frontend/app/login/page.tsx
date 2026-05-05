import Link from 'next/link';
import { LoginForm } from '../../components/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_14%,rgba(36,180,126,0.16),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(29,91,255,0.18),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef5fc_52%,#e8eef6_100%)] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="glass-panel relative overflow-hidden p-8 xl:p-10">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-100/70 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-24 left-12 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="relative">
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
          </div>
        </section>

        <div className="flex w-full justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
