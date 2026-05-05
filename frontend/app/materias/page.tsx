import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { SubjectsWorkspace } from './subjects-workspace';

export const dynamic = 'force-dynamic';

export type SubjectStatus = 'active' | 'inactive';

export type SubjectAcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
};

export type SubjectRecord = {
  id: string;
  levelId?: string | null;
  levelName?: string | null;
  name: string;
  code: string;
  area?: string | null;
  weeklyHours?: number | null;
  status: SubjectStatus;
  assignmentsCount: number;
};

type SubjectsPayload = {
  institution: {
    id: string;
    name: string;
  };
  summary: {
    subjects: number;
    activeSubjects: number;
    scopedSubjects: number;
  };
  subjects: SubjectRecord[];
  academicOptions: {
    levels: SubjectAcademicLevel[];
  };
};

async function loadSubjectsModule() {
  try {
    const snapshot = await fetchDemoApi<SubjectsPayload>('/subjects');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as SubjectsPayload | null, error: error.message };
    }

    return { snapshot: null as SubjectsPayload | null, error: 'No fue posible cargar el módulo de materias.' };
  }
}

export default async function MateriasPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadSubjectsModule(), getCurrentUser()]);
  const inactiveSubjects = Math.max(0, (snapshot?.summary.subjects ?? 0) - (snapshot?.summary.activeSubjects ?? 0));
  const canManage = canManageAcademic(session.user);

  return (
    <main className="space-y-6">
      <section className="panel-card overflow-hidden rounded-[18px] border border-[#EEF1F5] bg-white p-5 shadow-soft lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-success">Fase académica 4</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Materias visibles y listas para conectarse con docentes y estructura académica
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              El módulo ya permite registrar materias reales para la institución activa y dejarlas preparadas para su asignación por nivel, curso o sección.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Materias activas</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{snapshot?.summary.activeSubjects ?? 0}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Disponibles para carga académica.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Sin actividad</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{inactiveSubjects}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Registros que no participan hoy.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Alcance actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La fase deja resuelta la base de materias en español y conectada con la única institución educativa del entorno demo.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {canManage ? (
        <SubjectsWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede consultar materias, pero no crear ni ajustar el catálogo académico desde esta cuenta."
        />
      )}
    </main>
  );
}
