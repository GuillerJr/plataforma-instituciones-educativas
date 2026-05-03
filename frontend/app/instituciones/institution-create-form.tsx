'use client';

import { useState } from 'react';
import { getDemoAccessToken } from '../lib/demo-api';

type FormState = {
  success: boolean;
  message: string | null;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

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
    <section className="surface-panel p-6 sm:p-7">
      <div>
        <p className="eyebrow">Nueva institución</p>
        <h2 className="mt-3 text-2xl font-semibold text-slate-950">Registrar una institución</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Completa los datos principales para crear una institución real en la API protegida y verla de inmediato en el registro actual.
        </p>
      </div>

      <form action={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-slate-700">Nombre</span>
            <input name="name" required minLength={3} maxLength={180} className="form-field" placeholder="Unidad Educativa Nueva Esperanza" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Slug</span>
            <input name="slug" required minLength={3} maxLength={120} className="form-field" placeholder="unidad-educativa-nueva-esperanza" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Tipo</span>
            <select name="institutionType" required defaultValue="privada" className="form-field">
              <option value="privada">Privada</option>
              <option value="publica">Pública</option>
            </select>
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Correo de contacto</span>
            <input name="contactEmail" type="email" className="form-field" placeholder="rectorado@institucion.edu" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Teléfono</span>
            <input name="contactPhone" className="form-field" placeholder="+593999999999" />
          </label>
          <label className="block">
            <span className="text-sm text-slate-700">Año lectivo activo</span>
            <input name="activeSchoolYearLabel" className="form-field" placeholder="2026-2027" />
          </label>
        </div>

        <label className="block">
          <span className="text-sm text-slate-700">Dirección</span>
          <textarea name="address" rows={3} className="form-field" placeholder="Ciudad, sector y referencia principal" />
        </label>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <button type="submit" disabled={pending} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? 'Creando institución...' : 'Crear institución'}
        </button>
      </form>
    </section>
  );
}
