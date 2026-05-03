'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import { getDemoAccessToken } from '../lib/demo-api';

type InstitutionOption = {
  id: string;
  name: string;
};

type RoleOption = {
  id: string;
  code: string;
  name: string;
};

type UserCreateFormProps = {
  institutions: InstitutionOption[];
  roles: RoleOption[];
};

export type UserFormValues = {
  id?: string;
  institutionId: string | null;
  fullName: string;
  email: string;
  status: 'pending' | 'active' | 'blocked';
  roleCodes: string[];
};

type FormState = {
  success: boolean;
  message: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

type UserFormModalProps = UserCreateFormProps & {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  initialValues?: UserFormValues;
};

export function UserFormModal({ institutions, roles, open, mode, onClose, initialValues }: UserFormModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });

  useEffect(() => {
    if (open) {
      setPending(false);
      setState({ success: false, message: null });
    }
  }, [open, mode, initialValues]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    if (mode === 'edit') {
      setState({ success: false, message: 'La edición quedará habilitada cuando la API exponga actualización de usuarios.' });
      setPending(false);
      return;
    }

    const payload = {
      fullName: String(formData.get('fullName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? '').trim(),
      status: String(formData.get('status') ?? '').trim(),
      institutionId: String(formData.get('institutionId') ?? '').trim() || null,
      roleCodes: formData.getAll('roleCodes').map((value) => String(value).trim()).filter(Boolean),
    };

    if (!payload.fullName || !payload.email || !payload.password || !payload.status || payload.roleCodes.length === 0) {
      setState({ success: false, message: 'Nombre, correo, clave, estado y al menos un rol son obligatorios.' });
      setPending(false);
      return;
    }

    try {
      const accessToken = await getDemoAccessToken();
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? 'No fue posible crear el usuario.');
      }

      setState({ success: true, message: 'Usuario creado correctamente.' });
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear el usuario.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar usuario' : 'Editar usuario'}
      description={mode === 'create'
        ? 'Crea usuarios reales, define su estado y asigna roles sobre la API protegida existente sin salir del flujo administrativo.'
        : 'La interacción de edición ya quedó preparada en modal para activarse apenas exista actualización de usuarios en la API.'}
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Nombre completo</span>
            <input name="fullName" required minLength={3} maxLength={180} defaultValue={initialValues?.fullName ?? ''} className="form-field" placeholder="Mariana Pérez" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Correo</span>
            <input name="email" type="email" required defaultValue={initialValues?.email ?? ''} className="form-field" placeholder="mariana.perez@educa.local" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{mode === 'create' ? 'Clave inicial' : 'Nueva clave'}</span>
            <input name="password" type="password" required={mode === 'create'} minLength={8} className="form-field" placeholder={mode === 'create' ? 'Mínimo 8 caracteres' : 'Opcional para futura edición'} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Estado</span>
            <select name="status" defaultValue={initialValues?.status ?? 'active'} className="form-field">
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Sede o registro institucional</span>
          <select name="institutionId" defaultValue={initialValues?.institutionId ?? ''} className="form-field">
            <option value="">Sin sede asignada</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>{institution.name}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Roles</legend>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {roles.map((role) => (
              <label key={role.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-sky-50/60">
                <input
                  name="roleCodes"
                  type="checkbox"
                  value={role.code}
                  defaultChecked={initialValues?.roleCodes.includes(role.code)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-sky-400"
                />
                <span>
                  <span className="block font-medium text-slate-900">{role.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{role.code}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {mode === 'edit' ? (
          <div className="rounded-[24px] border border-dashed border-sky-200 bg-sky-50/70 px-4 py-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Próxima fase</p>
            <p className="mt-2 leading-6">
              La edición visual del usuario ya quedó integrada en este modal. El guardado real se activará cuando exista el endpoint de actualización en backend.
            </p>
          </div>
        ) : null}

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">
            {mode === 'create' ? 'Cancelar' : 'Cerrar'}
          </button>
          {mode === 'create' ? (
            <button type="submit" disabled={pending} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
              {pending ? 'Creando usuario...' : 'Crear usuario'}
            </button>
          ) : (
            <button type="button" disabled className="primary-button cursor-not-allowed opacity-60">
              Disponible en próxima fase
            </button>
          )}
        </div>
      </form>
    </ModalShell>
  );
}
