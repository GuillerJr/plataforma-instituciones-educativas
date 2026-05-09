'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import type {
  AcademicAssignmentRecord,
  AssignmentGradeOption,
  AssignmentLevelOption,
  AssignmentSectionOption,
  AssignmentSubjectOption,
  AssignmentTeacherOption,
} from './page';

type FormState = {
  success: boolean;
  message: string | null;
};

export function AcademicAssignmentFormModal({
  open,
  onClose,
  teachers,
  subjects,
  levels,
  grades,
  sections,
  mode,
  initialValues,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  teachers: AssignmentTeacherOption[];
  subjects: AssignmentSubjectOption[];
  levels: AssignmentLevelOption[];
  grades: AssignmentGradeOption[];
  sections: AssignmentSectionOption[];
  initialValues?: AcademicAssignmentRecord;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');

  const visibleGrades = useMemo(() => grades.filter((grade) => grade.levelId === selectedLevelId), [grades, selectedLevelId]);
  const visibleSections = useMemo(() => sections.filter((section) => section.gradeId === selectedGradeId), [sections, selectedGradeId]);
  const visibleSubjects = useMemo(
    () => subjects.filter((subject) => (subject.status === 'active' || subject.id === initialValues?.subjectId) && (!subject.levelId || subject.levelId === selectedLevelId)),
    [initialValues?.subjectId, selectedLevelId, subjects],
  );
  const activeTeachers = useMemo(() => teachers.filter((teacher) => teacher.status === 'active' || teacher.id === initialValues?.teacherId), [initialValues?.teacherId, teachers]);

  useEffect(() => {
    if (!open) return;

    const defaultLevelId = initialValues?.levelId ?? levels[0]?.id ?? '';
    const defaultGradeId = initialValues?.gradeId ?? grades.find((grade) => grade.levelId === defaultLevelId)?.id ?? '';

    setPending(false);
    setState({ success: false, message: null });
    setSelectedLevelId(defaultLevelId);
    setSelectedGradeId(defaultGradeId);
    setSelectedSectionId(initialValues?.sectionId ?? '');
  }, [open, levels, grades, initialValues]);

  useEffect(() => {
    if (!selectedLevelId) {
      setSelectedGradeId('');
      return;
    }

    const nextGrade = grades.find((grade) => grade.levelId === selectedLevelId);

    if (!visibleGrades.some((grade) => grade.id === selectedGradeId)) {
      setSelectedGradeId(nextGrade?.id ?? '');
    }
  }, [grades, selectedGradeId, selectedLevelId, visibleGrades]);

  useEffect(() => {
    if (!selectedGradeId) {
      setSelectedSectionId('');
      return;
    }

    if (selectedSectionId && !visibleSections.some((section) => section.id === selectedSectionId)) {
      setSelectedSectionId('');
    }
  }, [selectedGradeId, selectedSectionId, visibleSections]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const rawWeeklyHours = String(formData.get('weeklyHours') ?? '').trim();
    const payload = {
      teacherId: String(formData.get('teacherId') ?? '').trim(),
      subjectId: String(formData.get('subjectId') ?? '').trim(),
      levelId: String(formData.get('levelId') ?? '').trim(),
      gradeId: String(formData.get('gradeId') ?? '').trim(),
      sectionId: String(formData.get('sectionId') ?? '').trim(),
      weeklyHours: rawWeeklyHours ? Number(rawWeeklyHours) : null,
      notes: String(formData.get('notes') ?? '').trim(),
    };

    if (!payload.teacherId || !payload.subjectId || !payload.levelId || !payload.gradeId) {
      setState({ success: false, message: 'Docente, materia, nivel y curso o grado son obligatorios.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar la asignación académica a actualizar.' });
      setPending(false);
      return;
    }

    try {
      const response = await fetch(mode === 'create' ? '/api/backend/academic-assignments' : `/api/backend/academic-assignments/${initialValues?.id}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? (mode === 'create' ? 'No fue posible crear la asignación académica.' : 'No fue posible actualizar la asignación académica.'));
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar la asignación académica.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar asignación académica' : 'Editar asignación académica'}
      description={mode === 'create'
        ? 'Conecta docente, materia y estructura académica en un solo flujo validado para la institución activa.'
        : 'Actualiza docente, materia, cobertura, horas y notas de una asignación académica existente.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Docente</span>
            <select name="teacherId" defaultValue={initialValues?.teacherId ?? activeTeachers[0]?.id ?? ''} className="form-field">
              {activeTeachers.length === 0 ? <option value="">Primero registre docentes activos</option> : null}
              {activeTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Materia</span>
            <select name="subjectId" defaultValue={initialValues?.subjectId ?? visibleSubjects[0]?.id ?? ''} className="form-field">
              {visibleSubjects.length === 0 ? <option value="">No hay materias activas para este nivel</option> : null}
              {visibleSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name} · {subject.code}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-cluster">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="field-label">Cobertura académica</p>
              <p className="mt-2 text-sm text-slate-500">La asignación puede aplicarse por curso o quedar cerrada por sección dentro de una sola institución.</p>
            </div>
            <span className="info-chip">Validación jerárquica</span>
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
              <select name="sectionId" value={selectedSectionId} onChange={(event) => setSelectedSectionId(event.target.value)} className="form-field">
                <option value="">Aplicar al curso o grado completo</option>
                {visibleSections.map((section) => (
                  <option key={section.id} value={section.id}>{section.gradeName} · {section.name} · {translateShift(section.shift)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Horas semanales</span>
              <input name="weeklyHours" type="number" min={1} max={60} defaultValue={initialValues?.weeklyHours ?? ''} className="form-field" placeholder="6" />
            </label>
            <label className="block">
              <span className="field-label">Referencia rápida</span>
              <input disabled value={selectedLevelId ? 'Institución única validada' : 'Seleccione nivel'} className="form-field cursor-not-allowed opacity-60" />
            </label>
            <label className="block md:col-span-2">
              <span className="field-label">Notas</span>
              <textarea name="notes" rows={3} maxLength={500} defaultValue={initialValues?.notes ?? ''} className="form-field min-h-[104px]" placeholder="Observaciones útiles para coordinación académica" />
            </label>
          </div>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button
            type="submit"
            disabled={pending || activeTeachers.length === 0 || visibleSubjects.length === 0 || visibleGrades.length === 0}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (mode === 'create' ? 'Creando asignación...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear asignación' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function translateShift(shift: AssignmentSectionOption['shift']) {
  if (shift === 'matutina') return 'Matutina';
  if (shift === 'vespertina') return 'Vespertina';
  return 'Por definir';
}
