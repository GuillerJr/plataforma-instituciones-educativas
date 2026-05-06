import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { AcademicStructureWorkspace } from './academic-structure-workspace';

export const dynamic = 'force-dynamic';

export type AcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
  gradesCount: number;
  sectionsCount: number;
};

export type AcademicGrade = {
  id: string;
  levelId: string;
  levelName: string;
  name: string;
  code: string;
  sortOrder: number;
  sectionsCount: number;
};

export type AcademicSection = {
  id: string;
  gradeId: string;
  gradeName: string;
  levelName: string;
  name: string;
  code: string;
  shift?: 'matutina' | 'vespertina' | null;
  capacity?: number | null;
};

type AcademicStructurePayload = {
  institution: {
    id: string;
    name: string;
  };
  summary: {
    levels: number;
    grades: number;
    sections: number;
  };
  levels: AcademicLevel[];
  grades: AcademicGrade[];
  sections: AcademicSection[];
};

async function loadAcademicStructure() {
  try {
    const snapshot = await fetchDemoApi<AcademicStructurePayload>('/academic-structure');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as AcademicStructurePayload | null, error: error.message };
    }

    return { snapshot: null as AcademicStructurePayload | null, error: 'No fue posible cargar la estructura académica.' };
  }
}

export default async function AcademicoPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadAcademicStructure(), getCurrentUser()]);
  const canManage = canManageAcademic(session.user);

  return (
    <main className="space-y-6">
      <PageHero
        badge="Estructura académica"
        title="Niveles, cursos y secciones organizados para sostener toda la operación escolar"
        description="Esta vista concentra la base académica real del colegio y la presenta con una jerarquía más clara para coordinación y administración."
        metrics={[
          { label: 'Institución activa', value: snapshot?.institution.name ?? 'Sin datos', helper: 'Base única del colegio actual.' },
          { label: 'Bloques cargados', value: (snapshot?.summary.levels ?? 0) + (snapshot?.summary.grades ?? 0) + (snapshot?.summary.sections ?? 0), helper: 'Entre niveles, grados y paralelos.' },
        ]}
        noteTitle="Base conectada"
        noteDescription="La estructura sigue conectada al backend actual y mantiene la relación con matrícula, asignaciones y carga docente."
      />

      {canManage ? (
        <AcademicStructureWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede consultar la estructura escolar, pero no crear niveles, grados ni secciones desde esta cuenta."
        />
      )}
    </main>
  );
}
