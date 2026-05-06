import { getCurrentUser, canWorkOnEvaluations } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { EvaluationsWorkspace } from './evaluations-workspace';

export const dynamic = 'force-dynamic';

export type EvaluationType = 'diagnostica' | 'tarea' | 'taller' | 'prueba' | 'proyecto' | 'examen' | 'quimestre';

export type EvaluationAssignmentOption = {
  id: string;
  teacherId: string;
  subjectId: string;
  levelId: string;
  gradeId: string;
  sectionId?: string | null;
  weeklyHours?: number | null;
  notes?: string | null;
  teacherName: string;
  teacherStatus: 'active' | 'inactive' | 'licencia';
  subjectName: string;
  subjectCode: string;
  subjectStatus: 'active' | 'inactive';
  levelName: string;
  gradeName: string;
  sectionName?: string | null;
};

export type EvaluationRecord = {
  id: string;
  academicAssignmentId: string;
  schoolYearLabel: string;
  title: string;
  evaluationType: EvaluationType;
  periodLabel: string;
  dueDate?: string | null;
  maxScore: number;
  weightPercentage?: number | null;
  description?: string | null;
  createdAt: string;
  teacherId: string;
  subjectId: string;
  levelId: string;
  gradeId: string;
  sectionId?: string | null;
  teacherName: string;
  subjectName: string;
  subjectCode: string;
  levelName: string;
  gradeName: string;
  sectionName?: string | null;
  registeredGrades: number;
};

export type GradeStudentOption = {
  id: string;
  fullName: string;
  identityDocument: string;
  enrollmentCode: string;
  enrollmentId: string;
  schoolYearLabel: string;
  levelId: string;
  levelName: string;
  gradeId: string;
  gradeName: string;
  sectionId: string;
  sectionName: string;
};

export type GradeEvaluationOption = {
  id: string;
  title: string;
  evaluationType: EvaluationType;
  periodLabel: string;
  maxScore: number;
  schoolYearLabel: string;
  dueDate?: string | null;
  teacherId: string;
  subjectId: string;
  levelId: string;
  gradeId: string;
  sectionId?: string | null;
  teacherName: string;
  subjectName: string;
  subjectCode: string;
  levelName: string;
  gradeName: string;
  sectionName?: string | null;
};

export type EvaluationGradeRecord = {
  id: string;
  evaluationId: string;
  studentId: string;
  enrollmentId: string;
  score: number;
  feedback?: string | null;
  gradedAt: string;
  createdAt: string;
  evaluationTitle: string;
  evaluationType: EvaluationType;
  periodLabel: string;
  maxScore: number;
  schoolYearLabel: string;
  studentName: string;
  studentDocument: string;
  studentEnrollmentCode: string;
  teacherId: string;
  subjectId: string;
  levelId: string;
  gradeId: string;
  sectionId?: string | null;
  teacherName: string;
  subjectName: string;
  subjectCode: string;
  levelName: string;
  gradeName: string;
  sectionName?: string | null;
};

type EvaluationsPayload = {
  institution: {
    id: string;
    name: string;
    activeSchoolYearLabel?: string | null;
  };
  summary: {
    evaluations: number;
    sectionScoped: number;
    registeredGrades: number;
  };
  evaluations: EvaluationRecord[];
  assignments: EvaluationAssignmentOption[];
};

type EvaluationGradesPayload = {
  institution: {
    id: string;
    name: string;
    activeSchoolYearLabel?: string | null;
  };
  summary: {
    grades: number;
    uniqueStudents: number;
    evaluationsCovered: number;
    averageScore?: number | null;
  };
  grades: EvaluationGradeRecord[];
  options: {
    evaluations: GradeEvaluationOption[];
    students: GradeStudentOption[];
  };
};

async function loadEvaluationsModule() {
  try {
    const snapshot = await fetchDemoApi<EvaluationsPayload>('/evaluations');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as EvaluationsPayload | null, error: error.message };
    }

    return { snapshot: null as EvaluationsPayload | null, error: 'No fue posible cargar el módulo de evaluaciones.' };
  }
}

async function loadEvaluationGradesModule() {
  try {
    const snapshot = await fetchDemoApi<EvaluationGradesPayload>('/evaluation-grades');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as EvaluationGradesPayload | null, error: error.message };
    }

    return { snapshot: null as EvaluationGradesPayload | null, error: 'No fue posible cargar el módulo de calificaciones.' };
  }
}

export default async function EvaluacionesPage() {
  const [evaluationsModule, gradesModule, session] = await Promise.all([loadEvaluationsModule(), loadEvaluationGradesModule(), getCurrentUser()]);
  const canManage = canWorkOnEvaluations(session.user);

  return (
    <main className="space-y-6">
      <PageHero
        badge="Evaluaciones y notas"
        title="Evaluaciones y calificaciones conectadas con asignaciones, materias, docentes y matrículas reales"
        description="La interfaz mejora la lectura de cobertura, periodo, puntaje y rendimiento sin modificar la lógica actual de evaluaciones o calificaciones."
        metrics={[
          { label: 'Evaluaciones', value: evaluationsModule.snapshot?.summary.evaluations ?? 0, helper: 'Instrumentos visibles por materia y docente.' },
          { label: 'Promedio registrado', value: gradesModule.snapshot?.summary.averageScore ?? '0', helper: 'Lectura rápida del rendimiento cargado.' },
        ]}
        noteTitle="Validación operativa"
        noteDescription="Cada nota conserva su validación contra la cobertura de la evaluación y la matrícula activa del mismo periodo escolar."
      />

      {canManage ? (
        <EvaluationsWorkspace
          evaluationsSnapshot={evaluationsModule.snapshot}
          evaluationsError={evaluationsModule.error}
          gradesSnapshot={gradesModule.snapshot}
          gradesError={gradesModule.error}
        />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Este perfil puede revisar resultados, pero no crear evaluaciones ni registrar calificaciones desde esta cuenta."
        />
      )}
    </main>
  );
}
