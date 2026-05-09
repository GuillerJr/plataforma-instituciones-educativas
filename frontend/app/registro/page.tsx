import Link from 'next/link';
import { RegisterInterestForm } from '../../components/register-interest-form';

type RegisterPageProps = {
  searchParams?: Promise<{
    requestType?: string;
    context?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-page-v2 min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f3f7fb_0%,#eaf0f6_100%)] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="glass-panel relative overflow-hidden p-5 sm:p-7">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-sky-200/60 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-24 left-12 h-52 w-52 rounded-full bg-emerald-200/50 blur-3xl" />
            <div className="relative">
              <p className="eyebrow">Solicitud institucional</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Punto público unificado para acceso, información institucional o admisión.
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                Esta ruta pública ya permite registrar solicitudes iniciales desde la web sin mezclar la operación privada
                del sistema. Centraliza contacto, acceso y acompañamiento institucional en una sola entrada.
              </p>
              <div className="mt-6 space-y-3">
                <div className="surface-muted p-4">
                  <p className="font-semibold text-slate-950">Cobertura actual</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Solicitudes de acceso, recuperación, información general y admisión desde la interfaz pública.
                  </p>
                </div>
                <div className="surface-muted p-4">
                  <p className="font-semibold text-slate-950">Estado del flujo</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    El formulario ya existe como punto de entrada y deja explícito que la trazabilidad completa se integra después.
                  </p>
                </div>
              </div>
              <Link href="/login" className="secondary-button mt-6 w-full sm:w-auto">
                Ya tengo credenciales
              </Link>
            </div>
          </div>

          <RegisterInterestForm requestType={params?.requestType} context={params?.context} />
        </section>
      </div>
    </main>
  );
}
