'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import { getAccessToken } from '../lib/client-auth';
import type { SubjectAcademicLevel, SubjectStatus } from './page';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

type FormState = {
  success: boolean;
  message: string | null;
};

export function SubjectFormModal({ open, onClose, levels }: { open: boolean; onClose: () => void; levels: SubjectAcademicLevel[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });

  useEffect(() => {
    if (!open) return;

    setPending(false);
    setState({ success: false, message: null });
  }, [open]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const rawWeeklyHours = String(formData.get('weeklyHours') ?? '').trim();
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      code: String(formData.get('code') ?? '').trim(),
      area: String(formData.get('area') ?? '').trim(),
      levelId: String(formData.get('levelId') ?? '').trim(),
      weeklyHours: rawWeeklyHours ? Number(rawWeeklyHours) : null,
      status: String(formData.get('status') ?? '').trim() as SubjectStatus,
    };

    if (!payload.name || !payload.code || !payload.status) {
      setState({ success: false, message: 'Nombre, código y estado son obligatorios.' });
      setPending(false);
      return;
    }

    try {
      const accessToken = await getAccessToken();
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? 'No fue posible crear la materia.');
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear la materia.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="Registrar materia"
      description="Crea una materia real para la institución activa y, si corresponde, relaciónala con un nivel para facilitar la asignación académica posterior."
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Nombre de la materia</span>
            <input name="name" required minLength={3} maxLength={140} className="form-field" placeholder="Matemática" />
          </label>
          <label className="block">
            <span className="field-label">Código</span>
            <input name="code" required minLength={2} maxLength={40} className="form-field" placeholder="MAT" />
          </label>
          <label className="block">
            <span className="field-label">Estado</span>
            <select name="status" defaultValue="active" className="form-field">
              <option value="active">Activa</option>
              <option value="inactive">Inactiva</option>
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Área</span>
            <input name="area" maxLength={120} className="form-field" placeholder="Ciencias exactas" />
          </label>
          <label className="block">
            <span className="field-label">Nivel sugerido</span>
            <select name="levelId" defaultValue="" className="form-field">
              <option value="">Aplicable a toda la institución</option>
              {levels.map((level) => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">Horas semanales referenciales</span>
            <input name="weeklyHours" type="number" min={1} max={60} className="form-field" placeholder="5" />
          </label>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button type="submit" disabled={pending} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? 'Creando materia...' : 'Crear materia'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
