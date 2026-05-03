'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import { getDemoAccessToken } from '../lib/demo-api';
import type { AcademicGrade, AcademicLevel } from './page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

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

async function postAcademicEntity(path: string, payload: unknown) {
  const accessToken = await getDemoAccessToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(responsePayload?.message ?? 'No fue posible guardar el registro académico.');
  }
}

export function LevelFormModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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

    try {
      await postAcademicEntity('/academic-structure/levels', payload);
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear el nivel.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Registrar nivel"
      description="Crea un nivel académico real para la institución actual y ordénalo dentro de la estructura base del colegio."
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Nombre del nivel</span>
            <input name="name" required minLength={3} maxLength={120} className="form-field" placeholder="Educación General Básica" />
          </label>
          <label className="block">
            <span className="field-label">Código</span>
            <input name="code" required minLength={2} maxLength={40} className="form-field" placeholder="EGB" />
          </label>
          <label className="block">
            <span className="field-label">Orden</span>
            <input name="sortOrder" type="number" min={0} max={999} defaultValue={1} className="form-field" />
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Etapa educativa</span>
            <select name="educationalStage" defaultValue="basica" className="form-field">
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
            {pending ? 'Creando nivel...' : 'Crear nivel'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function GradeFormModal({ open, onClose, levels }: { open: boolean; onClose: () => void; levels: AcademicLevel[] }) {
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

    try {
      await postAcademicEntity('/academic-structure/grades', payload);
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear el curso o grado.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Registrar curso o grado"
      description="Asocia el registro a un nivel existente para dejar lista la jerarquía académica mínima del colegio."
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Nivel</span>
            <select name="levelId" defaultValue={levels[0]?.id ?? ''} className="form-field">
              {levels.length === 0 ? <option value="">Primero registre un nivel</option> : null}
              {levels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Nombre del curso o grado</span>
            <input name="name" required minLength={3} maxLength={120} className="form-field" placeholder="Primero de BGU" />
          </label>
          <label className="block">
            <span className="field-label">Código</span>
            <input name="code" required minLength={2} maxLength={40} className="form-field" placeholder="BGU1" />
          </label>
          <label className="block">
            <span className="field-label">Orden</span>
            <input name="sortOrder" type="number" min={0} max={999} defaultValue={1} className="form-field" />
          </label>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending || levels.length === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? 'Creando registro...' : 'Crear curso o grado'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export function SectionFormModal({ open, onClose, grades }: { open: boolean; onClose: () => void; grades: AcademicGrade[] }) {
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

    try {
      await postAcademicEntity('/academic-structure/sections', payload);
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear la sección.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Registrar sección"
      description="Agrega el paralelo operativo del curso o grado con jornada y capacidad referencial para el trabajo diario."
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Curso o grado</span>
            <select name="gradeId" defaultValue={grades[0]?.id ?? ''} className="form-field">
              {grades.length === 0 ? <option value="">Primero registre un curso o grado</option> : null}
              {grades.map((grade) => (
                <option key={grade.id} value={grade.id}>{grade.levelName} · {grade.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Sección o paralelo</span>
            <input name="name" required minLength={1} maxLength={80} className="form-field" placeholder="A" />
          </label>
          <label className="block">
            <span className="field-label">Código</span>
            <input name="code" required minLength={2} maxLength={40} className="form-field" placeholder="BGU1-A" />
          </label>
          <label className="block">
            <span className="field-label">Jornada</span>
            <select name="shift" defaultValue="matutina" className="form-field">
              <option value="matutina">Matutina</option>
              <option value="vespertina">Vespertina</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Capacidad referencial</span>
            <input name="capacity" type="number" min={1} max={100} className="form-field" placeholder="35" />
          </label>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending || grades.length === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? 'Creando sección...' : 'Crear sección'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
