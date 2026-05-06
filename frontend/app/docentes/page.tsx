import { getCurrentUser, canManageTeaching } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { TeachersWorkspace } from './teachers-workspace';

export const dynamic = 'force-dynamic';

export type TeacherStatus = 'active' | 'inactive' | 'licencia';
export type AssignmentScope = 'nivel' | 'curso' | 'seccion';

export type TeacherAcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
};

export type TeacherAcademicGrade = {
  id: string;
  levelId: string;
  levelName: string;
  name: string;
  code: string;
  sortOrder: number;
};

export type TeacherAcademicSection = {
  id: string;
  levelId: string;
  gradeId: string;
  levelName: string;
  gradeName: string;
  name: string;
  code: string;
  shift?: 'matutina' | 'vespertina' | null;
};

export type TeacherRecord = {
  id: string;
  fullName: string;
  identityDocument: string;
  email?: string | null;
  phone?: string | null;
  specialty?: string | null;
  status: TeacherStatus;
  assignmentsCount: number;
  assignmentTitle?: string | null;
  assignmentScope?: AssignmentScope | null;
  assignmentLabel?: string | null;
};

type TeachersPayload = {
  institution: {
    id: string;
    name: string;
  };
  summary: {
    teachers: number;
    activeTeachers: number;
    assignedTeachers: number;
  };
  teachers: TeacherRecord[];
  academicOptions: {
    levels: TeacherAcademicLevel[];
    grades: TeacherAcademicGrade[];
    sections: TeacherAcademicSection[];
  };
};

async function loadTeachersModule() {
  try {
    const snapshot = await fetchDemoApi<TeachersPayload>('/teachers');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as TeachersPayload | null, error: error.message };
    }

    return { snapshot: null as TeachersPayload | null, error: 'No fue posible cargar el módulo de docentes.' };
  }
}

export default async function DocentesPage() {
  const [{ snapshot, error }, { user }] = await Promise.all([loadTeachersModule(), getCurrentUser()]);
  const teachersWithoutAssignment = Math.max(0, (snapshot?.summary.teachers ?? 0) - (snapshot?.summary.assignedTeachers ?? 0));
  const canManage = canManageTeaching(user);

  return (
    <main className="space-y-6">
      <PageHero
        badge="Docentes"
        title="Planta docente conectada con la estructura real del colegio"
        description="La interfaz prioriza cobertura, especialidad y asignación visible sin alterar el flujo académico ya implementado."
        metrics={[
          { label: 'Docentes activos', value: snapshot?.summary.activeTeachers ?? 0, helper: 'Disponibles para operación académica.' },
          { label: 'Pendientes de carga', value: teachersWithoutAssignment, helper: 'Sin asignación académica visible.' },
        ]}
        noteTitle="Operación docente"
        noteDescription="La vista mantiene el alta de docentes y su relación con la base académica ya creada para la institución activa."
      />

      {canManage ? (
        <TeachersWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede revisar información docente, pero no registrar ni reasignar docentes desde esta cuenta."
        />
      )}
    </main>
  );
}
