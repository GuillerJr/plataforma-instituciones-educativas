'use client';

import { useState } from 'react';

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

export function InstitutionCreateForm() {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      slug: String(formData.get('slug') ?? '').trim(),
      institutionType: String(formData.get('institutionType') ?? '').trim(),
      contactEmail: String(formData.get('contactEmail') ?? '').trim(),
      contactPhone: String(formData.get('contactPhone') ?? '').trim(),
      address: String(formData.get('address') ?? '').trim(),
      activeSchoolYearLabel: String(formData.get('activeSchoolYearLabel') ?? '').trim(),
    };

    if (!payload.name || !payload.slug || !payload.institutionType) {
      setState({ success: false, message: 'Nombre, slug y tipo son obligatorios.' });
      setPending(false);
      return;
    }

    try {
      const accessToken = await getDemoAccessToken();
      const response = await fetch(`${API_BASE_URL}/institutions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? 'No fue posible crear la institución.');
      }

      setState({ success: true, message: 'Institución creada correctamente.' });
      window.location.reload();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible crear la institución.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Crear institución</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Alta institucional inicial</h2>
        <p className="mt-3 text-sm text-slate-300">
          Registra una institución real en la API protegida y refleja el cambio en la tabla inferior.
        </p>
      </div>

      <form action={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-300">Nombre</span>
            <input name="name" required minLength={3} maxLength={180} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="Unidad Educativa Nueva Esperanza" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Slug</span>
            <input name="slug" required minLength={3} maxLength={120} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="unidad-educativa-nueva-esperanza" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Tipo</span>
            <select name="institutionType" required defaultValue="privada" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/40">
              <option value="privada">Privada</option>
              <option value="publica">Pública</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Correo de contacto</span>
            <input name="contactEmail" type="email" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="rectorado@institucion.edu" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Teléfono</span>
            <input name="contactPhone" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="+593999999999" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-300">Año lectivo activo</span>
            <input name="activeSchoolYearLabel" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="2026-2027" />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-slate-300">Dirección</span>
          <textarea name="address" rows={3} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40" placeholder="Ciudad, sector y referencia principal" />
        </label>

        {state.message ? <p className={`text-sm ${state.success ? 'text-emerald-300' : 'text-rose-300'}`}>{state.message}</p> : null}

        <button type="submit" disabled={pending} className="inline-flex rounded-2xl border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm text-sky-100 transition hover:bg-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Creando institución...' : 'Crear institución'}
        </button>
      </form>
    </section>
  );
}
