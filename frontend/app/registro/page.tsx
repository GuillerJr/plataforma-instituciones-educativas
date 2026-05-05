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
    <main className="auth-page min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_14%,rgba(36,180,126,0.14),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(29,91,255,0.16),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef5fc_52%,#e8eef6_100%)] px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="glass-panel relative overflow-hidden p-5 sm:p-7">
            <div aria-hidden="true" className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-100/70 blur-3xl" />
            <div aria-hidden="true" className="absolute -bottom-24 left-12 h-52 w-52 rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="relative">
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
          </div>

          <RegisterInterestForm requestType={params?.requestType} context={params?.context} />
        </section>
      </div>
    </main>
  );
}
