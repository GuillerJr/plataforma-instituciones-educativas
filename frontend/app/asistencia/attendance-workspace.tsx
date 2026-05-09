'use client';

import { useEffect, useMemo, useState } from 'react';
import { ClipboardCheck, Pencil } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
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
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
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
    () => Array.from(new Set(records.map((record) => normalizeDateValue(record.attendanceDate)))),
    [records],
  );

  const filteredRecords = useMemo(
    () => records.filter((record) => {
      if (selectedSectionId !== 'all' && record.sectionId !== selectedSectionId) return false;
      if (selectedDate !== 'all' && normalizeDateValue(record.attendanceDate) !== selectedDate) return false;
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
        <WorkspacePrelude
          eyebrow="Control diario"
          title="Estado real de asistencia del periodo"
          description="La vista mantiene el seguimiento real por fecha y sección, pero con una lectura operativa más clara para coordinación y tutoría."
          actions={
            <>
              <ActionButton label="Asistencia" icon={ClipboardCheck} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
              <span className="info-chip">{snapshot?.institution.activeSchoolYearLabel ?? 'Periodo activo'}</span>
            </>
          }
          metrics={[
            { label: 'Presentes', value: snapshot?.summary.present ?? 0, helper: 'Registros confirmados' },
            { label: 'Ausentes', value: snapshot?.summary.absent ?? 0, helper: 'Seguimiento diario' },
            { label: 'Atrasos', value: snapshot?.summary.late ?? 0, helper: 'Llegadas tarde' },
            { label: 'Justificadas', value: snapshot?.summary.justified ?? 0, helper: 'Con soporte' },
          ]}
          sideLabel="Lectura operativa"
          sideTitle="Visibilidad rápida del comportamiento diario"
          sideDescription="La cobertura sigue calculada con registros reales por secciones, fechas y matrículas activas del periodo escolar."
          sideContent={<DetailList items={[{ label: 'Secciones cubiertas', value: snapshot?.summary.sectionsCovered ?? 0 }, { label: 'Fechas registradas', value: snapshot?.summary.trackedDates ?? 0 }, { label: 'Presentes', value: `${presentShare}% del total` }]} />}
        />

        <DataSection
          eyebrow="Asistencia registrada"
          title="Historial diario por estudiante, sección y fecha"
          subtitle="Consulta compacta para revisar estado, ubicación académica y observaciones de asistencia sobre matrículas reales."
          actions={
            <>
              <span className="info-chip">{filteredRecords.length} registros</span>
              <ActionButton label="Cargar" icon={ClipboardCheck} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </>
          }
        >

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
                      <th>Acciones</th>
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
                          <p className="whitespace-nowrap font-medium text-slate-950">{formatDate(record.attendanceDate)}</p>
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
                        <td>
                          <div className="table-actions">
                            <ActionButton label="Editar" icon={Pencil} onClick={() => setEditingRecord(record)} />
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
                totalItems={filteredRecords.length}
                itemLabel="registros"
                onPageChange={setPage}
              />
            </>
          )}
        </DataSection>
      </div>

      <AttendanceFormModal
        open={createOpen || editingRecord !== null}
        onClose={() => {
          setCreateOpen(false);
          setEditingRecord(null);
        }}
        initialRecord={editingRecord}
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
  const [year, month, day] = normalizeDateValue(value).split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function normalizeDateValue(value: string) {
  return value.split('T')[0] ?? value;
}
