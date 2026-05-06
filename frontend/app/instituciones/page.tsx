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
      <section className="panel-card overflow-hidden p-5 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-blue">Instituciones</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Estructura institucional y sedes en una vista clara para operación diaria
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              La pantalla concentra la base institucional, sedes y contacto operativo sin alterar la lógica actual de consulta y edición.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Registros visibles</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{institutions.length}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Sede principal y sedes cargadas.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Distribución</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{publicCount} / {privateCount}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Públicas y privadas visibles.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Lectura operativa</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La vista prioriza tipo de institución, contacto y acceso rápido a edición sin añadir funciones nuevas.
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
