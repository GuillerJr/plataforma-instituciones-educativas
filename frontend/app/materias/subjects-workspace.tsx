'use client';

import { useState } from 'react';
import { BookOpen, Pencil } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
import { SubjectFormModal } from './subject-create-form';
import type { SubjectAcademicLevel, SubjectRecord, SubjectStatus } from './page';

type SubjectsWorkspaceProps = {
  snapshot: {
    institution: {
      id: string;
      name: string;
    };
    summary: {
      subjects: number;
      activeSubjects: number;
      scopedSubjects: number;
    };
    subjects: SubjectRecord[];
    academicOptions: {
      levels: SubjectAcademicLevel[];
    };
  } | null;
  error: string | null;
};

export function SubjectsWorkspace({ snapshot, error }: SubjectsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectRecord | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const subjects = snapshot?.subjects ?? [];
  const levels = snapshot?.academicOptions.levels ?? [];
  const totalPages = Math.max(1, Math.ceil(subjects.length / pageSize));
  const visibleSubjects = subjects.slice((page - 1) * pageSize, page * pageSize);
  const inactiveSubjects = subjects.filter((subject) => subject.status !== 'active').length;

  return (
    <>
      <div className="space-y-5">
        <WorkspacePrelude
          eyebrow="Oferta curricular"
          title="Estado real de materias y cobertura"
          description="La vista se enfoca en disponibilidad, nivel sugerido y uso académico con una composición menos genérica y más útil para coordinación."
          actions={
            <>
              <ActionButton label="Materia" icon={BookOpen} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
              <span className="info-chip">{subjects.length} registradas</span>
            </>
          }
          metrics={[
            { label: 'Materias', value: snapshot?.summary.subjects ?? 0, helper: 'Base curricular' },
            { label: 'Activas', value: snapshot?.summary.activeSubjects ?? 0, helper: 'Disponibles hoy' },
            { label: 'Con nivel', value: snapshot?.summary.scopedSubjects ?? 0, helper: 'Cobertura definida' },
            { label: 'Sin actividad', value: inactiveSubjects, helper: 'Seguimiento pendiente' },
          ]}
          sideLabel="Cobertura curricular"
          sideTitle="Lectura rápida de materias disponibles"
          sideDescription="La base curricular conserva la misma lógica y se presenta con más claridad para revisar área, nivel y capacidad de asignación."
          sideContent={<DetailList items={[{ label: 'Niveles disponibles', value: levels.length }, { label: 'Materias activas', value: snapshot?.summary.activeSubjects ?? 0 }]} />}
        />

        <DataSection
          eyebrow="Materias registradas"
          title="Base curricular visible de la institución"
          subtitle="Tabla compacta para revisar código, área, nivel sugerido y uso académico en una sola lectura."
          actions={
            <>
              <span className="info-chip">{subjects.length} materias</span>
              <ActionButton label="Nueva" icon={BookOpen} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </>
          }
        >

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : subjects.length === 0 ? (
            <div className="table-empty">Todavía no hay materias registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1180px]">
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th>Área</th>
                      <th>Nivel</th>
                      <th>Carga referencial</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSubjects.map((subject) => (
                      <tr key={subject.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{subject.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{subject.code}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{subject.area || 'Área por definir'}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{subject.levelName || 'Aplicable a toda la institución'}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{subject.weeklyHours ? `${subject.weeklyHours} h/semana` : 'Por definir'}</p>
                          <p className="mt-1 text-sm text-slate-500">{subject.assignmentsCount} asignación(es) académica(s)</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateSubjectStatus(subject.status)}</span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <ActionButton label="Editar" icon={Pencil} onClick={() => setEditingSubject(subject)} />
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
                totalItems={subjects.length}
                itemLabel="materias"
                onPageChange={setPage}
              />
            </>
          )}
        </DataSection>
      </div>

      <SubjectFormModal open={createOpen} mode="create" onClose={() => setCreateOpen(false)} levels={levels} />
      <SubjectFormModal
        open={editingSubject !== null}
        mode="edit"
        initialValues={editingSubject ?? undefined}
        onClose={() => setEditingSubject(null)}
        levels={levels}
      />
    </>
  );
}

function translateSubjectStatus(status: SubjectStatus) {
  if (status === 'active') return 'Activa';
  return 'Inactiva';
}
