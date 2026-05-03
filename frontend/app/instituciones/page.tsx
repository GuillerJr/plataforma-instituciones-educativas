import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { InstitutionsWorkspace } from './institutions-workspace';

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
  const publicCount = institutions.filter((institution) => institution.institutionType === 'publica').length;
  const privateCount = institutions.length - publicCount;

  return (
    <main className="space-y-6 pb-8">
      <section className="glass-panel px-6 py-7 sm:px-8 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
          <div>
            <p className="eyebrow">Instituci\u00f3n y sedes</p>
            <h1 className="section-title mt-3">Datos institucionales visibles, compactos y listos para operaci\u00f3n</h1>
            <p className="section-copy mt-4 max-w-3xl">
              Esta vista deja de presentar el sistema como multiinstituci\u00f3n. Ahora concentra los registros internos de la instituci\u00f3n, sus sedes y sus datos operativos en una lectura m\u00e1s limpia.
            </p>
          </div>
          <div className="summary-strip">
            <div className="summary-item">
              <p className="summary-label">Registros</p>
              <p className="summary-value">{institutions.length}</p>
              <p className="mt-1 text-sm text-slate-500">Sedes o registros cargados.</p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Distribuci\u00f3n</p>
              <p className="summary-value text-lg sm:text-xl">{publicCount} p\u00fablicas / {privateCount} privadas</p>
              <p className="mt-1 text-sm text-slate-500">Clasificaci\u00f3n visible en backend actual.</p>
            </div>
          </div>
        </div>
      </section>

      <InstitutionsWorkspace institutions={institutions} error={error} />
    </main>
  );
}
