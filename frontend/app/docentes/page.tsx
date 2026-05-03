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
  const { snapshot, error } = await loadTeachersModule();
  const teachersWithoutAssignment = Math.max(0, (snapshot?.summary.teachers ?? 0) - (snapshot?.summary.assignedTeachers ?? 0));

  return (
    <main className="page-main">
      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Fase académica 2</p>
            <h1 className="section-title mt-3">Docentes y asignación académica conectados con la estructura real del colegio</h1>
            <p className="section-copy mt-4 max-w-3xl">
              La planta docente ya puede registrarse sobre la institución activa y vincularse directamente a nivel, curso o sección sin salir del flujo académico actual.
            </p>
          </div>
          <aside className="side-note-card">
            <div className="summary-strip xl:grid-cols-2">
              <div className="summary-item">
                <p className="summary-label">Docentes activos</p>
                <p className="summary-value">{snapshot?.summary.activeTeachers ?? 0}</p>
                <p className="mt-1 text-sm text-slate-500">Disponibles para operación académica.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Pendientes de carga</p>
                <p className="summary-value">{teachersWithoutAssignment}</p>
                <p className="mt-1 text-sm text-slate-500">Sin asignación académica visible.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Alcance actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">La fase deja resuelta la alta de docentes y una asignación coherente enlazada con la base académica ya creada para una sola institución.</p>
            </div>
          </aside>
        </div>
      </section>

      <TeachersWorkspace snapshot={snapshot} error={error} />
    </main>
  );
}
