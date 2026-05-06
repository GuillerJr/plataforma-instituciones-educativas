'use client';

import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
import { AcademicAssignmentFormModal } from './academic-assignment-create-form';
import type {
  AcademicAssignmentRecord,
  AssignmentGradeOption,
  AssignmentLevelOption,
  AssignmentSectionOption,
  AssignmentSubjectOption,
  AssignmentTeacherOption,
} from './page';

type AcademicAssignmentsWorkspaceProps = {
  snapshot: {
    institution: {
      id: string;
      name: string;
    };
    summary: {
      assignments: number;
      withSection: number;
      linkedTeachers: number;
    };
    assignments: AcademicAssignmentRecord[];
    options: {
      teachers: AssignmentTeacherOption[];
      subjects: AssignmentSubjectOption[];
      levels: AssignmentLevelOption[];
      grades: AssignmentGradeOption[];
      sections: AssignmentSectionOption[];
    };
  } | null;
  error: string | null;
};

export function AcademicAssignmentsWorkspace({ snapshot, error }: AcademicAssignmentsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const assignments = snapshot?.assignments ?? [];
  const teachers = snapshot?.options.teachers ?? [];
  const subjects = snapshot?.options.subjects ?? [];
  const levels = snapshot?.options.levels ?? [];
  const grades = snapshot?.options.grades ?? [];
  const sections = snapshot?.options.sections ?? [];
  const totalPages = Math.max(1, Math.ceil(assignments.length / pageSize));
  const visibleAssignments = assignments.slice((page - 1) * pageSize, page * pageSize);
  const assignmentsWithoutSection = assignments.filter((assignment) => !assignment.sectionId).length;

  return (
    <>
      <div className="space-y-5">
        <WorkspacePrelude
          eyebrow="Carga docente por materia"
          title="Estado real de asignaciones académicas"
          description="La composición enfatiza cobertura docente, alcance curricular y densidad real de operación sin tocar el comportamiento del módulo."
          actions={
            <>
              <ActionButton label="Asignación" icon={Link2} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
              <span className="info-chip">{assignments.length} registradas</span>
            </>
          }
          metrics={[
            { label: 'Asignaciones', value: snapshot?.summary.assignments ?? 0, helper: 'Carga visible' },
            { label: 'Con sección', value: snapshot?.summary.withSection ?? 0, helper: 'Cobertura puntual' },
            { label: 'Docentes vinculados', value: snapshot?.summary.linkedTeachers ?? 0, helper: 'Personal asignado' },
            { label: 'Por curso', value: assignmentsWithoutSection, helper: 'Cobertura general' },
          ]}
          sideLabel="Cobertura docente"
          sideTitle="Asignaciones curriculares visibles en la institución actual"
          sideDescription="La vista resume el mismo alcance funcional y mejora la separación entre asignación puntual por sección y asignación general por curso."
          sideContent={<DetailList items={[{ label: 'Docentes visibles', value: teachers.length }, { label: 'Materias visibles', value: subjects.length }, { label: 'Secciones visibles', value: sections.length }]} />}
        />

        <DataSection
          eyebrow="Asignaciones registradas"
          title="Carga académica visible por docente y materia"
          subtitle="Tabla operativa para revisar cobertura, horas y contexto académico en una sola lectura."
          actions={
            <>
              <span className="info-chip">{assignments.length} asignaciones</span>
              <ActionButton label="Nueva" icon={Link2} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </>
          }
        >

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : assignments.length === 0 ? (
            <div className="table-empty">Todavía no hay asignaciones académicas registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1320px]">
                  <thead>
                    <tr>
                      <th>Docente</th>
                      <th>Materia</th>
                      <th>Cobertura académica</th>
                      <th>Horas</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleAssignments.map((assignment) => (
                      <tr key={assignment.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{assignment.teacherName}</p>
                          <p className="mt-1 text-sm text-slate-500">{assignment.levelName}</p>
                        </td>
                        <td>
                          <p className="font-semibold text-slate-950">{assignment.subjectName}</p>
                          <p className="mt-1 text-sm text-slate-500">{assignment.subjectCode}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{assignment.gradeName}{assignment.sectionName ? ` · ${assignment.sectionName}` : ''}</p>
                          <p className="mt-1 text-sm text-slate-500">{assignment.sectionName ? 'Asignación por sección' : 'Asignación por curso o grado'}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{assignment.weeklyHours ? `${assignment.weeklyHours} h/semana` : 'Por definir'}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{assignment.notes || 'Sin notas adicionales'}</p>
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
                totalItems={assignments.length}
                itemLabel="asignaciones"
                onPageChange={setPage}
              />
            </>
          )}
        </DataSection>
      </div>

      <AcademicAssignmentFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        teachers={teachers}
        subjects={subjects}
        levels={levels}
        grades={grades}
        sections={sections}
      />
    </>
  );
}
