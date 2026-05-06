import { getCurrentUser, canManageInstitution } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
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
      <PageHero
        badge="Instituciones"
        title="Estructura institucional y sedes en una vista clara para operación diaria"
        description="La pantalla concentra la base institucional, sedes y contacto operativo sin alterar la lógica actual de consulta y edición."
        metrics={[
          { label: 'Registros visibles', value: institutions.length, helper: 'Sede principal y sedes cargadas.' },
          { label: 'Distribución', value: `${publicCount} / ${privateCount}`, helper: 'Públicas y privadas visibles.' },
        ]}
        noteTitle="Lectura operativa"
        noteDescription="La vista prioriza tipo de institución, contacto y acceso rápido a edición sin añadir funciones nuevas."
      />

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
