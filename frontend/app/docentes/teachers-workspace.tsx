'use client';

import { useState } from 'react';
import { PaginationControls } from '../../components/pagination-controls';
import { TeacherFormModal } from './teacher-create-form';
import type { TeacherAcademicGrade, TeacherAcademicLevel, TeacherAcademicSection, TeacherRecord, TeacherStatus } from './page';

type TeachersWorkspaceProps = {
  snapshot: {
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
  } | null;
  error: string | null;
};

export function TeachersWorkspace({ snapshot, error }: TeachersWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const teachers = snapshot?.teachers ?? [];
  const levels = snapshot?.academicOptions.levels ?? [];
  const grades = snapshot?.academicOptions.grades ?? [];
  const sections = snapshot?.academicOptions.sections ?? [];
  const totalPages = Math.max(1, Math.ceil(teachers.length / pageSize));
  const visibleTeachers = teachers.slice((page - 1) * pageSize, page * pageSize);
  const inactiveTeachers = teachers.filter((teacher) => teacher.status !== 'active').length;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="section-grid-card">
            <div className="flex flex-col gap-4">
              <div>
                <p className="eyebrow">Planta docente</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Altas rápidas con asignación académica en el mismo flujo</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  La coordinación ya puede registrar docentes y dejar visible su responsabilidad por nivel, curso o sección sin depender de pantallas separadas.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="primary-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                  Nuevo docente
                </button>
                <span className="info-chip">{teachers.length} registrados</span>
              </div>

              <div className="surface-muted p-4 text-sm text-slate-600">
                La asignación inicial ya se valida contra la estructura académica de la institución activa y puede quedar pendiente si todavía no se define la carga.
              </div>
            </div>
          </aside>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Cobertura académica</p>
                <p className="mt-2 text-sm text-slate-500">Disponibilidad actual para vincular docentes a la estructura del colegio.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile">
                <p className="summary-label">Docentes</p>
                <p className="summary-value">{snapshot?.summary.teachers ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Con asignación</p>
                <p className="summary-value">{snapshot?.summary.assignedTeachers ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Niveles disponibles</p>
                <p className="summary-value">{levels.length}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Sin actividad</p>
                <p className="summary-value">{inactiveTeachers}</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="table-shell overflow-hidden">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Docentes registrados</p>
              <h2 className="table-title">Planta académica de la institución</h2>
              <p className="table-subtitle">Tabla operativa para revisar área, asignación actual, estado y contacto en una sola lectura.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{teachers.length} docentes</span>
              <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                Crear
              </button>
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : teachers.length === 0 ? (
            <div className="table-empty">Todavía no hay docentes registrados.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1180px]">
                  <thead>
                    <tr>
                      <th>Docente</th>
                      <th>Especialidad</th>
                      <th>Asignación actual</th>
                      <th>Estado</th>
                      <th>Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{teacher.fullName}</p>
                          <p className="mt-1 text-sm text-slate-500">{teacher.identityDocument}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{teacher.specialty || 'Por definir'}</p>
                        </td>
                        <td>
                          {teacher.assignmentTitle && teacher.assignmentLabel ? (
                            <div>
                              <p className="font-medium text-slate-950">{teacher.assignmentTitle}</p>
                              <p className="mt-1 text-sm text-slate-500">{teacher.assignmentLabel}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">Sin asignación registrada</p>
                          )}
                        </td>
                        <td>
                          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                            <span className="info-chip h-fit">{translateTeacherStatus(teacher.status)}</span>
                            <span className="text-xs text-slate-500">{teacher.assignmentsCount} carga(s)</span>
                          </div>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{teacher.email || 'Sin correo'}</p>
                          <p className="mt-1 text-sm text-slate-500">{teacher.phone || 'Sin teléfono'}</p>
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
                totalItems={teachers.length}
                itemLabel="docentes"
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <TeacherFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        levels={levels}
        grades={grades}
        sections={sections}
      />
    </>
  );
}

function translateTeacherStatus(status: TeacherStatus) {
  if (status === 'active') return 'Activo';
  if (status === 'inactive') return 'Inactivo';
  return 'En licencia';
}
