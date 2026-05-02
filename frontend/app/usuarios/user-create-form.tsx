'use client';

import { useState } from 'react';

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

async function getDemoAccessToken() {
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@educa.local', password: 'Educa2026!' }),
  });

  const loginPayload = await loginResponse.json().catch(() => null) as { data?: { accessToken?: string }, message?: string } | null;

  if (!loginResponse.ok || !loginPayload?.data?.accessToken) {
    throw new Error(loginPayload?.message ?? 'No fue posible autenticar el acceso demo.');
  }

  return loginPayload.data.accessToken;
}

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
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Crear usuario</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Alta operativa de acceso</h2>
        <p className="mt-3 text-sm text-slate-300">
          Crea usuarios reales asignando institución, estado y roles sobre la API protegida existente.
        </p>
      </div>

      <form action={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">Nombre completo</span>
            <input name="fullName" required minLength={3} maxLength={180} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="Mariana Pérez" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Correo</span>
            <input name="email" type="email" required className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="mariana.perez@educa.local" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Clave inicial</span>
            <input name="password" type="password" required minLength={8} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="Mínimo 8 caracteres" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Estado</span>
            <select name="status" defaultValue="active" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40">
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-slate-300">Institución</span>
          <select name="institutionId" defaultValue="" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40">
            <option value="">Global / sin institución</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>{institution.name}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="text-sm text-slate-300">Roles</legend>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {roles.map((role) => (
              <label key={role.id} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-200">
                <input name="roleCodes" type="checkbox" value={role.code} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-sky-400" />
                <span>
                  <span className="block font-medium text-white">{role.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{role.code}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {state.message ? <p className={`text-sm ${state.success ? 'text-emerald-300' : 'text-rose-300'}`}>{state.message}</p> : null}

        <button type="submit" disabled={pending} className="inline-flex rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Creando usuario...' : 'Crear usuario'}
        </button>
      </form>
    </section>
  );
}
