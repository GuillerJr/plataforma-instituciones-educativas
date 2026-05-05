import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
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
      <section className="panel-card overflow-hidden rounded-[18px] border border-[#EEF1F5] bg-white p-5 shadow-soft lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-warn">Fase académica 3</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Estudiantes y matrícula mínima conectados con la estructura real del colegio
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              El módulo ya permite registrar estudiantes sobre la institución activa y ubicarlos coherentemente en nivel,
              curso y sección dentro del flujo académico actual.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Estudiantes activos</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{snapshot?.summary.activeStudents ?? 0}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Matrícula disponible para operación diaria.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Con estado no activo</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{inactiveStudents}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Casos visibles para seguimiento administrativo.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Alcance actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La fase deja resuelta la alta mínima de estudiantes y su ubicación coherente dentro de una sola institución educativa.
              </p>
            </div>
          </aside>
        </div>
      </section>

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
