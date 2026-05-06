import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { AcademicAssignmentsWorkspace } from './academic-assignments-workspace';

export const dynamic = 'force-dynamic';

export type AssignmentTeacherOption = {
  id: string;
  fullName: string;
  specialty?: string | null;
  status: 'active' | 'inactive' | 'licencia';
};

export type AssignmentSubjectOption = {
  id: string;
  levelId?: string | null;
  levelName?: string | null;
  name: string;
  code: string;
  area?: string | null;
  weeklyHours?: number | null;
  status: 'active' | 'inactive';
};

export type AssignmentLevelOption = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
};

export type AssignmentGradeOption = {
  id: string;
  levelId: string;
  levelName: string;
  name: string;
  code: string;
  sortOrder: number;
};

export type AssignmentSectionOption = {
  id: string;
  levelId: string;
  gradeId: string;
  levelName: string;
  gradeName: string;
  name: string;
  code: string;
  shift?: 'matutina' | 'vespertina' | null;
};

export type AcademicAssignmentRecord = {
  id: string;
  teacherId: string;
  teacherName: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  levelId: string;
  levelName: string;
  gradeId: string;
  gradeName: string;
  sectionId?: string | null;
  sectionName?: string | null;
  weeklyHours?: number | null;
  notes?: string | null;
};

type AcademicAssignmentsPayload = {
  institution: {
    id: string;
    name: string;
  };
  summary: {
    assignments: number;
    withSection: number;
    linkedTeachers: number;
  };
  assignments: AcademicAssignmentRecord[];
  options: {
    teachers: AssignmentTeacherOption[];
    subjects: AssignmentSubjectOption[];
    levels: AssignmentLevelOption[];
    grades: AssignmentGradeOption[];
    sections: AssignmentSectionOption[];
  };
};

async function loadAcademicAssignmentsModule() {
  try {
    const snapshot = await fetchDemoApi<AcademicAssignmentsPayload>('/academic-assignments');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as AcademicAssignmentsPayload | null, error: error.message };
    }

    return { snapshot: null as AcademicAssignmentsPayload | null, error: 'No fue posible cargar el módulo de asignaciones académicas.' };
  }
}

export default async function AsignacionesAcademicasPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadAcademicAssignmentsModule(), getCurrentUser()]);
  const courseWideAssignments = Math.max(0, (snapshot?.summary.assignments ?? 0) - (snapshot?.summary.withSection ?? 0));
  const canManage = canManageAcademic(session.user);

  return (
    <main className="page-main">
      <PageHero
        badge="Asignaciones académicas"
        title="Carga docente enlazada con materias y estructura real del colegio"
        description="La coordinación puede seguir definiendo qué docente dicta cada materia y en qué alcance académico, ahora con una lectura más clara y consistente."
        metrics={[
          { label: 'Con sección puntual', value: snapshot?.summary.withSection ?? 0, helper: 'Cobertura cerrada por paralelo.' },
          { label: 'A nivel de curso', value: courseWideAssignments, helper: 'Aplicación general por grado o curso.' },
        ]}
        noteTitle="Validación actual"
        noteDescription="Las asignaciones siguen validadas contra docentes, materias y jerarquía académica ya creada para la institución activa."
      />

      {canManage ? (
        <AcademicAssignmentsWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede revisar asignaciones académicas, pero no crear ni redistribuir carga docente desde esta cuenta."
        />
      )}
    </main>
  );
}
