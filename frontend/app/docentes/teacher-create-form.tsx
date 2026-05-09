'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ModalShell } from '../../components/modal-shell';
import type { AssignmentScope, TeacherAcademicGrade, TeacherAcademicLevel, TeacherAcademicSection, TeacherRecord, TeacherStatus } from './page';

type FormState = {
  success: boolean;
  message: string | null;
};

type TeacherFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  onClose: () => void;
  levels: TeacherAcademicLevel[];
  grades: TeacherAcademicGrade[];
  sections: TeacherAcademicSection[];
  initialValues?: TeacherRecord;
};

export function TeacherFormModal({ open, mode, onClose, levels, grades, sections, initialValues }: TeacherFormModalProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<FormState>({ success: false, message: null });
  const [assignmentScope, setAssignmentScope] = useState<AssignmentScope | 'sin-asignacion'>('seccion');
  const [selectedLevelId, setSelectedLevelId] = useState(levels[0]?.id ?? '');
  const [selectedGradeId, setSelectedGradeId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');

  const visibleGrades = useMemo(() => grades.filter((grade) => grade.levelId === selectedLevelId), [grades, selectedLevelId]);
  const visibleSections = useMemo(() => sections.filter((section) => section.gradeId === selectedGradeId), [sections, selectedGradeId]);

  useEffect(() => {
    if (!open) return;

    const defaultLevelId = levels[0]?.id ?? '';
    const defaultGradeId = grades.find((grade) => grade.levelId === defaultLevelId)?.id ?? '';

    setPending(false);
    setState({ success: false, message: null });
    setAssignmentScope(mode === 'create' ? 'seccion' : 'sin-asignacion');
    setSelectedLevelId(defaultLevelId);
    setSelectedGradeId(defaultGradeId);
    setSelectedSectionId(sections.find((section) => section.gradeId === defaultGradeId)?.id ?? '');
  }, [open, levels, grades, sections, mode, initialValues]);

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

    const status = String(formData.get('status') ?? '').trim() as TeacherStatus;
    const assignmentMode = String(formData.get('assignmentScope') ?? '').trim() as AssignmentScope | 'sin-asignacion';
    const payload: {
      fullName: string;
      identityDocument: string;
      email: string;
      phone: string;
      specialty: string;
      status: TeacherStatus;
      assignment?: {
        scope: AssignmentScope;
        assignmentTitle: string;
        levelId?: string;
        gradeId?: string;
        sectionId?: string;
        notes?: string;
      } | null;
    } = {
      fullName: String(formData.get('fullName') ?? '').trim(),
      identityDocument: String(formData.get('identityDocument') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim(),
      specialty: String(formData.get('specialty') ?? '').trim(),
      status,
      assignment: null,
    };

    if (!payload.fullName || !payload.identityDocument || !payload.status) {
      setState({ success: false, message: 'Nombre, documento y estado son obligatorios.' });
      setPending(false);
      return;
    }

    if (assignmentMode !== 'sin-asignacion') {
      const assignmentTitle = String(formData.get('assignmentTitle') ?? '').trim();
      const notes = String(formData.get('notes') ?? '').trim();
      const levelId = String(formData.get('levelId') ?? '').trim();
      const gradeId = String(formData.get('gradeId') ?? '').trim();
      const sectionId = String(formData.get('sectionId') ?? '').trim();

      if (!assignmentTitle) {
        setState({ success: false, message: 'Debe indicar el tipo de responsabilidad académica.' });
        setPending(false);
        return;
      }

      payload.assignment = {
        scope: assignmentMode,
        assignmentTitle,
        notes,
        ...(assignmentMode === 'nivel' ? { levelId } : {}),
        ...(assignmentMode === 'curso' ? { gradeId } : {}),
        ...(assignmentMode === 'seccion' ? { sectionId } : {}),
      };
    }

    if (mode === 'edit' && !initialValues?.id) {
      setState({ success: false, message: 'No se pudo identificar el docente a actualizar.' });
      setPending(false);
      return;
    }

    try {
      const response = await fetch(mode === 'create' ? '/api/backend/teachers' : `/api/backend/teachers/${initialValues?.id}`, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responsePayload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(responsePayload?.message ?? (mode === 'create' ? 'No fue posible crear el docente.' : 'No fue posible actualizar el docente.'));
      }

      onClose();
      router.refresh();
    } catch (error) {
      setState({ success: false, message: error instanceof Error ? error.message : 'No fue posible guardar el docente.' });
    } finally {
      setPending(false);
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Registrar docente' : 'Editar docente'}
      description={mode === 'create'
        ? 'Crea un docente real para la institución activa y, si ya corresponde, déjalo asignado a nivel, curso o sección dentro de la estructura académica disponible.'
        : 'Actualiza datos base del docente y, si corresponde, registra una nueva asignación académica como carga más reciente.'}
    >
      <form key={`${mode}:${initialValues?.id ?? 'new'}`} action={handleSubmit} className="space-y-5">
        <div className="form-cluster grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="field-label">Nombre completo</span>
            <input name="fullName" required minLength={3} maxLength={180} defaultValue={initialValues?.fullName ?? ''} className="form-field" placeholder="Mariana Pérez" />
          </label>
          <label className="block">
            <span className="field-label">Documento</span>
            <input name="identityDocument" required minLength={3} maxLength={40} defaultValue={initialValues?.identityDocument ?? ''} className="form-field" placeholder="DOC-004" />
          </label>
          <label className="block">
            <span className="field-label">Estado</span>
            <select name="status" defaultValue={initialValues?.status ?? 'active'} className="form-field">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="licencia">En licencia</option>
            </select>
          </label>
          <label className="block">
            <span className="field-label">Correo</span>
            <input name="email" type="email" defaultValue={initialValues?.email ?? ''} className="form-field" placeholder="mariana.perez@educa.demo" />
          </label>
          <label className="block">
            <span className="field-label">Teléfono</span>
            <input name="phone" maxLength={40} defaultValue={initialValues?.phone ?? ''} className="form-field" placeholder="+593999999999" />
          </label>
          <label className="block md:col-span-2">
            <span className="field-label">Especialidad o área principal</span>
            <input name="specialty" maxLength={140} defaultValue={initialValues?.specialty ?? ''} className="form-field" placeholder="Lengua y Literatura" />
          </label>
        </div>

        <div className="form-cluster">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="field-label">Asignación académica inicial</p>
              <p className="mt-2 text-sm text-slate-500">{mode === 'create' ? 'Puede quedar registrada desde esta misma alta o dejarse para después.' : 'Si no seleccionas una nueva asignación, se mantiene la carga académica actual.'}</p>
            </div>
            <span className="info-chip">Institución única</span>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="field-label">Alcance de asignación</span>
              <select
                name="assignmentScope"
                value={assignmentScope}
                onChange={(event) => setAssignmentScope(event.target.value as AssignmentScope | 'sin-asignacion')}
                className="form-field"
              >
                <option value="sin-asignacion">{mode === 'create' ? 'Registrar sin asignación por ahora' : 'Mantener asignación actual'}</option>
                <option value="nivel">Asignar a nivel</option>
                <option value="curso">Asignar a curso o grado</option>
                <option value="seccion">Asignar a sección</option>
              </select>
            </label>

            {assignmentScope !== 'sin-asignacion' ? (
              <>
                <label className="block md:col-span-2">
                  <span className="field-label">Responsabilidad</span>
                  <input name="assignmentTitle" required minLength={3} maxLength={140} className="form-field" placeholder="Tutora de sección" />
                </label>
                <label className="block">
                  <span className="field-label">Nivel</span>
                  <select name="levelId" value={selectedLevelId} onChange={(event) => setSelectedLevelId(event.target.value)} className="form-field">
                    {levels.length === 0 ? <option value="">Primero registre la estructura académica</option> : null}
                    {levels.map((level) => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </label>

                {assignmentScope === 'curso' || assignmentScope === 'seccion' ? (
                  <label className="block">
                    <span className="field-label">Curso o grado</span>
                    <select name="gradeId" value={selectedGradeId} onChange={(event) => setSelectedGradeId(event.target.value)} className="form-field">
                      {visibleGrades.length === 0 ? <option value="">No hay cursos para este nivel</option> : null}
                      {visibleGrades.map((grade) => (
                        <option key={grade.id} value={grade.id}>{grade.name}</option>
                      ))}
                    </select>
                  </label>
                ) : null}

                {assignmentScope === 'seccion' ? (
                  <label className="block md:col-span-2">
                    <span className="field-label">Sección</span>
                    <select name="sectionId" value={selectedSectionId} onChange={(event) => setSelectedSectionId(event.target.value)} className="form-field">
                      {visibleSections.length === 0 ? <option value="">No hay secciones para el curso seleccionado</option> : null}
                      {visibleSections.map((section) => (
                        <option key={section.id} value={section.id}>{section.gradeName} · {section.name} · {translateShift(section.shift)}</option>
                      ))}
                    </select>
                  </label>
                ) : null}

                <label className="block md:col-span-2">
                  <span className="field-label">Notas</span>
                  <textarea name="notes" rows={3} maxLength={500} className="form-field min-h-[104px]" placeholder="Observaciones útiles para coordinación o rectorado" />
                </label>
              </>
            ) : null}
          </div>
        </div>

        {state.message ? <p className={`text-sm ${state.success ? 'status-good' : 'status-bad'}`}>{state.message}</p> : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="secondary-button">Cancelar</button>
          <button
            type="submit"
            disabled={pending || (assignmentScope !== 'sin-asignacion' && levels.length === 0)}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (mode === 'create' ? 'Creando docente...' : 'Guardando cambios...') : (mode === 'create' ? 'Crear docente' : 'Guardar cambios')}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function translateShift(shift: TeacherAcademicSection['shift']) {
  if (shift === 'matutina') return 'Matutina';
  if (shift === 'vespertina') return 'Vespertina';
  return 'Por definir';
}
