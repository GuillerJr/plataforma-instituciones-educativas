'use client';

import { useState } from 'react';
import { PaginationControls } from '../../components/pagination-controls';
import { StudentFormModal } from './student-create-form';
import type { StudentAcademicGrade, StudentAcademicLevel, StudentAcademicSection, StudentRecord, StudentStatus } from './page';

type StudentsWorkspaceProps = {
  canManage: boolean;
  snapshot: {
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
  } | null;
  error: string | null;
};

export function StudentsWorkspace({ snapshot, error, canManage }: StudentsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const students = snapshot?.students ?? [];
  const levels = snapshot?.academicOptions.levels ?? [];
  const grades = snapshot?.academicOptions.grades ?? [];
  const sections = snapshot?.academicOptions.sections ?? [];
  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const visibleStudents = students.slice((page - 1) * pageSize, page * pageSize);
  const inactiveStudents = students.filter((student) => student.status !== 'active').length;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="workspace-hero p-5">
            <div className="flex flex-col gap-4">
              <div>
                <p className="eyebrow">Matrícula estudiantil</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Altas rápidas con ubicación académica visible en el mismo flujo</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  La coordinación ya puede registrar estudiantes y dejarlos ubicados en nivel, curso y sección sin romper la navegación académica existente.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {canManage ? (
                  <button type="button" className="primary-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                    Nuevo estudiante
                  </button>
                ) : null}
                <span className="info-chip">{students.length} registrados</span>
              </div>

              <div className="surface-muted p-4 text-sm text-slate-600">
                La matrícula inicial queda validada contra la sección seleccionada para asegurar coherencia automática con curso y nivel.
              </div>
            </div>
          </aside>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Cobertura de matrícula</p>
                <p className="mt-2 text-sm text-slate-500">Disponibilidad actual para ubicar estudiantes dentro de la estructura académica del colegio.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile">
                <p className="summary-label">Estudiantes</p>
                <p className="summary-value">{snapshot?.summary.students ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Activos</p>
                <p className="summary-value">{snapshot?.summary.activeStudents ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Secciones en uso</p>
                <p className="summary-value">{snapshot?.summary.sectionsInUse ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Sin actividad</p>
                <p className="summary-value">{inactiveStudents}</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="table-shell overflow-hidden">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Estudiantes registrados</p>
              <h2 className="table-title">Matrícula operativa de la institución</h2>
              <p className="table-subtitle">Tabla compacta para revisar ubicación académica, estado y datos base en una sola lectura.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{students.length} estudiantes</span>
              {canManage ? (
                <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                  Crear
                </button>
              ) : null}
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : students.length === 0 ? (
            <div className="table-empty">Todavía no hay estudiantes registrados.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1280px]">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Matrícula</th>
                      <th>Ubicación académica</th>
                      <th>Estado</th>
                      <th>Contacto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{student.fullName}</p>
                          <p className="mt-1 text-sm text-slate-500">{student.identityDocument}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{student.enrollmentCode}</p>
                          <p className="mt-1 text-sm text-slate-500">{student.levelName}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{student.gradeName} · {student.sectionName}</p>
                          <p className="mt-1 text-sm text-slate-500">{translateShift(student.shift)}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateStudentStatus(student.status)}</span>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{student.email || 'Sin correo'}</p>
                          <p className="mt-1 text-sm text-slate-500">{student.phone || 'Sin teléfono'}</p>
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
                totalItems={students.length}
                itemLabel="estudiantes"
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      {canManage ? (
        <StudentFormModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          levels={levels}
          grades={grades}
          sections={sections}
        />
      ) : null}
    </>
  );
}

function translateStudentStatus(status: StudentStatus) {
  if (status === 'active') return 'Activo';
  if (status === 'inactive') return 'Inactivo';
  return 'Retirado';
}

function translateShift(shift: StudentRecord['shift']) {
  if (shift === 'matutina') return 'Jornada matutina';
  if (shift === 'vespertina') return 'Jornada vespertina';
  return 'Jornada por definir';
}
