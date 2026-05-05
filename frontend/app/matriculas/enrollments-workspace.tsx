'use client';

import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
import { EnrollmentFormModal } from './enrollment-create-form';
import type { EnrollmentAcademicGrade, EnrollmentAcademicLevel, EnrollmentAcademicSection, EnrollmentRecord, EnrollmentStatus, EnrollmentStudent } from './page';

type EnrollmentsWorkspaceProps = {
  snapshot: {
    institution: {
      id: string;
      name: string;
      activeSchoolYearLabel?: string | null;
    };
    summary: {
      enrollments: number;
      activeEnrollments: number;
      uniqueStudents: number;
      sectionsInUse: number;
    };
    enrollments: EnrollmentRecord[];
    students: EnrollmentStudent[];
    academicOptions: {
      levels: EnrollmentAcademicLevel[];
      grades: EnrollmentAcademicGrade[];
      sections: EnrollmentAcademicSection[];
    };
  } | null;
  error: string | null;
};

export function EnrollmentsWorkspace({ snapshot, error }: EnrollmentsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const enrollments = snapshot?.enrollments ?? [];
  const students = snapshot?.students ?? [];
  const levels = snapshot?.academicOptions.levels ?? [];
  const grades = snapshot?.academicOptions.grades ?? [];
  const sections = snapshot?.academicOptions.sections ?? [];
  const totalPages = Math.max(1, Math.ceil(enrollments.length / pageSize));
  const visibleEnrollments = enrollments.slice((page - 1) * pageSize, page * pageSize);
  const inactiveEnrollments = enrollments.filter((enrollment) => enrollment.status !== 'active').length;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="workspace-hero">
            <div className="table-toolbar soft-divider">
              <div>
                <p className="eyebrow">Inscripción académica</p>
                <h2 className="table-title">Estado real de matrículas del periodo</h2>
                <p className="table-subtitle">Se prioriza cobertura real, estudiantes afectados y novedades administrativas.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ActionButton label="Matrícula" icon={CalendarDays} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
                <span className="info-chip">{snapshot?.institution.activeSchoolYearLabel ?? 'Periodo activo'}</span>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile"><p className="summary-label">Matrículas</p><p className="summary-value">{snapshot?.summary.enrollments ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Activas</p><p className="summary-value">{snapshot?.summary.activeEnrollments ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Estudiantes cubiertos</p><p className="summary-value">{snapshot?.summary.uniqueStudents ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Con novedad</p><p className="summary-value">{inactiveEnrollments}</p></div>
            </div>
          </section>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Cobertura del periodo</p>
                <p className="mt-2 text-sm text-slate-500">Seguimiento visible de matrículas, estudiantes cubiertos y secciones ocupadas en la institución activa.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile">
                <p className="summary-label">Matrículas</p>
                <p className="summary-value">{snapshot?.summary.enrollments ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Activas</p>
                <p className="summary-value">{snapshot?.summary.activeEnrollments ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Estudiantes cubiertos</p>
                <p className="summary-value">{snapshot?.summary.uniqueStudents ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Con novedad</p>
                <p className="summary-value">{inactiveEnrollments}</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="table-shell overflow-hidden">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Matrículas registradas</p>
              <h2 className="table-title">Inscripciones del periodo escolar activo</h2>
              <p className="table-subtitle">Tabla compacta para revisar estudiante, sección, trazabilidad académica y estado administrativo en una sola lectura.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{enrollments.length} matrículas</span>
              <ActionButton label="Nueva" icon={CalendarDays} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : enrollments.length === 0 ? (
            <div className="table-empty">Todavía no hay matrículas registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1320px]">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Periodo</th>
                      <th>Ubicación académica</th>
                      <th>Estado</th>
                      <th>Observación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleEnrollments.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{enrollment.studentName}</p>
                          <p className="mt-1 text-sm text-slate-500">{enrollment.studentDocument} · {enrollment.studentEnrollmentCode}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{enrollment.schoolYearLabel}</p>
                          <p className="mt-1 text-sm text-slate-500">{formatDate(enrollment.enrollmentDate)}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{enrollment.gradeName} · {enrollment.sectionName}</p>
                          <p className="mt-1 text-sm text-slate-500">{enrollment.levelName} · {translateShift(enrollment.shift)}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateEnrollmentStatus(enrollment.status)}</span>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{enrollment.notes || 'Sin observación adicional.'}</p>
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
                totalItems={enrollments.length}
                itemLabel="matrículas"
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <EnrollmentFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        activeSchoolYearLabel={snapshot?.institution.activeSchoolYearLabel ?? 'Periodo activo'}
        students={students}
        enrollments={enrollments}
        levels={levels}
        grades={grades}
        sections={sections}
      />
    </>
  );
}

function translateEnrollmentStatus(status: EnrollmentStatus) {
  if (status === 'active') return 'Activa';
  if (status === 'withdrawn') return 'Retirada';
  return 'Anulada';
}

function translateShift(shift: EnrollmentRecord['shift']) {
  if (shift === 'matutina') return 'Jornada matutina';
  if (shift === 'vespertina') return 'Jornada vespertina';
  return 'Jornada por definir';
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}
