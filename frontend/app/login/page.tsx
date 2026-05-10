import Link from 'next/link';
import { LoginForm } from '../../components/login-form';

export default function LoginPage() {
  return (
    <main className="auth-page-v2">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.92fr]">
        <section className="hidden lg:block">
          <div className="glass-panel p-8 xl:p-10">
            <div>
              <p className="eyebrow">Acceso institucional</p>
              <h2 className="mt-4 text-4xl">
                El panel privado concentra la operación académica y administrativa en un entorno protegido.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-7">
                Aquí ingresan los perfiles autorizados para trabajar con usuarios, estructura académica, matrícula,
                docentes, estudiantes, evaluaciones y asistencia sin mezclar el flujo operativo con el sitio público.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="surface-muted p-4">
                  <p className="text-sm">Acceso</p>
                  <p className="mt-2 font-semibold text-fg">Sesión privada por rol</p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm">Operación</p>
                  <p className="mt-2 font-semibold text-fg">Módulos académicos y administrativos</p>
                </div>
                <div className="surface-muted p-4">
                  <p className="text-sm">Trazabilidad</p>
                  <p className="mt-2 font-semibold text-fg">Lectura filtrada por permisos</p>
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
