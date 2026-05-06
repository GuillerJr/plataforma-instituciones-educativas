import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { SubjectsWorkspace } from './subjects-workspace';

export const dynamic = 'force-dynamic';

export type SubjectStatus = 'active' | 'inactive';

export type SubjectAcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
};

export type SubjectRecord = {
  id: string;
  levelId?: string | null;
  levelName?: string | null;
  name: string;
  code: string;
  area?: string | null;
  weeklyHours?: number | null;
  status: SubjectStatus;
  assignmentsCount: number;
};

type SubjectsPayload = {
  institution: {
    id: string;
    name: string;
  };
  summary: {
    subjects: number;
    activeSubjects: number;
    scopedSubjects: number;
  };
  subjects: SubjectRecord[];
  academicOptions: {
    levels: SubjectAcademicLevel[];
  };
};

async function loadSubjectsModule() {
  try {
    const snapshot = await fetchDemoApi<SubjectsPayload>('/subjects');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as SubjectsPayload | null, error: error.message };
    }

    return { snapshot: null as SubjectsPayload | null, error: 'No fue posible cargar el módulo de materias.' };
  }
}

export default async function MateriasPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadSubjectsModule(), getCurrentUser()]);
  const inactiveSubjects = Math.max(0, (snapshot?.summary.subjects ?? 0) - (snapshot?.summary.activeSubjects ?? 0));
  const canManage = canManageAcademic(session.user);

  return (
    <main className="space-y-6">
      <PageHero
        badge="Materias"
        title="Catálogo curricular visible y listo para operar con docentes y estructura académica"
        description="El módulo sigue registrando materias reales para la institución activa y mejora la claridad de su cobertura y uso académico."
        metrics={[
          { label: 'Materias activas', value: snapshot?.summary.activeSubjects ?? 0, helper: 'Disponibles para carga académica.' },
          { label: 'Sin actividad', value: inactiveSubjects, helper: 'Registros que no participan hoy.' },
        ]}
        noteTitle="Base curricular"
        noteDescription="La base curricular sigue conectada con la institución activa, docentes y asignaciones académicas del sistema."
      />

      {canManage ? (
        <SubjectsWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede consultar materias, pero no crear ni ajustar el catálogo académico desde esta cuenta."
        />
      )}
    </main>
  );
}
