import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { AcademicStructureWorkspace } from './academic-structure-workspace';

export const dynamic = 'force-dynamic';

export type AcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
  gradesCount: number;
  sectionsCount: number;
};

export type AcademicGrade = {
  id: string;
  levelId: string;
  levelName: string;
  name: string;
  code: string;
  sortOrder: number;
  sectionsCount: number;
};

export type AcademicSection = {
  id: string;
  gradeId: string;
  gradeName: string;
  levelName: string;
  name: string;
  code: string;
  shift?: 'matutina' | 'vespertina' | null;
  capacity?: number | null;
};

type AcademicStructurePayload = {
  institution: {
    id: string;
    name: string;
  };
  summary: {
    levels: number;
    grades: number;
    sections: number;
  };
  levels: AcademicLevel[];
  grades: AcademicGrade[];
  sections: AcademicSection[];
};

async function loadAcademicStructure() {
  try {
    const snapshot = await fetchDemoApi<AcademicStructurePayload>('/academic-structure');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as AcademicStructurePayload | null, error: error.message };
    }

    return { snapshot: null as AcademicStructurePayload | null, error: 'No fue posible cargar la estructura académica.' };
  }
}

export default async function AcademicoPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadAcademicStructure(), getCurrentUser()]);
  const canManage = canManageAcademic(session.user);

  return (
    <main className="space-y-6">
      <section className="panel-card overflow-hidden p-5 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-success">Fase académica 1</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Niveles, cursos y secciones listos para operar en una sola institución
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              Esta vista instala la base académica real del colegio con estructura mínima, altas rápidas y lectura clara
              para coordinación y administración.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Institución activa</p>
              <p className="mt-2 text-[22px] font-extrabold leading-tight text-ink">{snapshot?.institution.name ?? 'Sin datos'}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Base única del colegio actual.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Bloques cargados</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{(snapshot?.summary.levels ?? 0) + (snapshot?.summary.grades ?? 0) + (snapshot?.summary.sections ?? 0)}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Entre niveles, grados y paralelos.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Alcance actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La estructura queda conectada al backend real y preparada para crecer luego hacia matrícula, asignaciones y carga docente.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {canManage ? (
        <AcademicStructureWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede consultar la estructura escolar, pero no crear niveles, grados ni secciones desde esta cuenta."
        />
      )}
    </main>
  );
}
