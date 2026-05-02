import Link from 'next/link';
import { InstitutionCreateForm } from './institution-create-form';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';

export const dynamic = 'force-dynamic';

type Institution = {
  id: string;
  name: string;
  slug: string;
  institutionType: 'publica' | 'privada';
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  activeSchoolYearLabel?: string;
};

async function loginAndLoadInstitutions() {
  try {
    const institutions = await fetchDemoApi<Institution[]>('/institutions');
    return { institutions, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { institutions: [] as Institution[], error: error.message };
    }

    return { institutions: [] as Institution[], error: 'No fue posible cargar instituciones.' };
  }
}

export default async function InstitutionsPage() {
  const { institutions, error } = await loginAndLoadInstitutions();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Fase 3 · Instituciones</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Módulo inicial de instituciones</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Esta vista ya consulta la API protegida con autenticación base y muestra el registro institucional disponible.
          </p>
        </div>
        <Link href="/" className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
          Volver al inicio
        </Link>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <InstitutionCreateForm />

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Registro actual</p>
              <p className="mt-1 text-sm text-slate-500">Listado protegido de instituciones disponibles.</p>
            </div>
            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-slate-300">
              {institutions.length} instituciones
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr] gap-4 border-b border-white/10 px-5 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                <span>Institución</span>
                <span>Contacto</span>
                <span>Tipo</span>
                <span>Año activo</span>
              </div>

              {error ? (
                <div className="px-5 py-6 text-sm text-rose-300">{error}</div>
              ) : institutions.length === 0 ? (
                <div className="px-5 py-6 text-sm text-slate-400">Todavía no hay instituciones registradas.</div>
              ) : (
                institutions.map((institution) => (
                  <div key={institution.id} className="grid grid-cols-[2fr_1.2fr_1fr_1fr] gap-4 border-b border-white/6 px-5 py-4 text-sm text-slate-200 last:border-b-0">
                    <div>
                      <p className="font-medium text-white">{institution.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{institution.slug}</p>
                      <p className="mt-2 text-xs text-slate-400">{institution.address ?? 'Dirección por definir'}</p>
                    </div>
                    <div>
                      <p>{institution.contactEmail ?? 'Sin correo'}</p>
                      <p className="mt-1 text-xs text-slate-500">{institution.contactPhone ?? 'Sin teléfono'}</p>
                    </div>
                    <div className="capitalize">{institution.institutionType}</div>
                    <div>{institution.activeSchoolYearLabel ?? 'Por definir'}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
