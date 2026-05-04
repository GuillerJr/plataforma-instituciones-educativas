'use client';

import { useState } from 'react';

type RegisterInterestFormProps = {
  requestType?: string;
  context?: string;
};

export function RegisterInterestForm({ requestType: initialRequestType, context }: RegisterInterestFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const requestedType = initialRequestType;
  const requestType = requestedType === 'admision' || requestedType === 'informacion'
    ? requestedType
    : 'acceso';
  const isRecoveryRequest = context === 'recuperacion';

  async function handleSubmit(formData: FormData) {
    const fullName = String(formData.get('fullName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();

    if (!fullName || !email) return;

    setSubmitted(true);
  }

  return (
    <form action={handleSubmit} className="surface-panel w-full max-w-[760px] p-6 sm:p-8">
      {isRecoveryRequest ? (
        <div className="mb-5 rounded-[20px] border border-sky-200 bg-sky-50 px-4 py-4 text-sm leading-6 text-sky-900">
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
        <p className="text-sm leading-6 text-slate-500">Esta fase deja listo el punto de entrada público. El envío formal y la trazabilidad administrativa se integrarán en la siguiente iteración.</p>
        <button type="submit" className="primary-button w-full sm:w-auto">Enviar solicitud</button>
      </div>

      {submitted ? (
        <div className="mt-5 rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          Solicitud preparada. En la siguiente fase se conectará con el flujo institucional de recepción y seguimiento.
        </div>
      ) : null}
    </form>
  );
}
