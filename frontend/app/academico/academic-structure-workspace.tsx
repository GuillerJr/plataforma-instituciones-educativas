'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { PaginationControls } from '../../components/pagination-controls';
import { GradeFormModal, LevelFormModal, SectionFormModal } from './academic-create-forms';
import type { AcademicGrade, AcademicLevel, AcademicSection } from './page';

type AcademicStructureWorkspaceProps = {
  snapshot: {
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
  } | null;
  error: string | null;
};

export function AcademicStructureWorkspace({ snapshot, error }: AcademicStructureWorkspaceProps) {
  const [levelOpen, setLevelOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [levelsPage, setLevelsPage] = useState(1);
  const [gradesPage, setGradesPage] = useState(1);
  const [sectionsPage, setSectionsPage] = useState(1);
  const pageSize = 5;

  const levels = snapshot?.levels ?? [];
  const grades = snapshot?.grades ?? [];
  const sections = snapshot?.sections ?? [];

  const totalLevelPages = Math.max(1, Math.ceil(levels.length / pageSize));
  const totalGradePages = Math.max(1, Math.ceil(grades.length / pageSize));
  const totalSectionPages = Math.max(1, Math.ceil(sections.length / pageSize));
  const visibleLevels = levels.slice((levelsPage - 1) * pageSize, levelsPage * pageSize);
  const visibleGrades = grades.slice((gradesPage - 1) * pageSize, gradesPage * pageSize);
  const visibleSections = sections.slice((sectionsPage - 1) * pageSize, sectionsPage * pageSize);
  const sectionsWithCapacity = sections.filter((section) => typeof section.capacity === 'number').length;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="section-grid-card">
            <div className="flex flex-col gap-4">
              <div>
                <p className="eyebrow">Base académica</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Altas directas para coordinación y administración</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Los tres bloques quedan operativos con creación en modal, lectura rápida y jerarquía visible sin salir de la pantalla principal.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="primary-button w-full sm:w-auto" onClick={() => setLevelOpen(true)}>
                  Nuevo nivel
                </button>
                <button type="button" className="secondary-button w-full sm:w-auto" onClick={() => setGradeOpen(true)}>
                  Nuevo curso o grado
                </button>
                <button type="button" className="secondary-button w-full sm:w-auto" onClick={() => setSectionOpen(true)}>
                  Nueva sección
                </button>
              </div>
            </div>
          </aside>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Cobertura estructural</p>
                <p className="mt-2 text-sm text-slate-500">Vista resumida de la estructura mínima ya disponible para la institución.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile">
                <p className="summary-label">Niveles</p>
                <p className="summary-value">{snapshot?.summary.levels ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Cursos o grados</p>
                <p className="summary-value">{snapshot?.summary.grades ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Secciones</p>
                <p className="summary-value">{snapshot?.summary.sections ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Con capacidad</p>
                <p className="summary-value">{sectionsWithCapacity}</p>
              </div>
            </div>
          </aside>
        </div>

        {error ? <div className="surface-panel px-5 py-4 text-sm text-rose-700">{error}</div> : null}

        <EntityTable
          eyebrow="Niveles académicos"
          title="Etapas base del colegio"
          subtitle="Orden, etapa educativa y cobertura de grados por nivel."
          countLabel={`${levels.length} niveles`}
          emptyLabel="Todavía no hay niveles registrados."
          onCreate={() => setLevelOpen(true)}
          page={levelsPage}
          totalPages={totalLevelPages}
          totalItems={levels.length}
          itemLabel="niveles"
          onPageChange={setLevelsPage}
        >
          <table className="data-table min-w-[920px]">
            <thead>
              <tr>
                <th>Nivel</th>
                <th>Etapa</th>
                <th>Orden</th>
                <th>Cobertura</th>
              </tr>
            </thead>
            <tbody>
              {visibleLevels.map((level) => (
                <tr key={level.id}>
                  <td>
                    <p className="font-semibold text-slate-950">{level.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{level.code}</p>
                  </td>
                  <td>
                    <span className="info-chip h-fit">{translateStage(level.educationalStage)}</span>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{level.sortOrder}</p>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{level.gradesCount} cursos o grados · {level.sectionsCount} secciones</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EntityTable>

        <EntityTable
          eyebrow="Cursos y grados"
          title="Oferta base por nivel"
          subtitle="Listado operativo para construir la malla mínima por nivel sin abrir pantallas extra."
          countLabel={`${grades.length} registros`}
          emptyLabel="Todavía no hay cursos o grados registrados."
          onCreate={() => setGradeOpen(true)}
          page={gradesPage}
          totalPages={totalGradePages}
          totalItems={grades.length}
          itemLabel="cursos o grados"
          onPageChange={setGradesPage}
        >
          <table className="data-table min-w-[960px]">
            <thead>
              <tr>
                <th>Curso o grado</th>
                <th>Nivel</th>
                <th>Orden</th>
                <th>Secciones</th>
              </tr>
            </thead>
            <tbody>
              {visibleGrades.map((grade) => (
                <tr key={grade.id}>
                  <td>
                    <p className="font-semibold text-slate-950">{grade.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{grade.code}</p>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{grade.levelName}</p>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{grade.sortOrder}</p>
                  </td>
                  <td>
                    <span className="info-chip h-fit">{grade.sectionsCount} activas</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EntityTable>

        <EntityTable
          eyebrow="Secciones y paralelos"
          title="Capacidad operativa por aula"
          subtitle="Vista compacta de secciones, jornada y capacidad referencial para la institución actual."
          countLabel={`${sections.length} secciones`}
          emptyLabel="Todavía no hay secciones registradas."
          onCreate={() => setSectionOpen(true)}
          page={sectionsPage}
          totalPages={totalSectionPages}
          totalItems={sections.length}
          itemLabel="secciones"
          onPageChange={setSectionsPage}
        >
          <table className="data-table min-w-[1080px]">
            <thead>
              <tr>
                <th>Sección</th>
                <th>Curso o grado</th>
                <th>Nivel</th>
                <th>Jornada</th>
                <th>Capacidad</th>
              </tr>
            </thead>
            <tbody>
              {visibleSections.map((section) => (
                <tr key={section.id}>
                  <td>
                    <p className="font-semibold text-slate-950">{section.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{section.code}</p>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{section.gradeName}</p>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{section.levelName}</p>
                  </td>
                  <td>
                    <span className="info-chip h-fit">{translateShift(section.shift)}</span>
                  </td>
                  <td>
                    <p className="text-sm text-slate-600">{section.capacity ?? 'Por definir'}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </EntityTable>
      </div>

      <LevelFormModal open={levelOpen} onClose={() => setLevelOpen(false)} />
      <GradeFormModal open={gradeOpen} onClose={() => setGradeOpen(false)} levels={levels} />
      <SectionFormModal open={sectionOpen} onClose={() => setSectionOpen(false)} grades={grades} />
    </>
  );
}

function EntityTable({
  eyebrow,
  title,
  subtitle,
  countLabel,
  emptyLabel,
  children,
  onCreate,
  page,
  totalPages,
  totalItems,
  itemLabel,
  onPageChange,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  countLabel: string;
  emptyLabel: string;
  children: ReactNode;
  onCreate: () => void;
  page: number;
  totalPages: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}) {
  return (
    <section className="table-shell overflow-hidden">
      <div className="table-toolbar soft-divider">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="table-title">{title}</h2>
          <p className="table-subtitle">{subtitle}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          <span className="info-chip">{countLabel}</span>
          <button type="button" className="compact-button w-full sm:w-auto" onClick={onCreate}>Crear</button>
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="table-empty">{emptyLabel}</div>
      ) : (
        <>
          <div className="table-scroller">{children}</div>
          <PaginationControls
            page={page}
            totalPages={totalPages}
            pageSize={5}
            totalItems={totalItems}
            itemLabel={itemLabel}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  );
}

function translateStage(stage: AcademicLevel['educationalStage']) {
  if (stage === 'inicial') return 'Inicial';
  if (stage === 'basica') return 'Básica';
  return 'Bachillerato';
}

function translateShift(shift: AcademicSection['shift']) {
  if (shift === 'matutina') return 'Matutina';
  if (shift === 'vespertina') return 'Vespertina';
  return 'Por definir';
}
