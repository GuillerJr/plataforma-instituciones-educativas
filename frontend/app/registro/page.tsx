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
    <main className="auth-page-v2">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="glass-panel p-5 sm:p-7">
            <div>
              <p className="eyebrow">Solicitud institucional</p>
              <h1 className="mt-3 text-3xl">
                Punto público unificado para acceso, información institucional o admisión.
              </h1>
              <p className="mt-4 text-sm leading-7">
                Esta ruta pública ya permite registrar solicitudes iniciales desde la web sin mezclar la operación privada
                del sistema. Centraliza contacto, acceso y acompañamiento institucional en una sola entrada.
              </p>
              <div className="mt-6 space-y-3">
                <div className="surface-muted p-4">
                  <p className="font-semibold text-fg">Cobertura actual</p>
                  <p className="mt-2 text-sm leading-6">
                    Solicitudes de acceso, recuperación, información general y admisión desde la interfaz pública.
                  </p>
                </div>
                <div className="surface-muted p-4">
                  <p className="font-semibold text-fg">Estado del flujo</p>
                  <p className="mt-2 text-sm leading-6">
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
