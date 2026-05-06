import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { StudentsWorkspace } from './students-workspace';

export const dynamic = 'force-dynamic';

export type StudentStatus = 'active' | 'inactive' | 'retirado';

export type StudentAcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
};

export type StudentAcademicGrade = {
  id: string;
  levelId: string;
  levelName: string;
  name: string;
  code: string;
  sortOrder: number;
};

export type StudentAcademicSection = {
  id: string;
  levelId: string;
  gradeId: string;
  levelName: string;
  gradeName: string;
  name: string;
  code: string;
  shift?: 'matutina' | 'vespertina' | null;
  capacity?: number | null;
};

export type StudentRecord = {
  id: string;
  fullName: string;
  identityDocument: string;
  enrollmentCode: string;
  email?: string | null;
  phone?: string | null;
  status: StudentStatus;
  levelId: string;
  gradeId: string;
  sectionId: string;
  levelName: string;
  gradeName: string;
  sectionName: string;
  shift?: 'matutina' | 'vespertina' | null;
};

type StudentsPayload = {
  institution: {
    id: string;
    name: string;
  };
  summary: {
    students: number;
    activeStudents: number;
    sectionsInUse: number;
  };
  students: StudentRecord[];
  academicOptions: {
    levels: StudentAcademicLevel[];
    grades: StudentAcademicGrade[];
    sections: StudentAcademicSection[];
  };
};

async function loadStudentsModule() {
  try {
    const snapshot = await fetchDemoApi<StudentsPayload>('/students');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as StudentsPayload | null, error: error.message };
    }

    return { snapshot: null as StudentsPayload | null, error: 'No fue posible cargar el módulo de estudiantes.' };
  }
}

export default async function EstudiantesPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadStudentsModule(), getCurrentUser()]);
  const inactiveStudents = Math.max(0, (snapshot?.summary.students ?? 0) - (snapshot?.summary.activeStudents ?? 0));
  const canManage = canManageAcademic(session.user);

  return (
    <main className="space-y-6">
      <PageHero
        badge="Estudiantes"
        title="Registro estudiantil y ubicación escolar conectados con la estructura real del colegio"
        description="La experiencia mantiene intacta la lógica actual y mejora la lectura de matrícula, estado y ubicación académica de cada estudiante."
        metrics={[
          { label: 'Estudiantes activos', value: snapshot?.summary.activeStudents ?? 0, helper: 'Matrícula disponible para operación diaria.' },
          { label: 'Con estado no activo', value: inactiveStudents, helper: 'Casos visibles para seguimiento administrativo.' },
        ]}
        noteTitle="Lectura institucional"
        noteDescription="La pantalla conserva el alta de estudiantes y su ubicación coherente dentro de la institución educativa activa."
      />

      <StudentsWorkspace snapshot={snapshot} error={error} canManage={canManage} />
      {!canManage ? (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede consultar estudiantes, pero no crear ni ajustar matrícula base desde esta cuenta."
        />
      ) : null}
    </main>
  );
}
