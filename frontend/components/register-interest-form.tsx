'use client';

import { useRef, useState } from 'react';

type RegisterInterestFormProps = {
  requestType?: string;
  context?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

export function RegisterInterestForm({ requestType: initialRequestType, context }: RegisterInterestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<{ pending: boolean; success: string | null; error: string | null }>({
    pending: false,
    success: null,
    error: null,
  });
  const requestedType = initialRequestType;
  const requestType = requestedType === 'admision' || requestedType === 'informacion'
    ? requestedType
    : 'acceso';
  const isRecoveryRequest = context === 'recuperacion';

  async function handleSubmit(formData: FormData) {
    setState({ pending: true, success: null, error: null });

    const fullName = String(formData.get('fullName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const relationship = String(formData.get('relationship') ?? '').trim();
    const selectedRequestType = String(formData.get('requestType') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!fullName || !email || !relationship || !selectedRequestType) {
      setState({ pending: false, success: null, error: 'Completa los campos obligatorios antes de enviar.' });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/public-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          relationship,
          requestType: selectedRequestType,
          message,
          sourceContext: context ?? 'registro-publico',
        }),
      });

      const payload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? 'No fue posible registrar la solicitud.');
      }

      formRef.current?.reset();
      setState({
        pending: false,
        success: payload?.message ?? 'Solicitud registrada correctamente. El equipo institucional revisará tu caso.',
        error: null,
      });
    } catch (error) {
      setState({
        pending: false,
        success: null,
        error: error instanceof Error ? error.message : 'No fue posible registrar la solicitud.',
      });
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="surface-panel w-full max-w-[760px] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:p-7">
      {isRecoveryRequest ? (
        <div className="mb-5 rounded-[1.4rem] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-900">
          Indica tus datos institucionales y describe que necesitas recuperar tu contraseña. Este flujo queda preparado para que el equipo administrativo gestione la solicitud en la siguiente fase.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="field-label">Nombre completo</span>
          <input name="fullName" required className="form-field" placeholder="María Fernanda Torres" />
        </label>
        <label className="block">
          <span className="field-label">Correo de contacto</span>
          <input name="email" type="email" required className="form-field" placeholder="maria.torres@familia.com" />
        </label>
        <label className="block">
          <span className="field-label">Vinculación con la institución</span>
          <select name="relationship" className="form-field" defaultValue="familia">
            <option value="familia">Familia</option>
            <option value="docente">Docente</option>
            <option value="administrativo">Administrativo</option>
            <option value="aspirante">Aspirante</option>
          </select>
        </label>
        <label className="block">
          <span className="field-label">Motivo de la solicitud</span>
          <select name="requestType" className="form-field" defaultValue={requestType}>
            <option value="acceso">Acceso al sistema</option>
            <option value="admision">Proceso de admisión</option>
            <option value="informacion">Información institucional</option>
          </select>
        </label>
      </div>

      <label className="mt-4 block">
        <span className="field-label">Mensaje</span>
        <textarea
          name="message"
          rows={5}
          className="form-field"
          placeholder={isRecoveryRequest ? 'Indica el usuario o correo institucional asociado y cualquier dato útil para validar la recuperación del acceso.' : 'Cuéntanos qué necesitas y a qué área debe llegar tu solicitud.'}
        />
      </label>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-500">La solicitud quedará registrada para revisión administrativa y trazabilidad institucional.</p>
        <button type="submit" disabled={state.pending} className="primary-button w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {state.pending ? 'Registrando...' : 'Enviar solicitud'}
        </button>
      </div>

      {state.error ? (
        <div className="mt-5 rounded-[1.4rem] border border-rose-200 bg-rose-50 px-4 py-4 text-sm leading-6 text-rose-800">
          {state.error}
        </div>
      ) : null}

      {state.success ? (
        <div className="mt-5 rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          {state.success}
        </div>
      ) : null}
    </form>
  );
}
