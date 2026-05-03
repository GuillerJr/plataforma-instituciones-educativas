'use client';

import { useState } from 'react';
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

type FormState = {
  success: boolean;
  message: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

export function UserCreateForm({ institutions, roles }: UserCreateFormProps) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

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
      window.location.reload();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear el usuario.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="surface-panel p-6 sm:p-7">
      <div>
        <p className="eyebrow">Nuevo usuario</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Registrar acceso institucional</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Crea usuarios reales, define su estado y asigna roles sobre la API protegida existente sin salir del flujo administrativo.
        </p>
      </div>

      <form action={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-700">Nombre completo</span>
            <input name="fullName" required minLength={3} maxLength={180} className="form-field" placeholder="Mariana Pérez" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Correo</span>
            <input name="email" type="email" required className="form-field" placeholder="mariana.perez@educa.local" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Clave inicial</span>
            <input name="password" type="password" required minLength={8} className="form-field" placeholder="Mínimo 8 caracteres" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Estado</span>
            <select name="status" defaultValue="active" className="form-field">
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-slate-700">Institución</span>
          <select name="institutionId" defaultValue="" className="form-field">
            <option value="">Acceso global sin institución</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>{institution.name}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="text-sm text-slate-700">Roles</legend>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {roles.map((role) => (
              <label key={role.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-sky-300 hover:bg-sky-50/60">
                <input name="roleCodes" type="checkbox" value={role.code} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-sky-400" />
                <span>
                  <span className="block font-medium text-slate-900">{role.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{role.code}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <button type="submit" disabled={pending} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Creando usuario...' : 'Crear usuario'}
        </button>
      </form>
    </section>
  );
}
