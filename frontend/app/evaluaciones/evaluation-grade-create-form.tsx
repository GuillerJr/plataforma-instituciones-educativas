'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import type { EvaluationGradeRecord, GradeEvaluationOption, GradeStudentOption } from './page';

type FormState = {
  success: boolean;
  message: string | null;
};

export function EvaluationGradeFormModal({
  open,
  mode,
  onClose,
  evaluations,
  students,
  initialValues,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  evaluations: GradeEvaluationOption[];
  students: GradeStudentOption[];
  initialValues?: EvaluationGradeRecord;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(initialValues?.evaluationId ?? evaluations[0]?.id ?? '');
  const selectedEvaluation = useMemo(
    () => evaluations.find((evaluation) => evaluation.id === selectedEvaluationId) ?? evaluations[0],
    [evaluations, selectedEvaluationId],
  );

  const eligibleStudents = useMemo(() => {
    if (!selectedEvaluation) return [];

    return students.filter((student) => {
      if (student.schoolYearLabel !== selectedEvaluation.schoolYearLabel) return false;
      if (selectedEvaluation.sectionId) return student.sectionId === selectedEvaluation.sectionId;
      return student.levelId === selectedEvaluation.levelId && student.gradeId === selectedEvaluation.gradeId;
    });
  }, [selectedEvaluation, students]);

  const [selectedStudentId, setSelectedStudentId] = useState('');

  useEffect(() => {
    if (!open) return;

    setPending(false);
    setState({ success: false, message: null });
    setSelectedEvaluationId(initialValues?.evaluationId ?? evaluations[0]?.id ?? '');
    setSelectedStudentId(initialValues?.studentId ?? '');
  }, [open, evaluations, initialValues]);

  useEffect(() => {
    if (!open) return;

    if (!eligibleStudents.some((student) => student.id === selectedStudentId)) {
      setSelectedStudentId(initialValues?.studentId && eligibleStudents.some((student) => student.id === initialValues.studentId) ? initialValues.studentId : eligibleStudents[0]?.id ?? '');
    }
  }, [eligibleStudents, initialValues, open, selectedStudentId]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const payload = {
      evaluationId: String(formData.get('evaluationId') ?? '').trim(),
      studentId: String(formData.get('studentId') ?? '').trim(),
      score: Number(String(formData.get('score') ?? '').trim()),
      gradedAt: String(formData.get('gradedAt') ?? '').trim(),
      feedback: String(formData.get('feedback') ?? '').trim(),
    };

    if (!payload.evaluationId || !payload.studentId || Number.isNaN(payload.score)) {
      setState({ success: false, message: 'Evaluación, estudiante y nota son obligatorios.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar la calificación a actualizar.' });
      setPending(false);
      return;
    }

    try {
      const response = await fetch(mode === 'create' ? '/api/backend/evaluation-grades' : `/api/backend/evaluation-grades/${initialValues?.id}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? (mode === 'create' ? 'No fue posible registrar la calificación.' : 'No fue posible actualizar la calificación.'));
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar la calificación.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar calificación' : 'Editar calificación'}
      description={mode === 'create'
        ? 'Asigna una nota a un estudiante que sí pertenezca a la cobertura y al periodo escolar de la evaluación seleccionada.'
        : 'Actualiza evaluación, estudiante, nota, fecha y retroalimentación con la misma validación de cobertura.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Evaluación</span>
            <select name="evaluationId" value={selectedEvaluationId} onChange={(event) => setSelectedEvaluationId(event.target.value)} className="form-field">
              {evaluations.length === 0 ? <option value="">Primero registre evaluaciones</option> : null}
              {evaluations.map((evaluation) => (
                <option key={evaluation.id} value={evaluation.id}>{evaluation.title} · {evaluation.subjectName} · {evaluation.gradeName}{evaluation.sectionName ? ` · ${evaluation.sectionName}` : ''}</option>
              ))}
            </select>
          </label>

          <label className="block md:col-span-2">
            <span className="field-label">Estudiante elegible</span>
            <select name="studentId" value={selectedStudentId} onChange={(event) => setSelectedStudentId(event.target.value)} className="form-field">
              {eligibleStudents.length === 0 ? <option value="">No hay estudiantes activos para esta evaluación</option> : null}
              {eligibleStudents.map((student) => (
                <option key={student.id} value={student.id}>{student.fullName} · {student.gradeName} · {student.sectionName}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-cluster">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="field-label">Control de registro</p>
              <p className="mt-2 text-sm text-slate-500">Solo se muestran estudiantes activos que encajan con la evaluación seleccionada.</p>
            </div>
            <span className="info-chip">Validación automática</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="field-label">Nota obtenida</span>
              <input name="score" type="number" min={0} max={selectedEvaluation?.maxScore ?? 100} step="0.01" defaultValue={initialValues?.score ?? ''} className="form-field" placeholder="8.5" />
            </label>
            <label className="block">
              <span className="field-label">Fecha de registro</span>
              <input name="gradedAt" type="date" defaultValue={initialValues?.gradedAt?.slice(0, 10) ?? ''} className="form-field" />
            </label>
            <label className="block">
              <span className="field-label">Puntaje máximo</span>
              <input disabled value={selectedEvaluation ? String(selectedEvaluation.maxScore) : 'Seleccione evaluación'} className="form-field cursor-not-allowed opacity-60" />
            </label>
            <label className="block">
              <span className="field-label">Cobertura</span>
              <input
                disabled
                value={selectedEvaluation ? `${selectedEvaluation.gradeName}${selectedEvaluation.sectionName ? ` · ${selectedEvaluation.sectionName}` : ''} · ${selectedEvaluation.schoolYearLabel}` : 'Seleccione evaluación'}
                className="form-field cursor-not-allowed opacity-60"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="field-label">Retroalimentación</span>
              <textarea name="feedback" rows={3} maxLength={600} defaultValue={initialValues?.feedback ?? ''} className="form-field min-h-[104px]" placeholder="Observaciones de avance, refuerzo o desempeño del estudiante" />
            </label>
          </div>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending || evaluations.length === 0 || eligibleStudents.length === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? (mode === 'create' ? 'Registrando calificación...' : 'Guardando cambios...') : (mode === 'create' ? 'Registrar calificación' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
