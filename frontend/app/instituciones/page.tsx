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
    <main className="space-y-8 pb-10">
      <section className="glass-panel px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Instituciones</p>
            <h1 className="section-title mt-3">Gestión institucional clara y confiable</h1>
            <p className="section-copy mt-4 max-w-3xl">
              Un módulo pensado para autoridades que necesitan registrar, revisar y mantener la información principal de cada institución.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/panel" className="secondary-button">Ver panel</Link>
            <Link href="/usuarios" className="secondary-button">Ver usuarios</Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <InstitutionCreateForm />

        <section className="surface-panel overflow-hidden">
          <div className="soft-divider flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Registro institucional</p>
              <p className="mt-2 text-sm text-slate-500">Instituciones disponibles en la operación actual.</p>
            </div>
            <span className="info-chip">{institutions.length} instituciones</span>
          </div>

          {error ? (
            <div className="px-6 py-6 text-sm text-rose-700">{error}</div>
          ) : institutions.length === 0 ? (
            <div className="px-6 py-6 text-sm text-slate-500">Todavía no hay instituciones registradas.</div>
          ) : (
            <div className="space-y-3 p-4">
              {institutions.map((institution) => (
                <article key={institution.id} className="table-row-card">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-950">{institution.name}</h3>
                      <p className="text-sm text-slate-500">{institution.slug}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="info-chip">{translateInstitutionType(institution.institutionType)}</span>
                        <span className="info-chip">{institution.activeSchoolYearLabel ?? 'Año por definir'}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600 lg:max-w-xs lg:text-right">
                      <p>{institution.contactEmail ?? 'Sin correo'}</p>
                      <p>{institution.contactPhone ?? 'Sin teléfono'}</p>
                      <p className="text-slate-500">{institution.address ?? 'Dirección por definir'}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function translateInstitutionType(type: Institution['institutionType']) {
  if (type === 'publica') return 'Pública';
  return 'Privada';
}
