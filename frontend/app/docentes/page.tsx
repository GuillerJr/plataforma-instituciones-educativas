import { getCurrentUser, canManageTeaching } from '../../lib/current-user';
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
      <section className="panel-card overflow-hidden p-5 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-blue">Fase académica 2</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Docentes y asignación académica conectados con la estructura real del colegio
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              La planta docente ya puede registrarse sobre la institución activa y vincularse directamente a nivel, curso o sección sin salir del flujo académico actual.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Docentes activos</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{snapshot?.summary.activeTeachers ?? 0}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Disponibles para operación académica.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Pendientes de carga</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{teachersWithoutAssignment}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Sin asignación académica visible.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Alcance actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La fase deja resuelta la alta de docentes y una asignación coherente enlazada con la base académica ya creada para una sola institución.
              </p>
            </div>
          </aside>
        </div>
      </section>

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
