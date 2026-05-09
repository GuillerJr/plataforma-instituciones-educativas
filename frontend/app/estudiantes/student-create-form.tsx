'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import type { StudentAcademicGrade, StudentAcademicLevel, StudentAcademicSection, StudentRecord, StudentStatus } from './page';

type FormState = {
  success: boolean;
  message: string | null;
};

type StudentFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  levels: StudentAcademicLevel[];
  grades: StudentAcademicGrade[];
  sections: StudentAcademicSection[];
  initialValues?: StudentRecord;
};

export function StudentFormModal({ open, mode, onClose, levels, grades, sections, initialValues }: StudentFormModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');

  const visibleGrades = useMemo(() => grades.filter((grade) => grade.levelId === selectedLevelId), [grades, selectedLevelId]);
  const visibleSections = useMemo(() => sections.filter((section) => section.gradeId === selectedGradeId), [sections, selectedGradeId]);

  useEffect(() => {
    if (!open) return;

    const defaultLevelId = initialValues?.levelId ?? levels[0]?.id ?? '';
    const defaultGradeId = initialValues?.gradeId ?? grades.find((grade) => grade.levelId === defaultLevelId)?.id ?? '';

    setPending(false);
    setState({ success: false, message: null });
    setSelectedLevelId(defaultLevelId);
    setSelectedGradeId(defaultGradeId);
    setSelectedSectionId(initialValues?.sectionId ?? sections.find((section) => section.gradeId === defaultGradeId)?.id ?? '');
  }, [open, levels, grades, sections, initialValues]);

  useEffect(() => {
    if (!selectedLevelId) {
      setSelectedGradeId('');
      return;
    }

    const nextGrade = grades.find((grade) => grade.levelId === selectedLevelId);

    if (!visibleGrades.some((grade) => grade.id === selectedGradeId)) {
      setSelectedGradeId(nextGrade?.id ?? '');
    }
  }, [grades, selectedGradeId, selectedLevelId, visibleGrades]);

  useEffect(() => {
    if (!selectedGradeId) {
      setSelectedSectionId('');
      return;
    }

    if (!visibleSections.some((section) => section.id === selectedSectionId)) {
      setSelectedSectionId(visibleSections[0]?.id ?? '');
    }
  }, [selectedGradeId, selectedSectionId, visibleSections]);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setState({ success: false, message: null });

    const payload = {
      fullName: String(formData.get('fullName') ?? '').trim(),
      identityDocument: String(formData.get('identityDocument') ?? '').trim(),
      enrollmentCode: String(formData.get('enrollmentCode') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      status: String(formData.get('status') ?? '').trim() as StudentStatus,
      levelId: String(formData.get('levelId') ?? '').trim(),
      gradeId: String(formData.get('gradeId') ?? '').trim(),
      sectionId: String(formData.get('sectionId') ?? '').trim(),
    };

    if (!payload.fullName || !payload.identityDocument || !payload.enrollmentCode || !payload.status) {
      setState({ success: false, message: 'Nombre, documento, código de matrícula y estado son obligatorios.' });
      setPending(false);
      return;
    }

    if (!payload.levelId || !payload.gradeId || !payload.sectionId) {
      setState({ success: false, message: 'Debe seleccionar nivel, curso o grado y sección.' });
      setPending(false);
      return;
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar el estudiante a actualizar.' });
      setPending(false);
      return;
    }

    try {
      const response = await fetch(mode === 'create' ? '/api/backend/students' : `/api/backend/students/${initialValues?.id}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? (mode === 'create' ? 'No fue posible crear el estudiante.' : 'No fue posible actualizar el estudiante.'));
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar el estudiante.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar estudiante' : 'Editar estudiante'}
      description={mode === 'create'
        ? 'Crea un estudiante real para la institución activa y ubícalo de forma coherente dentro de nivel, curso y sección ya disponibles.'
        : 'Actualiza datos base, estado y ubicación académica del estudiante sin perder la validación de nivel, curso y sección.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Nombre completo</span>
            <input name="fullName" required minLength={3} maxLength={180} defaultValue={initialValues?.fullName ?? ''} className="form-field" placeholder="Sofía Cárdenas" />
          </label>
          <label className="block">
            <span className="field-label">Documento</span>
            <input name="identityDocument" required minLength={3} maxLength={40} defaultValue={initialValues?.identityDocument ?? ''} className="form-field" placeholder="EST-004" />
          </label>
          <label className="block">
            <span className="field-label">Código de matrícula</span>
            <input name="enrollmentCode" required minLength={3} maxLength={40} defaultValue={initialValues?.enrollmentCode ?? ''} className="form-field" placeholder="MAT-2026-004" />
          </label>
          <label className="block">
            <span className="field-label">Estado</span>
            <select name="status" defaultValue={initialValues?.status ?? 'active'} className="form-field">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="retirado">Retirado</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Teléfono de contacto</span>
            <input name="phone" maxLength={40} defaultValue={initialValues?.phone ?? ''} className="form-field" placeholder="+593999999999" />
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Correo de contacto</span>
            <input name="email" type="email" defaultValue={initialValues?.email ?? ''} className="form-field" placeholder="familia@educa.demo" />
          </label>
        </div>

        <div className="form-cluster">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="field-label">Ubicación académica</p>
              <p className="mt-2 text-sm text-slate-500">La matrícula se registra sobre una sola institución y debe respetar la jerarquía nivel, curso y sección.</p>
            </div>
            <span className="info-chip">Asignación obligatoria</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="field-label">Nivel</span>
              <select name="levelId" value={selectedLevelId} onChange={(event) => setSelectedLevelId(event.target.value)} className="form-field">
                {levels.length === 0 ? <option value="">Primero registre la estructura académica</option> : null}
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>{level.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="field-label">Curso o grado</span>
              <select name="gradeId" value={selectedGradeId} onChange={(event) => setSelectedGradeId(event.target.value)} className="form-field">
                {visibleGrades.length === 0 ? <option value="">No hay cursos para este nivel</option> : null}
                {visibleGrades.map((grade) => (
                  <option key={grade.id} value={grade.id}>{grade.name}</option>
                ))}
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="field-label">Sección</span>
              <select name="sectionId" value={selectedSectionId} onChange={(event) => setSelectedSectionId(event.target.value)} className="form-field">
                {visibleSections.length === 0 ? <option value="">No hay secciones para el curso seleccionado</option> : null}
                {visibleSections.map((section) => (
                  <option key={section.id} value={section.id}>{section.gradeName} · {section.name} · {translateShift(section.shift)}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button
            type="submit"
            disabled={pending || levels.length === 0 || visibleGrades.length === 0 || visibleSections.length === 0}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (mode === 'create' ? 'Creando estudiante...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear estudiante' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function translateShift(shift: StudentAcademicSection['shift']) {
  if (shift === 'matutina') return 'Matutina';
  if (shift === 'vespertina') return 'Vespertina';
  return 'Por definir';
}
