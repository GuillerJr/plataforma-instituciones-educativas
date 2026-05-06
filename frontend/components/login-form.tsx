'use client';

import Link from 'next/link';
import { useState } from 'react';

type FormState = {
  pending: boolean;
  error: string | null;
};

export function LoginForm() {
  const [state, setState] = useState<FormState>({ pending: false, error: null });
  const recoveryHref = '/registro?requestType=acceso&context=recuperacion';

  async function handleSubmit(formData: FormData) {
    setState({ pending: true, error: null });

    const payload = {
      identifier: String(formData.get('identifier') ?? '').trim(),
      password: String(formData.get('password') ?? '').trim(),
    };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(result?.message ?? 'No fue posible iniciar sesión.');
      }

      const nextPath = new URLSearchParams(window.location.search).get('next');
      const targetPath = nextPath?.startsWith('/sistema') ? nextPath : '/sistema';

      window.location.assign(targetPath);
      return;
    } catch (error) {
      setState({
        pending: false,
        error: error instanceof Error ? error.message : 'No fue posible iniciar sesión.',
      });
      return;
    }

    setState({ pending: false, error: null });
  }

  return (
    <section className="surface-panel w-full max-w-[520px] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:p-7">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#18345f_0%,#0f223d_100%)] text-sm font-semibold text-white shadow-[0_18px_38px_rgba(15,34,61,0.28)] sm:h-12 sm:w-12">ED</span>
        <div className="min-w-0">
          <p className="eyebrow">Acceso institucional</p>
          <h1 className="mt-1 text-[clamp(1.35rem,4vw,1.5rem)] font-semibold leading-tight tracking-tight text-slate-950">Ingresa al sistema institucional</h1>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        Accede con tu usuario institucional o con tu correo. Si escribes solo el usuario, el sistema completará el dominio interno del colegio.
      </p>

      <form action={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="field-label">Usuario o correo institucional</span>
          <input name="identifier" required className="form-field" placeholder="admin o admin@educa.local" autoComplete="username" />
        </label>

        <label className="block">
          <span className="field-label">Contraseña</span>
          <input name="password" type="password" required minLength={6} className="form-field" placeholder="Ingresa tu contraseña" autoComplete="current-password" />
        </label>

        <div className="flex items-center justify-end">
          <Link href={recoveryHref} className="text-sm font-semibold text-sky-700 transition hover:text-sky-800 hover:underline">
            Olvidé mi contraseña
          </Link>
        </div>

        {state.error ? <p className="text-sm status-bad">{state.error}</p> : null}

        <button type="submit" disabled={state.pending} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60">
          {state.pending ? 'Validando acceso...' : 'Ingresar al sistema'}
        </button>
      </form>

      <div className="mt-6 rounded-[1.4rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)] p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-950">¿Necesitas acceso?</p>
        <p className="mt-2 leading-6">Si todavía no tienes credenciales o necesitas recuperar el acceso, registra tu solicitud y el equipo institucional la validará antes de habilitar el ingreso.</p>
        <Link href="/registro" className="secondary-button mt-4 w-full sm:w-auto">
          Solicitar acceso
        </Link>
      </div>
    </section>
  );
}
