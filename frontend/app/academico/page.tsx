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
  const { snapshot, error } = await loadAcademicStructure();

  return (
    <main className="page-main">
      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Fase académica 1</p>
            <h1 className="section-title mt-3">Niveles, cursos y secciones listos para operar en una sola institución</h1>
            <p className="section-copy mt-4 max-w-3xl">
              Esta vista instala la base académica real del colegio con estructura mínima, altas rápidas y lectura clara para coordinación y administración.
            </p>
          </div>
          <aside className="side-note-card">
            <div className="summary-strip xl:grid-cols-2">
              <div className="summary-item">
                <p className="summary-label">Institución activa</p>
                <p className="summary-value text-lg sm:text-xl">{snapshot?.institution.name ?? 'Sin datos'}</p>
                <p className="mt-1 text-sm text-slate-500">Base única del colegio actual.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Bloques cargados</p>
                <p className="summary-value">{(snapshot?.summary.levels ?? 0) + (snapshot?.summary.grades ?? 0) + (snapshot?.summary.sections ?? 0)}</p>
                <p className="mt-1 text-sm text-slate-500">Entre niveles, grados y paralelos.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Alcance actual</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">La estructura queda conectada al backend real y preparada para crecer luego hacia matrícula, asignaciones y carga docente.</p>
            </div>
          </aside>
        </div>
      </section>

      <AcademicStructureWorkspace snapshot={snapshot} error={error} />
    </main>
  );
}
