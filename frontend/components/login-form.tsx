'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FormState = {
  pending: boolean;
  error: string | null;
};

export function LoginForm() {
  const router = useRouter();
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
      router.replace(nextPath?.startsWith('/sistema') ? nextPath : '/sistema');
      router.refresh();
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
    <section className="surface-panel w-full max-w-[520px] p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">ED</span>
        <div>
          <p className="eyebrow">Acceso institucional</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Ingresa al sistema institucional</h1>
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

      <div className="mt-6 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
        <p className="font-semibold text-slate-950">¿Necesitas acceso?</p>
        <p className="mt-2 leading-6">Si todavía no tienes credenciales o necesitas recuperar el acceso, registra tu solicitud y el equipo institucional la validará antes de habilitar el ingreso.</p>
        <Link href="/registro" className="secondary-button mt-4 w-full sm:w-auto">
          Solicitar acceso
        </Link>
      </div>
    </section>
  );
}
