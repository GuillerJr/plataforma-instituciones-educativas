'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import { getDemoAccessToken } from '../lib/demo-api';
import type { AttendanceAcademicGrade, AttendanceAcademicLevel, AttendanceAcademicSection, AttendanceEnrollmentOption, AttendanceRecord, AttendanceStatus } from './page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

type FormState = {
  success: boolean;
  message: string | null;
};

type AttendanceDraftEntry = {
  enrollmentId: string;
  status: AttendanceStatus;
  notes: string;
};

type AttendanceFormModalProps = {
  open: boolean;
  onClose: () => void;
  activeSchoolYearLabel: string;
  records: AttendanceRecord[];
  levels: AttendanceAcademicLevel[];
  grades: AttendanceAcademicGrade[];
  sections: AttendanceAcademicSection[];
  enrollments: AttendanceEnrollmentOption[];
};

export function AttendanceFormModal({ open, onClose, activeSchoolYearLabel, records, levels, grades, sections, enrollments }: AttendanceFormModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [entries, setEntries] = useState<AttendanceDraftEntry[]>([]);

  const visibleGrades = useMemo(
    () => grades.filter((grade) => grade.levelId === selectedLevelId),
    [grades, selectedLevelId],
  );

  const visibleSections = useMemo(
    () => sections.filter((section) => section.gradeId === selectedGradeId),
    [sections, selectedGradeId],
  );

  const roster = useMemo(
    () => enrollments.filter((enrollment) => enrollment.sectionId === selectedSectionId && enrollment.schoolYearLabel === activeSchoolYearLabel),
    [activeSchoolYearLabel, enrollments, selectedSectionId],
  );

  useEffect(() => {
    if (!open) return;

    const defaultLevelId = levels[0]?.id ?? '';
    const defaultGradeId = grades.find((grade) => grade.levelId === defaultLevelId)?.id ?? '';
    const defaultSectionId = sections.find((section) => section.gradeId === defaultGradeId && section.activeEnrollments > 0)?.id
      ?? sections.find((section) => section.gradeId === defaultGradeId)?.id
      ?? '';

    setPending(false);
    setState({ success: false, message: null });
    setAttendanceDate(new Date().toISOString().slice(0, 10));
    setSelectedLevelId(defaultLevelId);
    setSelectedGradeId(defaultGradeId);
    setSelectedSectionId(defaultSectionId);
  }, [open, levels, grades, sections]);

  useEffect(() => {
    if (!selectedLevelId) {
      setSelectedGradeId('');
      return;
    }

    if (!visibleGrades.some((grade) => grade.id === selectedGradeId)) {
      setSelectedGradeId(visibleGrades[0]?.id ?? '');
    }
  }, [selectedGradeId, selectedLevelId, visibleGrades]);

  useEffect(() => {
    if (!selectedGradeId) {
      setSelectedSectionId('');
      return;
    }

    if (!visibleSections.some((section) => section.id === selectedSectionId)) {
      const preferredSection = visibleSections.find((section) => section.activeEnrollments > 0) ?? visibleSections[0];
      setSelectedSectionId(preferredSection?.id ?? '');
    }
  }, [selectedGradeId, selectedSectionId, visibleSections]);

  useEffect(() => {
    if (!open) return;

    const nextEntries = roster.map((enrollment) => {
      const existingRecord = records.find((record) => record.enrollmentId === enrollment.enrollmentId && record.attendanceDate === attendanceDate);

      return {
        enrollmentId: enrollment.enrollmentId,
        status: existingRecord?.status ?? 'present',
        notes: existingRecord?.notes ?? '',
      } satisfies AttendanceDraftEntry;
    });

    setEntries(nextEntries);
  }, [attendanceDate, open, records, roster]);

  const selectedSection = sections.find((section) => section.id === selectedSectionId);
  const existingRecordsCount = roster.filter((enrollment) => records.some((record) => record.enrollmentId === enrollment.enrollmentId && record.attendanceDate === attendanceDate)).length;

  function updateEntry(enrollmentId: string, patch: Partial<AttendanceDraftEntry>) {
    setEntries((current) => current.map((entry) => (entry.enrollmentId === enrollmentId ? { ...entry, ...patch } : entry)));
  }

  async function handleSubmit() {
    setPending(true);
    setState({ success: false, message: null });

    if (!selectedSectionId || !attendanceDate || entries.length === 0) {
      setState({ success: false, message: 'Sección, fecha y estudiantes matriculados son obligatorios.' });
      setPending(false);
      return;
    }

    try {
      const accessToken = await getDemoAccessToken();
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          sectionId: selectedSectionId,
          attendanceDate,
          entries,
        }),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? 'No fue posible registrar la asistencia.');
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible registrar la asistencia.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Registrar asistencia"
      description="Selecciona una sección real y marca la asistencia diaria de estudiantes con matrícula activa en el periodo escolar vigente."
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="block">
            <span className="field-label">Nivel</span>
            <select value={selectedLevelId} onChange={(event) => setSelectedLevelId(event.target.value)} className="form-field">
              {levels.length === 0 ? <option value="">Primero registre estructura académica</option> : null}
              {levels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">Curso o grado</span>
            <select value={selectedGradeId} onChange={(event) => setSelectedGradeId(event.target.value)} className="form-field">
              {visibleGrades.length === 0 ? <option value="">No hay cursos para este nivel</option> : null}
              {visibleGrades.map((grade) => (
                <option key={grade.id} value={grade.id}>{grade.name}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">Sección</span>
            <select value={selectedSectionId} onChange={(event) => setSelectedSectionId(event.target.value)} className="form-field">
              {visibleSections.length === 0 ? <option value="">No hay secciones para este curso</option> : null}
              {visibleSections.map((section) => (
                <option key={section.id} value={section.id}>{section.gradeName} · {section.name} · {translateShift(section.shift)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">Fecha</span>
            <input type="date" value={attendanceDate} onChange={(event) => setAttendanceDate(event.target.value)} className="form-field" />
          </label>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="field-label">Cobertura del registro</p>
              <p className="mt-2 text-sm text-slate-500">La carga toma únicamente matrículas activas de la sección seleccionada. Si la fecha ya existe, los valores se reutilizan para editar el día.</p>
            </div>
            <span className="info-chip">{activeSchoolYearLabel}</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="surface-muted p-4 text-sm text-slate-600">
              Sección activa: <span className="font-semibold text-slate-950">{selectedSection ? `${selectedSection.gradeName} · ${selectedSection.name}` : 'Sin selección'}</span>
            </div>
            <div className="surface-muted p-4 text-sm text-slate-600">
              Matrículas activas: <span className="font-semibold text-slate-950">{roster.length}</span>
            </div>
            <div className="surface-muted p-4 text-sm text-slate-600">
              Registros previos en la fecha: <span className="font-semibold text-slate-950">{existingRecordsCount}</span>
            </div>
          </div>
        </div>

        {roster.length === 0 ? (
          <div className="surface-muted px-4 py-4 text-sm text-slate-600">
            La sección seleccionada no tiene matrículas activas para el periodo vigente.
          </div>
        ) : (
          <div className="table-shell overflow-hidden">
            <div className="table-toolbar soft-divider">
              <div>
                <p className="eyebrow">Lista diaria</p>
                <h3 className="table-title">Estudiantes matriculados para marcar asistencia</h3>
                <p className="table-subtitle">Se carga un registro por estudiante matriculado en la sección seleccionada.</p>
              </div>
              <span className="info-chip">{roster.length} estudiantes</span>
            </div>
            <div className="table-scroller">
              <table className="data-table min-w-[1080px]">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Estado</th>
                    <th>Observación</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map((enrollment) => {
                    const entry = entries.find((item) => item.enrollmentId === enrollment.enrollmentId);

                    return (
                      <tr key={enrollment.enrollmentId}>
                        <td>
                          <p className="font-semibold text-slate-950">{enrollment.studentName}</p>
                          <p className="mt-1 text-sm text-slate-500">{enrollment.studentEnrollmentCode} · {enrollment.studentDocument}</p>
                        </td>
                        <td>
                          <select
                            value={entry?.status ?? 'present'}
                            onChange={(event) => updateEntry(enrollment.enrollmentId, { status: event.target.value as AttendanceStatus })}
                            className="form-field min-w-[180px]"
                          >
                            <option value="present">Presente</option>
                            <option value="absent">Ausente</option>
                            <option value="late">Atraso</option>
                            <option value="justified">Justificada</option>
                          </select>
                        </td>
                        <td>
                          <input
                            value={entry?.notes ?? ''}
                            onChange={(event) => updateEntry(enrollment.enrollmentId, { notes: event.target.value })}
                            maxLength={500}
                            className="form-field"
                            placeholder="Novedad breve del día"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending || roster.length === 0 || entries.length === 0}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Registrando asistencia...' : 'Guardar asistencia del día'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function translateShift(shift: AttendanceAcademicSection['shift']) {
  if (shift === 'matutina') return 'Matutina';
  if (shift === 'vespertina') return 'Vespertina';
  return 'Por definir';
}
