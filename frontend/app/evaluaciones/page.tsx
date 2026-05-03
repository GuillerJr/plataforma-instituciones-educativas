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
  const [evaluationsModule, gradesModule] = await Promise.all([loadEvaluationsModule(), loadEvaluationGradesModule()]);

  return (
    <main className="page-main">
      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Fase académica 6</p>
            <h1 className="section-title mt-3">Evaluaciones y calificaciones conectadas con asignaciones, materias, docentes y matrículas reales</h1>
            <p className="section-copy mt-4 max-w-3xl">
              El módulo permite crear instrumentos de evaluación y registrar notas de estudiantes matriculados dentro de la única institución educativa activa.
            </p>
          </div>
          <aside className="side-note-card">
            <div className="summary-strip xl:grid-cols-2">
              <div className="summary-item">
                <p className="summary-label">Evaluaciones</p>
                <p className="summary-value">{evaluationsModule.snapshot?.summary.evaluations ?? 0}</p>
                <p className="mt-1 text-sm text-slate-500">Instrumentos visibles por materia y docente.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Promedio registrado</p>
                <p className="summary-value">{gradesModule.snapshot?.summary.averageScore ?? '0'}</p>
                <p className="mt-1 text-sm text-slate-500">Lectura rápida del rendimiento cargado.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cobertura actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cada nota se valida contra la cobertura de la evaluación y la matrícula activa del mismo periodo escolar antes de guardarse.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <EvaluationsWorkspace
        evaluationsSnapshot={evaluationsModule.snapshot}
        evaluationsError={evaluationsModule.error}
        gradesSnapshot={gradesModule.snapshot}
        gradesError={gradesModule.error}
      />
    </main>
  );
}
