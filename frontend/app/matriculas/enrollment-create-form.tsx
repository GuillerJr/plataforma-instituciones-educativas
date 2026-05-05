'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import { getAccessToken } from '../lib/client-auth';
import type { EnrollmentAcademicGrade, EnrollmentAcademicLevel, EnrollmentAcademicSection, EnrollmentRecord, EnrollmentStatus, EnrollmentStudent } from './page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

type FormState = {
  success: boolean;
  message: string | null;
};

type EnrollmentFormModalProps = {
  open: boolean;
  onClose: () => void;
  activeSchoolYearLabel: string;
  students: EnrollmentStudent[];
  enrollments: EnrollmentRecord[];
  levels: EnrollmentAcademicLevel[];
  grades: EnrollmentAcademicGrade[];
  sections: EnrollmentAcademicSection[];
};

export function EnrollmentFormModal({ open, onClose, activeSchoolYearLabel, students, enrollments, levels, grades, sections }: EnrollmentFormModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '');
  const [selectedGradeId, setSelectedGradeId] = useState('');

  const enrolledStudentsForActiveYear = new Set(
    enrollments
      .filter((enrollment) => enrollment.schoolYearLabel === activeSchoolYearLabel)
      .map((enrollment) => enrollment.studentId),
  );

  const availableStudents = students.filter((student) => !enrolledStudentsForActiveYear.has(student.id));
  const visibleGrades = grades.filter((grade) => grade.levelId === selectedLevelId);
  const visibleSections = sections.filter((section) => section.gradeId === selectedGradeId);

  useEffect(() => {
    if (!open) return;

    const defaultLevelId = levels[0]?.id ?? '';
    const defaultGradeId = grades.find((grade) => grade.levelId === defaultLevelId)?.id ?? '';

    setPending(false);
    setState({ success: false, message: null });
    setSelectedLevelId(defaultLevelId);
    setSelectedGradeId(defaultGradeId);
  }, [open, levels, grades]);

  useEffect(() => {
    if (!selectedLevelId) {
      setSelectedGradeId('');
      return;
    }

    if (!visibleGrades.some((grade) => grade.id === selectedGradeId)) {
      setSelectedGradeId(visibleGrades[0]?.id ?? '');
    }
  }, [selectedGradeId, selectedLevelId, visibleGrades]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const payload = {
      studentId: String(formData.get('studentId') ?? '').trim(),
      sectionId: String(formData.get('sectionId') ?? '').trim(),
      enrollmentDate: String(formData.get('enrollmentDate') ?? '').trim(),
      status: String(formData.get('status') ?? '').trim() as EnrollmentStatus,
      notes: String(formData.get('notes') ?? '').trim(),
    };

    if (!payload.studentId || !payload.sectionId || !payload.enrollmentDate || !payload.status) {
      setState({ success: false, message: 'Estudiante, sección, fecha y estado son obligatorios.' });
      setPending(false);
      return;
    }

    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`${API_BASE_URL}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? 'No fue posible crear la matrícula.');
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear la matrícula.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Registrar matrícula"
      description="Registra la inscripción del periodo activo enlazando un estudiante existente con una sección real de la estructura académica."
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Estudiante</span>
            <select name="studentId" className="form-field">
              {availableStudents.length === 0 ? <option value="">Todos los estudiantes ya tienen matrícula en el periodo activo</option> : null}
              {availableStudents.map((student) => (
                <option key={student.id} value={student.id}>{student.fullName} · {student.enrollmentCode} · {student.gradeName} {student.sectionName}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Periodo escolar</span>
            <input disabled value={activeSchoolYearLabel} className="form-field cursor-not-allowed opacity-60" />
          </label>
          <label className="block">
            <span className="field-label">Fecha de matrícula</span>
            <input name="enrollmentDate" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="form-field" />
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Estado</span>
            <select name="status" defaultValue="active" className="form-field">
              <option value="active">Activa</option>
              <option value="withdrawn">Retirada</option>
              <option value="cancelled">Anulada</option>
            </select>
          </label>
        </div>

        <div className="form-cluster">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="field-label">Sección de destino</p>
              <p className="mt-2 text-sm text-slate-500">La matrícula exige estudiante + sección; curso y nivel se derivan automáticamente desde la estructura activa.</p>
            </div>
            <span className="info-chip">Derivación automática</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="field-label">Nivel</span>
              <select name="levelId" value={selectedLevelId} onChange={(event) => setSelectedLevelId(event.target.value)} className="form-field">
                {levels.length === 0 ? <option value="">Primero registre la estructura académica</option> : null}
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="field-label">Curso o grado</span>
              <select name="gradeId" value={selectedGradeId} onChange={(event) => setSelectedGradeId(event.target.value)} className="form-field">
                {visibleGrades.length === 0 ? <option value="">No hay cursos para este nivel</option> : null}
                {visibleGrades.map((grade) => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="field-label">Sección</span>
              <select name="sectionId" className="form-field">
                {visibleSections.length === 0 ? <option value="">No hay secciones para el curso seleccionado</option> : null}
                {visibleSections.map((section) => (
                  <option key={section.id} value={section.id}>{section.gradeName} · {section.name} · {translateShift(section.shift)}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <label className="block">
          <span className="field-label">Observación</span>
          <textarea name="notes" maxLength={500} rows={4} className="form-field min-h-[108px] resize-y" placeholder="Detalle administrativo o novedad de inscripción" />
        </label>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button
            type="submit"
            disabled={pending || availableStudents.length === 0 || levels.length === 0 || visibleGrades.length === 0 || visibleSections.length === 0}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Creando matrícula...' : 'Crear matrícula'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function translateShift(shift: EnrollmentAcademicSection['shift']) {
  if (shift === 'matutina') return 'Matutina';
  if (shift === 'vespertina') return 'Vespertina';
  return 'Por definir';
}
