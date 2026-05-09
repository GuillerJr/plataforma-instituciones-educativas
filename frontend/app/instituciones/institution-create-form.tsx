'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';

type FormState = {
  success: boolean;
  message: string | null;
};

export type InstitutionFormValues = {
  id?: string;
  name: string;
  slug: string;
  institutionType: 'publica' | 'privada';
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
};

type InstitutionFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  initialValues?: InstitutionFormValues;
};

export function InstitutionFormModal({ open, mode, onClose, initialValues }: InstitutionFormModalProps) {
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

    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      slug: String(formData.get('slug') ?? '').trim(),
      institutionType: String(formData.get('institutionType') ?? '').trim(),
      contactEmail: String(formData.get('contactEmail') ?? '').trim(),
      contactPhone: String(formData.get('contactPhone') ?? '').trim(),
      address: String(formData.get('address') ?? '').trim(),
    };

    if (!payload.name || !payload.slug || !payload.institutionType) {
      setState({ success: false, message: 'Nombre, slug y tipo son obligatorios.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar el registro institucional a actualizar.' });
      setPending(false);
      return;
    }

    try {
      const response = await fetch(mode === 'create' ? '/api/backend/institutions' : `/api/backend/institutions/${initialValues?.id}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? (mode === 'create' ? 'No fue posible crear el registro.' : 'No fue posible actualizar el registro.'));
      }

      setState({ success: true, message: mode === 'create' ? 'Registro creado correctamente.' : 'Registro actualizado correctamente.' });
      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar el registro.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar sede o dato base' : 'Editar registro institucional'}
      description={mode === 'create'
        ? 'Completa los datos principales para crear un registro base o una sede y verlo de inmediato en la tabla actual.'
        : 'Actualiza los datos principales del registro institucional y refleja el cambio de inmediato en la tabla.'}
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Nombre</span>
            <input name="name" required minLength={3} maxLength={180} defaultValue={initialValues?.name ?? ''} className="form-field" placeholder="Unidad Educativa Nueva Esperanza" />
          </label>
          <label className="block">
            <span className="field-label">Slug</span>
            <input name="slug" required minLength={3} maxLength={120} defaultValue={initialValues?.slug ?? ''} className="form-field" placeholder="unidad-educativa-nueva-esperanza" />
          </label>
          <label className="block">
            <span className="field-label">Tipo</span>
            <select name="institutionType" required defaultValue={initialValues?.institutionType ?? 'privada'} className="form-field">
              <option value="privada">Privada</option>
              <option value="publica">Pública</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Correo de contacto</span>
            <input name="contactEmail" type="email" defaultValue={initialValues?.contactEmail ?? ''} className="form-field" placeholder="rectorado@institucion.edu" />
          </label>
          <label className="block">
            <span className="field-label">Teléfono</span>
            <input name="contactPhone" defaultValue={initialValues?.contactPhone ?? ''} className="form-field" placeholder="+593999999999" />
          </label>
        </div>

        <label className="block">
          <span className="field-label">Dirección</span>
          <textarea name="address" rows={3} defaultValue={initialValues?.address ?? ''} className="form-field" placeholder="Ciudad, sector y referencia principal" />
        </label>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">
            Cancelar
          </button>
          <button type="submit" disabled={pending} className="primary-button disabled:cursor-not-allowed disabled:opacity-60">
            {pending ? (mode === 'create' ? 'Creando registro...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear registro' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
