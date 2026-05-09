'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import type {
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
}: {
  open: boolean;
  onClose: () => void;
  teachers: AssignmentTeacherOption[];
  subjects: AssignmentSubjectOption[];
  levels: AssignmentLevelOption[];
  grades: AssignmentGradeOption[];
  sections: AssignmentSectionOption[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '');
  const [selectedGradeId, setSelectedGradeId] = useState('');

  const visibleGrades = useMemo(() => grades.filter((grade) => grade.levelId === selectedLevelId), [grades, selectedLevelId]);
  const visibleSections = useMemo(() => sections.filter((section) => section.gradeId === selectedGradeId), [sections, selectedGradeId]);
  const visibleSubjects = useMemo(
    () => subjects.filter((subject) => subject.status === 'active' && (!subject.levelId || subject.levelId === selectedLevelId)),
    [selectedLevelId, subjects],
  );
  const activeTeachers = useMemo(() => teachers.filter((teacher) => teacher.status === 'active'), [teachers]);

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

    const nextGrade = grades.find((grade) => grade.levelId === selectedLevelId);

    if (!visibleGrades.some((grade) => grade.id === selectedGradeId)) {
      setSelectedGradeId(nextGrade?.id ?? '');
    }
  }, [grades, selectedGradeId, selectedLevelId, visibleGrades]);

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

    try {
      const response = await fetch('/api/backend/academic-assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? 'No fue posible crear la asignación académica.');
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear la asignación académica.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Registrar asignación académica"
      description="Conecta docente, materia y estructura académica en un solo flujo validado para la institución activa."
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Docente</span>
            <select name="teacherId" defaultValue={activeTeachers[0]?.id ?? ''} className="form-field">
              {activeTeachers.length === 0 ? <option value="">Primero registre docentes activos</option> : null}
              {activeTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Materia</span>
            <select name="subjectId" defaultValue={visibleSubjects[0]?.id ?? ''} className="form-field">
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
              <select name="sectionId" defaultValue="" className="form-field">
                <option value="">Aplicar al curso o grado completo</option>
                {visibleSections.map((section) => (
                  <option key={section.id} value={section.id}>{section.gradeName} · {section.name} · {translateShift(section.shift)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Horas semanales</span>
              <input name="weeklyHours" type="number" min={1} max={60} className="form-field" placeholder="6" />
            </label>
            <label className="block">
              <span className="field-label">Referencia rápida</span>
              <input disabled value={selectedLevelId ? 'Institución única validada' : 'Seleccione nivel'} className="form-field cursor-not-allowed opacity-60" />
            </label>
            <label className="block md:col-span-2">
              <span className="field-label">Notas</span>
              <textarea name="notes" rows={3} maxLength={500} className="form-field min-h-[104px]" placeholder="Observaciones útiles para coordinación académica" />
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
            {pending ? 'Creando asignación...' : 'Crear asignación'}
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
