'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import { getAccessToken } from '../lib/client-auth';

type InstitutionOption = {
  id: string;
  name: string;
};

type RoleOption = {
  id: string;
  code: string;
  name: string;
};

type ProfileTeacherOption = {
  id: string;
  fullName: string;
  email?: string | null;
  status: string;
};

type ProfileStudentOption = {
  id: string;
  fullName: string;
  enrollmentCode?: string | null;
  status: string;
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
  teacherId?: string | null;
  studentId?: string | null;
  guardianships?: Array<{
    studentId: string;
    studentName: string;
    relationshipLabel: string;
    isPrimary: boolean;
  }>;
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
  const [profileOptions, setProfileOptions] = useState<{ teachers: ProfileTeacherOption[]; students: ProfileStudentOption[] }>({ teachers: [], students: [] });

  const selectedRoles = initialValues?.roleCodes ?? [];
  const showTeacherLink = useMemo(() => selectedRoles.includes('docente'), [selectedRoles]);
  const showStudentLink = useMemo(() => selectedRoles.includes('estudiante'), [selectedRoles]);
  const showRepresentativeLink = useMemo(() => selectedRoles.includes('representante'), [selectedRoles]);

  useEffect(() => {
    if (open) {
      setPending(false);
      setState({ success: false, message: null });
    }
  }, [open, mode, initialValues]);

  useEffect(() => {
    if (!open || mode !== 'create') return;

    let cancelled = false;

    (async () => {
      try {
        const accessToken = await getAccessToken();
        const response = await fetch(`${API_BASE_URL}/users/profile-options`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const payload = await response.json().catch(() => null) as { data?: { teachers: ProfileTeacherOption[]; students: ProfileStudentOption[] }; message?: string } | null;

        if (!response.ok) {
          throw new Error(payload?.message ?? 'No fue posible cargar opciones de vinculación.');
        }

        if (!cancelled) {
          setProfileOptions(payload?.data ?? { teachers: [], students: [] });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible cargar opciones de vinculación.' });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, mode]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    if (mode === 'edit') {
      setState({ success: false, message: 'La edición quedará habilitada cuando la API exponga actualización de usuarios.' });
      setPending(false);
      return;
    }

    const roleCodes = formData.getAll('roleCodes').map((value) => String(value).trim()).filter(Boolean);
    const payload = {
      fullName: String(formData.get('fullName') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? '').trim(),
      status: String(formData.get('status') ?? '').trim(),
      institutionId: String(formData.get('institutionId') ?? '').trim() || null,
      roleCodes,
      teacherId: String(formData.get('teacherId') ?? '').trim() || null,
      studentId: String(formData.get('studentId') ?? '').trim() || null,
      representativeStudentIds: formData.getAll('representativeStudentIds').map((value) => String(value).trim()).filter(Boolean),
    };

    if (!payload.fullName || !payload.email || !payload.password || !payload.status || payload.roleCodes.length === 0) {
      setState({ success: false, message: 'Nombre, correo, clave, estado y al menos un rol son obligatorios.' });
      setPending(false);
      return;
    }

    try {
      const accessToken = await getAccessToken();
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
        ? 'Crea usuarios reales, define su estado, asigna roles y vincula el perfil académico cuando corresponda.'
        : 'La interacción de edición ya quedó preparada en modal para activarse apenas exista actualización de usuarios en la API.'}
    >
      <form action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="field-label">Nombre completo</span>
            <input name="fullName" required minLength={3} maxLength={180} defaultValue={initialValues?.fullName ?? ''} className="form-field" placeholder="Mariana Pérez" />
          </label>
          <label className="block">
            <span className="field-label">Correo</span>
            <input name="email" type="email" required defaultValue={initialValues?.email ?? ''} className="form-field" placeholder="mariana.perez@educa.local" />
          </label>
          <label className="block">
            <span className="field-label">{mode === 'create' ? 'Clave inicial' : 'Nueva clave'}</span>
            <input name="password" type="password" required={mode === 'create'} minLength={8} className="form-field" placeholder={mode === 'create' ? 'Mínimo 8 caracteres' : 'Opcional para futura edición'} />
          </label>
          <label className="block">
            <span className="field-label">Estado</span>
            <select name="status" defaultValue={initialValues?.status ?? 'active'} className="form-field">
              <option value="active">Activo</option>
              <option value="pending">Pendiente</option>
              <option value="blocked">Bloqueado</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="field-label">Sede</span>
          <select name="institutionId" defaultValue={initialValues?.institutionId ?? ''} className="form-field">
            <option value="">Sin sede asociada</option>
            {institutions.map((institution) => (
              <option key={institution.id} value={institution.id}>{institution.name}</option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend className="field-label">Roles</legend>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {roles.map((role) => (
              <label key={role.id} className="choice-card">
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

        {mode === 'create' ? (
          <section className="form-cluster space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-950">Vinculación académica</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Usa estos campos cuando el usuario represente una identidad real dentro del colegio.</p>
            </div>

            {showTeacherLink ? (
              <label className="block">
                <span className="field-label">Vincular con docente</span>
                <select name="teacherId" defaultValue={initialValues?.teacherId ?? ''} className="form-field">
                  <option value="">Sin vínculo docente</option>
                  {profileOptions.teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>
                  ))}
                </select>
              </label>
            ) : null}

            {showStudentLink ? (
              <label className="block">
                <span className="field-label">Vincular con estudiante</span>
                <select name="studentId" defaultValue={initialValues?.studentId ?? ''} className="form-field">
                  <option value="">Sin vínculo estudiantil</option>
                  {profileOptions.students.map((student) => (
                    <option key={student.id} value={student.id}>{student.fullName} · {student.enrollmentCode ?? 'Sin código'}</option>
                  ))}
                </select>
              </label>
            ) : null}

            {showRepresentativeLink ? (
              <fieldset>
                <legend className="field-label">Estudiantes asociados al representante</legend>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {profileOptions.students.map((student) => (
                    <label key={student.id} className="choice-card">
                      <input name="representativeStudentIds" type="checkbox" value={student.id} className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-sky-400" />
                      <span>
                        <span className="block font-medium text-slate-900">{student.fullName}</span>
                        <span className="mt-1 block text-xs text-slate-500">{student.enrollmentCode ?? 'Sin código de matrícula'}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}
          </section>
        ) : null}

        {mode === 'edit' ? (
          <div className="form-cluster border-dashed border-sky-200 text-sm text-slate-700">
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
