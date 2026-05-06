import Link from 'next/link';
import { LoginForm } from '../../components/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f3f7fb_0%,#eaf0f6_100%)] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.92fr]">
        <section className="hidden lg:block">
          <div className="glass-panel relative overflow-hidden p-8 xl:p-10">
            <div aria-hidden="true" className="absolute -right-24 top-10 h-48 w-48 rounded-full bg-sky-200/60 blur-3xl" />
            <div aria-hidden="true" className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-emerald-200/45 blur-3xl" />

            <div className="relative">
              <p className="eyebrow">Acceso institucional</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
                El panel privado concentra la operación académica y administrativa en un entorno protegido.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-600">
                Aquí ingresan los perfiles autorizados para trabajar con usuarios, estructura académica, matrícula,
                docentes, estudiantes, evaluaciones y asistencia sin mezclar el flujo operativo con el sitio público.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="surface-muted p-4">
                  <p className="text-sm text-slate-500">Acceso</p>
                  <p className="mt-2 font-semibold text-slate-950">Sesión privada por rol</p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm text-slate-500">Operación</p>
                  <p className="mt-2 font-semibold text-slate-950">Módulos académicos y administrativos</p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm text-slate-500">Trazabilidad</p>
                  <p className="mt-2 font-semibold text-slate-950">Lectura filtrada por permisos</p>
                </div>
              </div>

              <Link href="/" className="secondary-button mt-8 w-full sm:w-auto">
                Volver al sitio público
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
