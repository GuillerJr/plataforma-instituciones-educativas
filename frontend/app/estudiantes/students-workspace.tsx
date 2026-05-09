'use client';

import { useState } from 'react';
import { Pencil, UserPlus } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
import { StudentFormModal } from './student-create-form';
import type { StudentAcademicGrade, StudentAcademicLevel, StudentAcademicSection, StudentRecord, StudentStatus } from './page';

type StudentsWorkspaceProps = {
  canManage: boolean;
  snapshot: {
    institution: {
      id: string;
      name: string;
    };
    summary: {
      students: number;
      activeStudents: number;
      sectionsInUse: number;
    };
    students: StudentRecord[];
    academicOptions: {
      levels: StudentAcademicLevel[];
      grades: StudentAcademicGrade[];
      sections: StudentAcademicSection[];
    };
  } | null;
  error: string | null;
};

export function StudentsWorkspace({ snapshot, error, canManage }: StudentsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const students = snapshot?.students ?? [];
  const levels = snapshot?.academicOptions.levels ?? [];
  const grades = snapshot?.academicOptions.grades ?? [];
  const sections = snapshot?.academicOptions.sections ?? [];
  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const visibleStudents = students.slice((page - 1) * pageSize, page * pageSize);
  const inactiveStudents = students.filter((student) => student.status !== 'active').length;

  return (
    <>
      <div className="space-y-5">
        <WorkspacePrelude
          eyebrow="Matrícula estudiantil"
          title="Altas rápidas con ubicación académica visible en el mismo flujo"
          description="La coordinación ya puede registrar estudiantes y dejarlos ubicados en nivel, curso y sección sin romper la navegación académica existente."
          actions={
            <>
              {canManage ? <ActionButton label="Estudiante" icon={UserPlus} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} /> : null}
              <span className="info-chip">{students.length} registrados</span>
            </>
          }
          metrics={[
            { label: 'Estudiantes', value: snapshot?.summary.students ?? 0, helper: 'Base visible' },
            { label: 'Activos', value: snapshot?.summary.activeStudents ?? 0, helper: 'Matrícula operativa' },
            { label: 'Secciones en uso', value: snapshot?.summary.sectionsInUse ?? 0, helper: 'Cobertura actual' },
            { label: 'Sin actividad', value: inactiveStudents, helper: 'Seguimiento administrativo' },
          ]}
          sideLabel="Cobertura de matrícula"
          sideTitle="Ubicación académica validada contra la estructura real"
          sideDescription="La matrícula inicial sigue validada contra la sección seleccionada para asegurar coherencia automática con curso y nivel."
          sideContent={
            <DetailList
              items={[
                { label: 'Niveles disponibles', value: levels.length },
                { label: 'Cursos visibles', value: grades.length },
                { label: 'Secciones activas', value: sections.length },
              ]}
            />
          }
        />

        <DataSection
          eyebrow="Estudiantes registrados"
          title="Matrícula operativa de la institución"
          subtitle="Tabla compacta para revisar ubicación académica, estado y datos base en una sola lectura."
          actions={
            <>
              <span className="info-chip">{students.length} estudiantes</span>
              {canManage ? <ActionButton label="Nuevo" icon={UserPlus} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} /> : null}
            </>
          }
        >

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : students.length === 0 ? (
            <div className="table-empty">Todavía no hay estudiantes registrados.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1280px]">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Matrícula</th>
                      <th>Ubicación académica</th>
                      <th>Estado</th>
                      <th>Contacto</th>
                      {canManage ? <th>Acciones</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {visibleStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{student.fullName}</p>
                          <p className="mt-1 text-sm text-slate-500">{student.identityDocument}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{student.enrollmentCode}</p>
                          <p className="mt-1 text-sm text-slate-500">{student.levelName}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{student.gradeName} · {student.sectionName}</p>
                          <p className="mt-1 text-sm text-slate-500">{translateShift(student.shift)}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateStudentStatus(student.status)}</span>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{student.email || 'Sin correo'}</p>
                          <p className="mt-1 text-sm text-slate-500">{student.phone || 'Sin teléfono'}</p>
                        </td>
                        {canManage ? (
                          <td>
                            <div className="table-actions">
                              <ActionButton label="Editar" icon={Pencil} onClick={() => setEditingStudent(student)} />
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={students.length}
                itemLabel="estudiantes"
                onPageChange={setPage}
              />
            </>
          )}
        </DataSection>
      </div>

      {canManage ? (
        <>
          <StudentFormModal
            open={createOpen}
            mode="create"
            onClose={() => setCreateOpen(false)}
            levels={levels}
            grades={grades}
            sections={sections}
          />
          <StudentFormModal
            open={editingStudent !== null}
            mode="edit"
            initialValues={editingStudent ?? undefined}
            onClose={() => setEditingStudent(null)}
            levels={levels}
            grades={grades}
            sections={sections}
          />
        </>
      ) : null}
    </>
  );
}

function translateStudentStatus(status: StudentStatus) {
  if (status === 'active') return 'Activo';
  if (status === 'inactive') return 'Inactivo';
  return 'Retirado';
}

function translateShift(shift: StudentRecord['shift']) {
  if (shift === 'matutina') return 'Jornada matutina';
  if (shift === 'vespertina') return 'Jornada vespertina';
  return 'Jornada por definir';
}
