'use client';

import { useState } from 'react';
import { CalendarDays, Pencil } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
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
  const [editingEnrollment, setEditingEnrollment] = useState<EnrollmentRecord | null>(null);
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
        <WorkspacePrelude
          eyebrow="Inscripción académica"
          title="Estado real de matrículas del periodo"
          description="La composición prioriza cobertura real, estudiantes afectados y novedades administrativas con una lectura más ordenada para secretaría y coordinación."
          actions={
            <>
              <ActionButton label="Matrícula" icon={CalendarDays} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
              <span className="info-chip">{snapshot?.institution.activeSchoolYearLabel ?? 'Periodo activo'}</span>
            </>
          }
          metrics={[
            { label: 'Matrículas', value: snapshot?.summary.enrollments ?? 0, helper: 'Periodo actual' },
            { label: 'Activas', value: snapshot?.summary.activeEnrollments ?? 0, helper: 'Inscripciones vigentes' },
            { label: 'Estudiantes cubiertos', value: snapshot?.summary.uniqueStudents ?? 0, helper: 'Cobertura de alumnos' },
            { label: 'Con novedad', value: inactiveEnrollments, helper: 'Retiros o anulaciones' },
          ]}
          sideLabel="Cobertura del periodo"
          sideTitle="Seguimiento visible de matrículas y secciones ocupadas"
          sideDescription="La vista mantiene la lógica del periodo activo y mejora la lectura de capacidad operativa por estudiantes, secciones y estado administrativo."
          sideContent={<DetailList items={[{ label: 'Secciones en uso', value: snapshot?.summary.sectionsInUse ?? 0 }, { label: 'Estudiantes visibles', value: students.length }]} />}
        />

        <DataSection
          eyebrow="Matrículas registradas"
          title="Inscripciones del periodo escolar activo"
          subtitle="Tabla compacta para revisar estudiante, sección, trazabilidad académica y estado administrativo en una sola lectura."
          actions={
            <>
              <span className="info-chip">{enrollments.length} matrículas</span>
              <ActionButton label="Nueva" icon={CalendarDays} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </>
          }
        >

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
                      <th>Acciones</th>
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
                        <td>
                          <div className="table-actions">
                            <ActionButton label="Editar" icon={Pencil} onClick={() => setEditingEnrollment(enrollment)} />
                          </div>
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
        </DataSection>
      </div>

      <EnrollmentFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        activeSchoolYearLabel={snapshot?.institution.activeSchoolYearLabel ?? 'Periodo activo'}
        students={students}
        enrollments={enrollments}
        levels={levels}
        grades={grades}
        sections={sections}
      />
      <EnrollmentFormModal
        open={editingEnrollment !== null}
        mode="edit"
        initialValues={editingEnrollment ?? undefined}
        onClose={() => setEditingEnrollment(null)}
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
