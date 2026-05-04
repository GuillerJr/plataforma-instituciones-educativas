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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f5f8fc_38%,_#e9eff6_100%)] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="glass-panel p-6 sm:p-8">
            <p className="eyebrow">Registro institucional</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Solicitud de acceso o acompañamiento institucional</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Esta página deja preparada la captación pública para familias, aspirantes, docentes o personal administrativo. También centraliza solicitudes de acceso o recuperación de contraseña mientras la trazabilidad completa se integra en la siguiente fase.
            </p>
            <div className="mt-6 space-y-3">
              <div className="surface-muted p-4">
                <p className="font-semibold text-slate-950">Uso previsto</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Solicitudes de acceso, recuperación de contraseña, admisión, orientación y contacto institucional con entrada unificada.</p>
              </div>
              <div className="surface-muted p-4">
                <p className="font-semibold text-slate-950">Próxima iteración</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Persistencia, bandeja interna de revisión, estados del trámite y confirmaciones automáticas.</p>
              </div>
            </div>
            <Link href="/login" className="secondary-button mt-6 w-full sm:w-auto">
              Ya tengo credenciales
            </Link>
          </div>

          <RegisterInterestForm requestType={params?.requestType} context={params?.context} />
        </section>
      </div>
    </main>
  );
}
