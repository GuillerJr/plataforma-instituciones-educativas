import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
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
      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Fase académica 4</p>
            <h1 className="section-title mt-3">Asignaciones académicas enlazadas con docentes, materias y estructura real del colegio</h1>
            <p className="section-copy mt-4 max-w-3xl">
              La coordinación ya puede definir qué docente dicta qué materia y en qué nivel, curso o sección dentro de la institución activa.
            </p>
          </div>
          <aside className="side-note-card">
            <div className="summary-strip xl:grid-cols-2">
              <div className="summary-item">
                <p className="summary-label">Con sección puntual</p>
                <p className="summary-value">{snapshot?.summary.withSection ?? 0}</p>
                <p className="mt-1 text-sm text-slate-500">Cobertura cerrada por paralelo.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">A nivel de curso</p>
                <p className="summary-value">{courseWideAssignments}</p>
                <p className="mt-1 text-sm text-slate-500">Aplicación general por grado o curso.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Alcance actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">Las asignaciones quedan validadas contra docentes, materias y jerarquía académica ya creada para una sola institución educativa.</p>
            </div>
          </aside>
        </div>
      </section>

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
