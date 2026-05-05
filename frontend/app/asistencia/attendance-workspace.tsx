'use client';

import { useEffect, useMemo, useState } from 'react';
import { PaginationControls } from '../../components/pagination-controls';
import { AttendanceFormModal } from './attendance-create-form';
import type { AttendanceAcademicGrade, AttendanceAcademicLevel, AttendanceAcademicSection, AttendanceEnrollmentOption, AttendanceRecord, AttendanceStatus } from './page';

type AttendanceWorkspaceProps = {
  snapshot: {
    institution: {
      id: string;
      name: string;
      activeSchoolYearLabel?: string | null;
    };
    summary: {
      records: number;
      present: number;
      absent: number;
      late: number;
      justified: number;
      studentsCovered: number;
      sectionsCovered: number;
      trackedDates: number;
    };
    records: AttendanceRecord[];
    options: {
      levels: AttendanceAcademicLevel[];
      grades: AttendanceAcademicGrade[];
      sections: AttendanceAcademicSection[];
      enrollments: AttendanceEnrollmentOption[];
    };
  } | null;
  error: string | null;
};

export function AttendanceWorkspace({ snapshot, error }: AttendanceWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedSectionId, setSelectedSectionId] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const pageSize = 8;

  const records = snapshot?.records ?? [];
  const levels = snapshot?.options.levels ?? [];
  const grades = snapshot?.options.grades ?? [];
  const sections = snapshot?.options.sections ?? [];
  const enrollments = snapshot?.options.enrollments ?? [];

  const uniqueDates = useMemo(
    () => Array.from(new Set(records.map((record) => record.attendanceDate))),
    [records],
  );

  const filteredRecords = useMemo(
    () => records.filter((record) => {
      if (selectedSectionId !== 'all' && record.sectionId !== selectedSectionId) return false;
      if (selectedDate !== 'all' && record.attendanceDate !== selectedDate) return false;
      return true;
    }),
    [records, selectedDate, selectedSectionId],
  );

  useEffect(() => {
    setPage(1);
  }, [selectedDate, selectedSectionId]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const visibleRecords = filteredRecords.slice((page - 1) * pageSize, page * pageSize);
  const presentShare = snapshot?.summary.records ? Math.round((snapshot.summary.present / snapshot.summary.records) * 100) : 0;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
          <section className="workspace-hero">
            <div className="table-toolbar soft-divider">
              <div>
                <p className="eyebrow">Control diario</p>
                <h2 className="table-title">Estado real de asistencia del periodo</h2>
                <p className="table-subtitle">Información útil para coordinación y tutoría, con foco en volumen, cobertura y seguimiento real.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                  Registrar asistencia
                </button>
                <span className="info-chip">{snapshot?.institution.activeSchoolYearLabel ?? 'Periodo activo'}</span>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile"><p className="summary-label">Presentes</p><p className="summary-value">{snapshot?.summary.present ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Ausentes</p><p className="summary-value">{snapshot?.summary.absent ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Atrasos</p><p className="summary-value">{snapshot?.summary.late ?? 0}</p></div>
              <div className="metric-tile"><p className="summary-label">Justificadas</p><p className="summary-value">{snapshot?.summary.justified ?? 0}</p></div>
            </div>
          </section>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Lectura operativa</p>
                <p className="mt-2 text-sm text-slate-500">Visibilidad rápida del comportamiento diario de asistencia dentro de la institución activa.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="metric-tile">
                <p className="summary-label">Presentes</p>
                <p className="summary-value">{snapshot?.summary.present ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Ausentes</p>
                <p className="summary-value">{snapshot?.summary.absent ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Atrasos</p>
                <p className="summary-value">{snapshot?.summary.late ?? 0}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Justificadas</p>
                <p className="summary-value">{snapshot?.summary.justified ?? 0}</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
              Cobertura actual: {snapshot?.summary.sectionsCovered ?? 0} secciones, {snapshot?.summary.trackedDates ?? 0} fechas, {snapshot?.summary.studentsCovered ?? 0} estudiantes seguidos y {presentShare}% de registros marcados como presentes.
            </div>
          </aside>
        </div>

        <section className="table-shell overflow-hidden">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Asistencia registrada</p>
              <h2 className="table-title">Historial diario por estudiante, sección y fecha</h2>
              <p className="table-subtitle">Consulta compacta para revisar estado, ubicación académica y observaciones de asistencia sobre matrículas reales.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{filteredRecords.length} registros</span>
              <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                Cargar día
              </button>
            </div>
          </div>

          <div className="soft-divider grid gap-3 px-5 py-4 md:grid-cols-2 xl:grid-cols-3">
            <label className="block">
              <span className="field-label">Filtrar por sección</span>
              <select value={selectedSectionId} onChange={(event) => setSelectedSectionId(event.target.value)} className="form-field">
                <option value="all">Todas las secciones</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>{section.gradeName} · {section.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Filtrar por fecha</span>
              <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="form-field">
                <option value="all">Todas las fechas</option>
                {uniqueDates.map((date) => (
                  <option key={date} value={date}>{formatDate(date)}</option>
                ))}
              </select>
            </label>
            <div className="surface-muted flex items-center px-4 py-3 text-sm text-slate-600">
              Secciones con matrículas activas: {sections.filter((section) => section.activeEnrollments > 0).length}
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : filteredRecords.length === 0 ? (
            <div className="table-empty">Todavía no hay registros de asistencia para el filtro seleccionado.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1380px]">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Fecha</th>
                      <th>Ubicación académica</th>
                      <th>Estado</th>
                      <th>Observación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleRecords.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{record.studentName}</p>
                          <p className="mt-1 text-sm text-slate-500">{record.studentDocument} · {record.studentEnrollmentCode}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{formatDate(record.attendanceDate)}</p>
                          <p className="mt-1 text-sm text-slate-500">{record.schoolYearLabel}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{record.gradeName} · {record.sectionName}</p>
                          <p className="mt-1 text-sm text-slate-500">{record.levelName} · {translateShift(record.shift)}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateAttendanceStatus(record.status)}</span>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{record.notes || 'Sin novedad adicional.'}</p>
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
                totalItems={filteredRecords.length}
                itemLabel="registros"
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <AttendanceFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        activeSchoolYearLabel={snapshot?.institution.activeSchoolYearLabel ?? 'Periodo activo'}
        records={records}
        levels={levels}
        grades={grades}
        sections={sections}
        enrollments={enrollments}
      />
    </>
  );
}

function translateAttendanceStatus(status: AttendanceStatus) {
  if (status === 'present') return 'Presente';
  if (status === 'absent') return 'Ausente';
  if (status === 'late') return 'Atraso';
  return 'Justificada';
}

function translateShift(shift: AttendanceRecord['shift']) {
  if (shift === 'matutina') return 'Jornada matutina';
  if (shift === 'vespertina') return 'Jornada vespertina';
  return 'Jornada por definir';
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}
