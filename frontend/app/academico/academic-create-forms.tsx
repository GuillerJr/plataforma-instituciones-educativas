'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import type { AcademicGrade, AcademicLevel, AcademicSection } from './page';

type FormState = {
  success: boolean;
  message: string | null;
};

function useAcademicModalState(open: boolean) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });

  useEffect(() => {
    if (open) {
      setPending(false);
      setState({ success: false, message: null });
    }
  }, [open]);

  return { pending, setPending, state, setState };
}

type AcademicFormMode = 'create' | 'edit';

async function saveAcademicEntity(path: string, method: 'POST' | 'PATCH', payload: unknown) {
  const response = await fetch(`/api/backend${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(responsePayload?.message ?? 'No fue posible guardar el registro académico.');
  }
}

export function LevelFormModal({
  open,
  mode,
  onClose,
  initialValues,
}: {
  open: boolean;
  mode: AcademicFormMode;
  onClose: () => void;
  initialValues?: AcademicLevel;
}) {
  const router = useRouter();
  const { pending, setPending, state, setState } = useAcademicModalState(open);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      code: String(formData.get('code') ?? '').trim(),
      educationalStage: String(formData.get('educationalStage') ?? '').trim(),
      sortOrder: Number(formData.get('sortOrder') ?? 0),
    };

    if (!payload.name || !payload.code || !payload.educationalStage) {
      setState({ success: false, message: 'Nombre, código y etapa educativa son obligatorios.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar el nivel a actualizar.' });
      setPending(false);
      return;
    }

    try {
      await saveAcademicEntity(
        mode === 'create' ? '/academic-structure/levels' : `/academic-structure/levels/${initialValues?.id}`,
        mode === 'create' ? 'POST' : 'PATCH',
        payload,
      );
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar el nivel.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar nivel' : 'Editar nivel'}
      description={mode === 'create'
        ? 'Crea un nivel académico real para la institución actual y ordénalo dentro de la estructura base del colegio.'
        : 'Actualiza nombre, código, etapa educativa y orden del nivel académico seleccionado.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Nombre del nivel</span>
            <input name="name" required minLength={3} maxLength={120} defaultValue={initialValues?.name ?? ''} className="form-field" placeholder="Educación General Básica" />
          </label>
          <label className="block">
            <span className="field-label">Código</span>
            <input name="code" required minLength={2} maxLength={40} defaultValue={initialValues?.code ?? ''} className="form-field" placeholder="EGB" />
          </label>
          <label className="block">
            <span className="field-label">Orden</span>
            <input name="sortOrder" type="number" min={0} max={999} defaultValue={initialValues?.sortOrder ?? 1} className="form-field" />
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Etapa educativa</span>
            <select name="educationalStage" defaultValue={initialValues?.educationalStage ?? 'basica'} className="form-field">
              <option value="inicial">Inicial</option>
              <option value="basica">Básica</option>
              <option value="bachillerato">Bachillerato</option>
            </select>
          </label>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? (mode === 'create' ? 'Creando nivel...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear nivel' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function GradeFormModal({
  open,
  mode,
  onClose,
  levels,
  initialValues,
}: {
  open: boolean;
  mode: AcademicFormMode;
  onClose: () => void;
  levels: AcademicLevel[];
  initialValues?: AcademicGrade;
}) {
  const router = useRouter();
  const { pending, setPending, state, setState } = useAcademicModalState(open);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const payload = {
      levelId: String(formData.get('levelId') ?? '').trim(),
      name: String(formData.get('name') ?? '').trim(),
      code: String(formData.get('code') ?? '').trim(),
      sortOrder: Number(formData.get('sortOrder') ?? 0),
    };

    if (!payload.levelId || !payload.name || !payload.code) {
      setState({ success: false, message: 'Nivel, nombre y código son obligatorios.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar el curso o grado a actualizar.' });
      setPending(false);
      return;
    }

    try {
      await saveAcademicEntity(
        mode === 'create' ? '/academic-structure/grades' : `/academic-structure/grades/${initialValues?.id}`,
        mode === 'create' ? 'POST' : 'PATCH',
        payload,
      );
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar el curso o grado.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar curso o grado' : 'Editar curso o grado'}
      description={mode === 'create'
        ? 'Asocia el registro a un nivel existente para dejar lista la jerarquía académica mínima del colegio.'
        : 'Actualiza el nivel, nombre, código y orden del curso o grado seleccionado.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Nivel</span>
            <select name="levelId" defaultValue={initialValues?.levelId ?? levels[0]?.id ?? ''} className="form-field">
              {levels.length === 0 ? <option value="">Primero registre un nivel</option> : null}
              {levels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Nombre del curso o grado</span>
            <input name="name" required minLength={3} maxLength={120} defaultValue={initialValues?.name ?? ''} className="form-field" placeholder="Primero de BGU" />
          </label>
          <label className="block">
            <span className="field-label">Código</span>
            <input name="code" required minLength={2} maxLength={40} defaultValue={initialValues?.code ?? ''} className="form-field" placeholder="BGU1" />
          </label>
          <label className="block">
            <span className="field-label">Orden</span>
            <input name="sortOrder" type="number" min={0} max={999} defaultValue={initialValues?.sortOrder ?? 1} className="form-field" />
          </label>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending || levels.length === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? (mode === 'create' ? 'Creando registro...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear curso o grado' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function SectionFormModal({
  open,
  mode,
  onClose,
  grades,
  initialValues,
}: {
  open: boolean;
  mode: AcademicFormMode;
  onClose: () => void;
  grades: AcademicGrade[];
  initialValues?: AcademicSection;
}) {
  const router = useRouter();
  const { pending, setPending, state, setState } = useAcademicModalState(open);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const rawCapacity = String(formData.get('capacity') ?? '').trim();
    const payload = {
      gradeId: String(formData.get('gradeId') ?? '').trim(),
      name: String(formData.get('name') ?? '').trim(),
      code: String(formData.get('code') ?? '').trim(),
      shift: String(formData.get('shift') ?? '').trim(),
      capacity: rawCapacity ? Number(rawCapacity) : null,
    };

    if (!payload.gradeId || !payload.name || !payload.code) {
      setState({ success: false, message: 'Curso o grado, nombre y código son obligatorios.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar la sección a actualizar.' });
      setPending(false);
      return;
    }

    try {
      await saveAcademicEntity(
        mode === 'create' ? '/academic-structure/sections' : `/academic-structure/sections/${initialValues?.id}`,
        mode === 'create' ? 'POST' : 'PATCH',
        payload,
      );
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar la sección.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar sección' : 'Editar sección'}
      description={mode === 'create'
        ? 'Agrega el paralelo operativo del curso o grado con jornada y capacidad referencial para el trabajo diario.'
        : 'Actualiza el curso o grado, paralelo, jornada y capacidad referencial de la sección.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Curso o grado</span>
            <select name="gradeId" defaultValue={initialValues?.gradeId ?? grades[0]?.id ?? ''} className="form-field">
              {grades.length === 0 ? <option value="">Primero registre un curso o grado</option> : null}
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>{grade.levelName} · {grade.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Sección o paralelo</span>
            <input name="name" required minLength={1} maxLength={80} defaultValue={initialValues?.name ?? ''} className="form-field" placeholder="A" />
          </label>
          <label className="block">
            <span className="field-label">Código</span>
            <input name="code" required minLength={2} maxLength={40} defaultValue={initialValues?.code ?? ''} className="form-field" placeholder="BGU1-A" />
          </label>
          <label className="block">
            <span className="field-label">Jornada</span>
            <select name="shift" defaultValue={initialValues?.shift ?? 'matutina'} className="form-field">
              <option value="matutina">Matutina</option>
              <option value="vespertina">Vespertina</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Capacidad referencial</span>
            <input name="capacity" type="number" min={1} max={100} defaultValue={initialValues?.capacity ?? ''} className="form-field" placeholder="35" />
          </label>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending || grades.length === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? (mode === 'create' ? 'Creando sección...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear sección' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
