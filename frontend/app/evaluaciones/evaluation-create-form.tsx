'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import type { EvaluationAssignmentOption, EvaluationRecord, EvaluationType } from './page';

type FormState = {
  success: boolean;
  message: string | null;
};

const evaluationTypeOptions: Array<{ value: EvaluationType; label: string }> = [
  { value: 'diagnostica', label: 'Diagnóstica' },
  { value: 'tarea', label: 'Tarea' },
  { value: 'taller', label: 'Taller' },
  { value: 'prueba', label: 'Prueba' },
  { value: 'proyecto', label: 'Proyecto' },
  { value: 'examen', label: 'Examen' },
  { value: 'quimestre', label: 'Quimestre' },
];

export function EvaluationFormModal({
  open,
  mode,
  onClose,
  assignments,
  initialValues,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  assignments: EvaluationAssignmentOption[];
  initialValues?: EvaluationRecord;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const activeAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.id === initialValues?.academicAssignmentId || (assignment.teacherStatus === 'active' && assignment.subjectStatus === 'active')),
    [assignments, initialValues?.academicAssignmentId],
  );
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(activeAssignments[0]?.id ?? '');

  const selectedAssignment = useMemo(
    () => activeAssignments.find((assignment) => assignment.id === selectedAssignmentId) ?? activeAssignments[0],
    [activeAssignments, selectedAssignmentId],
  );

  useEffect(() => {
    if (!open) return;

    setPending(false);
    setState({ success: false, message: null });
    setSelectedAssignmentId(initialValues?.academicAssignmentId ?? activeAssignments[0]?.id ?? '');
  }, [open, activeAssignments, initialValues]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const rawWeightPercentage = String(formData.get('weightPercentage') ?? '').trim();
    const payload = {
      academicAssignmentId: String(formData.get('academicAssignmentId') ?? '').trim(),
      title: String(formData.get('title') ?? '').trim(),
      evaluationType: String(formData.get('evaluationType') ?? '').trim(),
      periodLabel: String(formData.get('periodLabel') ?? '').trim(),
      dueDate: String(formData.get('dueDate') ?? '').trim(),
      maxScore: Number(String(formData.get('maxScore') ?? '').trim()),
      weightPercentage: rawWeightPercentage ? Number(rawWeightPercentage) : null,
      description: String(formData.get('description') ?? '').trim(),
    };

    if (!payload.academicAssignmentId || !payload.title || !payload.evaluationType || !payload.periodLabel || !payload.maxScore) {
      setState({ success: false, message: 'Asignación, título, tipo, periodo y puntaje máximo son obligatorios.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar la evaluación a actualizar.' });
      setPending(false);
      return;
    }

    try {
      const response = await fetch(mode === 'create' ? '/api/backend/evaluations' : `/api/backend/evaluations/${initialValues?.id}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? (mode === 'create' ? 'No fue posible crear la evaluación.' : 'No fue posible actualizar la evaluación.'));
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar la evaluación.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar evaluación' : 'Editar evaluación'}
      description={mode === 'create'
        ? 'Crea una evaluación directamente sobre una asignación académica ya existente para mantener coherencia con materia, docente y cobertura real.'
        : 'Actualiza asignación, título, periodo, puntaje y descripción del instrumento evaluativo.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="field-label">Asignación académica</span>
          <select name="academicAssignmentId" value={selectedAssignmentId} onChange={(event) => setSelectedAssignmentId(event.target.value)} className="form-field">
            {activeAssignments.length === 0 ? <option value="">Primero registre asignaciones activas</option> : null}
            {activeAssignments.map((assignment) => (
              <option key={assignment.id} value={assignment.id}>{assignment.subjectName} · {assignment.teacherName} · {assignment.gradeName}{assignment.sectionName ? ` · ${assignment.sectionName}` : ''}</option>
            ))}
          </select>
        </label>

        <div className="form-cluster">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="field-label">Cobertura enlazada</p>
              <p className="mt-2 text-sm text-slate-500">La evaluación hereda materia, docente y alcance académico desde la asignación seleccionada.</p>
            </div>
            <span className="info-chip">Institución única</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="field-label">Título de la evaluación</span>
              <input name="title" defaultValue={initialValues?.title ?? ''} className="form-field" placeholder="Prueba parcial de Matemática" />
            </label>
            <label className="block">
              <span className="field-label">Tipo</span>
              <select name="evaluationType" defaultValue={initialValues?.evaluationType ?? evaluationTypeOptions[0]?.value} className="form-field">
                {evaluationTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="field-label">Periodo</span>
              <input name="periodLabel" className="form-field" placeholder="Primer quimestre" defaultValue={initialValues?.periodLabel ?? 'Primer quimestre'} />
            </label>
            <label className="block">
              <span className="field-label">Fecha programada</span>
              <input name="dueDate" type="date" defaultValue={initialValues?.dueDate?.slice(0, 10) ?? ''} className="form-field" />
            </label>
            <label className="block">
              <span className="field-label">Puntaje máximo</span>
              <input name="maxScore" type="number" min={1} max={100} step="0.01" className="form-field" placeholder="10" defaultValue={initialValues?.maxScore ?? 10} />
            </label>
            <label className="block">
              <span className="field-label">Peso porcentual</span>
              <input name="weightPercentage" type="number" min={0} max={100} step="0.01" defaultValue={initialValues?.weightPercentage ?? ''} className="form-field" placeholder="20" />
            </label>
            <label className="block">
              <span className="field-label">Referencia</span>
              <input
                disabled
                value={selectedAssignment ? `${selectedAssignment.levelName} · ${selectedAssignment.gradeName}${selectedAssignment.sectionName ? ` · ${selectedAssignment.sectionName}` : ''}` : 'Seleccione una asignación'}
                className="form-field cursor-not-allowed opacity-60"
              />
            </label>
            <label className="block md:col-span-2">
              <span className="field-label">Descripción</span>
              <textarea name="description" rows={3} maxLength={600} defaultValue={initialValues?.description ?? ''} className="form-field min-h-[104px]" placeholder="Contexto, objetivo o criterio visible para coordinación académica" />
            </label>
          </div>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending || activeAssignments.length === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? (mode === 'create' ? 'Creando evaluación...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear evaluación' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
