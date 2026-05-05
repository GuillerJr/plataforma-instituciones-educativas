import { getCurrentUser, canWorkOnEvaluations } from '../../lib/current-user';
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
      <section className="panel-card overflow-hidden p-5 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-blue">Fase académica 6</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Evaluaciones y calificaciones conectadas con asignaciones, materias, docentes y matrículas reales
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              El módulo permite crear instrumentos de evaluación y registrar notas de estudiantes matriculados dentro de la única institución educativa activa.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Evaluaciones</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{evaluationsModule.snapshot?.summary.evaluations ?? 0}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Instrumentos visibles por materia y docente.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Promedio registrado</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{gradesModule.snapshot?.summary.averageScore ?? '0'}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Lectura rápida del rendimiento cargado.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Cobertura actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cada nota se valida contra la cobertura de la evaluación y la matrícula activa del mismo periodo escolar antes de guardarse.
              </p>
            </div>
          </aside>
        </div>
      </section>

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
