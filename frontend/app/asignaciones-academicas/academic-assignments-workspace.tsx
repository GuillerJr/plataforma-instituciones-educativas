'use client';

import { useState } from 'react';
import { PaginationControls } from '../../components/pagination-controls';
import { AcademicAssignmentFormModal } from './academic-assignment-create-form';
import type {
  AcademicAssignmentRecord,
  AssignmentGradeOption,
  AssignmentLevelOption,
  AssignmentSectionOption,
  AssignmentSubjectOption,
  AssignmentTeacherOption,
} from './page';

type AcademicAssignmentsWorkspaceProps = {
  snapshot: {
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
  } | null;
  error: string | null;
};

export function AcademicAssignmentsWorkspace({ snapshot, error }: AcademicAssignmentsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const assignments = snapshot?.assignments ?? [];
  const teachers = snapshot?.options.teachers ?? [];
  const subjects = snapshot?.options.subjects ?? [];
  const levels = snapshot?.options.levels ?? [];
  const grades = snapshot?.options.grades ?? [];
  const sections = snapshot?.options.sections ?? [];
  const totalPages = Math.max(1, Math.ceil(assignments.length / pageSize));
  const visibleAssignments = assignments.slice((page - 1) * pageSize, page * pageSize);
  const assignmentsWithoutSection = assignments.filter((assignment) => !assignment.sectionId).length;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="workspace-hero">
            <div className="table-toolbar soft-divider">
              <div>
                <p className="eyebrow">Carga docente por materia</p>
                <h2 className="table-title">Estado real de asignaciones académicas</h2>
                <p className="table-subtitle">Se prioriza cobertura docente, alcance curricular y densidad real de operación.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                  Nueva asignación académica
                </button>
                <span className="info-chip">{assignments.length} registradas</span>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile"><p className="summary-label">Asignaciones</p><p className="summary-value">{snapshot?.summary.assignments ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Con sección</p><p className="summary-value">{snapshot?.summary.withSection ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Docentes vinculados</p><p className="summary-value">{snapshot?.summary.linkedTeachers ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Por curso</p><p className="summary-value">{assignmentsWithoutSection}</p></div>
            </div>
          </section>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Cobertura docente</p>
                <p className="mt-2 text-sm text-slate-500">Vista resumida de las asignaciones curriculares ya visibles en la institución actual.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile">
                <p className="summary-label">Asignaciones</p>
                <p className="summary-value">{snapshot?.summary.assignments ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Con sección</p>
                <p className="summary-value">{snapshot?.summary.withSection ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Docentes vinculados</p>
                <p className="summary-value">{snapshot?.summary.linkedTeachers ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Por curso</p>
                <p className="summary-value">{assignmentsWithoutSection}</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="table-shell overflow-hidden">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Asignaciones registradas</p>
              <h2 className="table-title">Carga académica visible por docente y materia</h2>
              <p className="table-subtitle">Tabla operativa para revisar cobertura, horas y contexto académico en una sola lectura.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{assignments.length} asignaciones</span>
              <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                Crear
              </button>
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : assignments.length === 0 ? (
            <div className="table-empty">Todavía no hay asignaciones académicas registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1320px]">
                  <thead>
                    <tr>
                      <th>Docente</th>
                      <th>Materia</th>
                      <th>Cobertura académica</th>
                      <th>Horas</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleAssignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{assignment.teacherName}</p>
                          <p className="mt-1 text-sm text-slate-500">{assignment.levelName}</p>
                        </td>
                        <td>
                          <p className="font-semibold text-slate-950">{assignment.subjectName}</p>
                          <p className="mt-1 text-sm text-slate-500">{assignment.subjectCode}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{assignment.gradeName}{assignment.sectionName ? ` · ${assignment.sectionName}` : ''}</p>
                          <p className="mt-1 text-sm text-slate-500">{assignment.sectionName ? 'Asignación por sección' : 'Asignación por curso o grado'}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{assignment.weeklyHours ? `${assignment.weeklyHours} h/semana` : 'Por definir'}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{assignment.notes || 'Sin notas adicionales'}</p>
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
                totalItems={assignments.length}
                itemLabel="asignaciones"
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <AcademicAssignmentFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        teachers={teachers}
        subjects={subjects}
        levels={levels}
        grades={grades}
        sections={sections}
      />
    </>
  );
}
