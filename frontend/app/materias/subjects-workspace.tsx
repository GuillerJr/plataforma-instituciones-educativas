'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
import { SubjectFormModal } from './subject-create-form';
import type { SubjectAcademicLevel, SubjectRecord, SubjectStatus } from './page';

type SubjectsWorkspaceProps = {
  snapshot: {
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
  } | null;
  error: string | null;
};

export function SubjectsWorkspace({ snapshot, error }: SubjectsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const subjects = snapshot?.subjects ?? [];
  const levels = snapshot?.academicOptions.levels ?? [];
  const totalPages = Math.max(1, Math.ceil(subjects.length / pageSize));
  const visibleSubjects = subjects.slice((page - 1) * pageSize, page * pageSize);
  const inactiveSubjects = subjects.filter((subject) => subject.status !== 'active').length;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="workspace-hero">
            <div className="table-toolbar soft-divider">
              <div>
                <p className="eyebrow">Oferta curricular</p>
                <h2 className="table-title">Estado real de materias y cobertura</h2>
                <p className="table-subtitle">Más datos de uso y menos explicación decorativa dentro del módulo.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ActionButton label="Materia" icon={BookOpen} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
                <span className="info-chip">{subjects.length} registradas</span>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile"><p className="summary-label">Materias</p><p className="summary-value">{snapshot?.summary.subjects ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Activas</p><p className="summary-value">{snapshot?.summary.activeSubjects ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Con nivel</p><p className="summary-value">{snapshot?.summary.scopedSubjects ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Sin actividad</p><p className="summary-value">{inactiveSubjects}</p></div>
            </div>
          </section>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Cobertura curricular</p>
                <p className="mt-2 text-sm text-slate-500">Lectura rápida de materias disponibles para la operación académica actual.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile">
                <p className="summary-label">Materias</p>
                <p className="summary-value">{snapshot?.summary.subjects ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Activas</p>
                <p className="summary-value">{snapshot?.summary.activeSubjects ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Con nivel</p>
                <p className="summary-value">{snapshot?.summary.scopedSubjects ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Sin actividad</p>
                <p className="summary-value">{inactiveSubjects}</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="table-shell overflow-hidden">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Materias registradas</p>
              <h2 className="table-title">Base curricular visible de la institución</h2>
              <p className="table-subtitle">Tabla compacta para revisar código, área, nivel sugerido y uso académico en una sola lectura.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{subjects.length} materias</span>
              <ActionButton label="Nueva" icon={BookOpen} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : subjects.length === 0 ? (
            <div className="table-empty">Todavía no hay materias registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1180px]">
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th>Área</th>
                      <th>Nivel</th>
                      <th>Carga referencial</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSubjects.map((subject) => (
                      <tr key={subject.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{subject.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{subject.code}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{subject.area || 'Área por definir'}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{subject.levelName || 'Aplicable a toda la institución'}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{subject.weeklyHours ? `${subject.weeklyHours} h/semana` : 'Por definir'}</p>
                          <p className="mt-1 text-sm text-slate-500">{subject.assignmentsCount} asignación(es) académica(s)</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateSubjectStatus(subject.status)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={subjects.length}
                itemLabel="materias"
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <SubjectFormModal open={createOpen} onClose={() => setCreateOpen(false)} levels={levels} />
    </>
  );
}

function translateSubjectStatus(status: SubjectStatus) {
  if (status === 'active') return 'Activa';
  return 'Inactiva';
}
