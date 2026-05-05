import { getCurrentUser, canManageInstitution } from '../../lib/current-user';
import { ModuleAccessGuard } from '../../components/module-access-guard';
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
  const [{ institutions, error }, session] = await Promise.all([loginAndLoadInstitutions(), getCurrentUser()]);
  const publicCount = institutions.filter((institution) => institution.institutionType === 'publica').length;
  const privateCount = institutions.length - publicCount;
  const canManage = canManageInstitution(session.user);

  return (
    <main className="space-y-6">
      <section className="panel-card overflow-hidden rounded-[18px] border border-[#EEF1F5] bg-white p-5 shadow-soft lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-blue">Institución y sedes</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Datos institucionales visibles, compactos y listos para operación
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              Esta vista concentra la institución base, sus sedes y sus datos operativos en una lectura compacta,
              directa y coherente con un solo colegio.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Estructura visible</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{institutions.length}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Sede principal y sedes cargadas.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Distribución</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{publicCount} / {privateCount}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Públicas y privadas visibles.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Composición</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Más equilibrio entre contexto, resumen y tabla para que la vista no se vea pesada ni dispersa.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {canManage ? (
        <InstitutionsWorkspace institutions={institutions} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede consultar la información institucional, pero no crear ni modificar estructura institucional desde esta cuenta."
        />
      )}
    </main>
  );
}
