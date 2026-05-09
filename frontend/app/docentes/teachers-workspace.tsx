'use client';

import { useState } from 'react';
import { Pencil, UserPlus } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
import { TeacherFormModal } from './teacher-create-form';
import type { TeacherAcademicGrade, TeacherAcademicLevel, TeacherAcademicSection, TeacherRecord, TeacherStatus } from './page';

type TeachersWorkspaceProps = {
  snapshot: {
    institution: {
      id: string;
      name: string;
    };
    summary: {
      teachers: number;
      activeTeachers: number;
      assignedTeachers: number;
    };
    teachers: TeacherRecord[];
    academicOptions: {
      levels: TeacherAcademicLevel[];
      grades: TeacherAcademicGrade[];
      sections: TeacherAcademicSection[];
    };
  } | null;
  error: string | null;
};

export function TeachersWorkspace({ snapshot, error }: TeachersWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const teachers = snapshot?.teachers ?? [];
  const levels = snapshot?.academicOptions.levels ?? [];
  const grades = snapshot?.academicOptions.grades ?? [];
  const sections = snapshot?.academicOptions.sections ?? [];
  const totalPages = Math.max(1, Math.ceil(teachers.length / pageSize));
  const visibleTeachers = teachers.slice((page - 1) * pageSize, page * pageSize);
  const inactiveTeachers = teachers.filter((teacher) => teacher.status !== 'active').length;

  return (
    <>
      <div className="space-y-5">
        <WorkspacePrelude
          eyebrow="Planta docente"
          title="Estado real de la cobertura docente"
          description="La prioridad es ver disponibilidad, asignación y actividad real con una lectura más ejecutiva dentro del módulo."
          actions={
            <>
              <ActionButton label="Docente" icon={UserPlus} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
              <span className="info-chip">{teachers.length} registrados</span>
            </>
          }
          metrics={[
            { label: 'Docentes', value: snapshot?.summary.teachers ?? 0, helper: 'Base visible' },
            { label: 'Con asignación', value: snapshot?.summary.assignedTeachers ?? 0, helper: 'Carga vinculada' },
            { label: 'Niveles disponibles', value: levels.length, helper: 'Cobertura académica' },
            { label: 'Sin actividad', value: inactiveTeachers, helper: 'Seguimiento pendiente' },
          ]}
          sideLabel="Cobertura académica"
          sideTitle="Disponibilidad para vincular docentes a la estructura del colegio"
          sideDescription="La misma lógica del módulo queda presentada con mejor contraste entre disponibilidad, asignación y cobertura de la estructura académica."
          sideContent={
            <DetailList
              items={[
                { label: 'Cursos visibles', value: grades.length },
                { label: 'Secciones visibles', value: sections.length },
                { label: 'Docentes sin carga', value: inactiveTeachers },
              ]}
            />
          }
        />

        <DataSection
          eyebrow="Docentes registrados"
          title="Planta académica de la institución"
          subtitle="Tabla operativa para revisar área, asignación actual, estado y contacto en una sola lectura."
          actions={
            <>
              <span className="info-chip">{teachers.length} docentes</span>
              <ActionButton label="Nuevo" icon={UserPlus} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </>
          }
        >

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : teachers.length === 0 ? (
            <div className="table-empty">Todavía no hay docentes registrados.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1180px]">
                  <thead>
                    <tr>
                      <th>Docente</th>
                      <th>Especialidad</th>
                      <th>Asignación actual</th>
                      <th>Estado</th>
                      <th>Contacto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleTeachers.map((teacher) => (
                      <tr key={teacher.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{teacher.fullName}</p>
                          <p className="mt-1 text-sm text-slate-500">{teacher.identityDocument}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{teacher.specialty || 'Por definir'}</p>
                        </td>
                        <td>
                          {teacher.assignmentTitle && teacher.assignmentLabel ? (
                            <div>
                              <p className="font-medium text-slate-950">{teacher.assignmentTitle}</p>
                              <p className="mt-1 text-sm text-slate-500">{teacher.assignmentLabel}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500">Sin asignación registrada</p>
                          )}
                        </td>
                        <td>
                          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                            <span className="info-chip h-fit">{translateTeacherStatus(teacher.status)}</span>
                            <span className="text-xs text-slate-500">{teacher.assignmentsCount} carga(s)</span>
                          </div>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{teacher.email || 'Sin correo'}</p>
                          <p className="mt-1 text-sm text-slate-500">{teacher.phone || 'Sin teléfono'}</p>
                        </td>
                        <td>
                          <div className="table-actions">
                            <ActionButton label="Editar" icon={Pencil} onClick={() => setEditingTeacher(teacher)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={teachers.length}
                itemLabel="docentes"
                onPageChange={setPage}
              />
            </>
          )}
        </DataSection>
      </div>

      <TeacherFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        levels={levels}
        grades={grades}
        sections={sections}
      />
      <TeacherFormModal
        open={editingTeacher !== null}
        mode="edit"
        initialValues={editingTeacher ?? undefined}
        onClose={() => setEditingTeacher(null)}
        levels={levels}
        grades={grades}
        sections={sections}
      />
    </>
  );
}

function translateTeacherStatus(status: TeacherStatus) {
  if (status === 'active') return 'Activo';
  if (status === 'inactive') return 'Inactivo';
  return 'En licencia';
}
