'use client';

import { useState } from 'react';
import { ClipboardCheck, Pencil } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionButton } from '../../components/system-action';
import { EvaluationFormModal } from './evaluation-create-form';
import { EvaluationGradeFormModal } from './evaluation-grade-create-form';
import type {
  EvaluationAssignmentOption,
  EvaluationGradeRecord,
  EvaluationRecord,
  GradeEvaluationOption,
  GradeStudentOption,
} from './page';

type EvaluationsWorkspaceProps = {
  evaluationsSnapshot: {
    institution: {
      id: string;
      name: string;
      activeSchoolYearLabel?: string | null;
    };
    summary: {
      evaluations: number;
      sectionScoped: number;
      registeredGrades: number;
    };
    evaluations: EvaluationRecord[];
    assignments: EvaluationAssignmentOption[];
  } | null;
  evaluationsError: string | null;
  gradesSnapshot: {
    institution: {
      id: string;
      name: string;
      activeSchoolYearLabel?: string | null;
    };
    summary: {
      grades: number;
      uniqueStudents: number;
      evaluationsCovered: number;
      averageScore?: number | null;
    };
    grades: EvaluationGradeRecord[];
    options: {
      evaluations: GradeEvaluationOption[];
      students: GradeStudentOption[];
    };
  } | null;
  gradesError: string | null;
};

export function EvaluationsWorkspace({
  evaluationsSnapshot,
  evaluationsError,
  gradesSnapshot,
  gradesError,
}: EvaluationsWorkspaceProps) {
  const [createEvaluationOpen, setCreateEvaluationOpen] = useState(false);
  const [createGradeOpen, setCreateGradeOpen] = useState(false);
  const [evaluationsPage, setEvaluationsPage] = useState(1);
  const [gradesPage, setGradesPage] = useState(1);
  const evaluationsPageSize = 6;
  const gradesPageSize = 8;
  const evaluations = evaluationsSnapshot?.evaluations ?? [];
  const assignments = evaluationsSnapshot?.assignments ?? [];
  const grades = gradesSnapshot?.grades ?? [];
  const evaluationOptions = gradesSnapshot?.options.evaluations ?? [];
  const studentOptions = gradesSnapshot?.options.students ?? [];
  const totalEvaluationsPages = Math.max(1, Math.ceil(evaluations.length / evaluationsPageSize));
  const totalGradesPages = Math.max(1, Math.ceil(grades.length / gradesPageSize));
  const visibleEvaluations = evaluations.slice((evaluationsPage - 1) * evaluationsPageSize, evaluationsPage * evaluationsPageSize);
  const visibleGrades = grades.slice((gradesPage - 1) * gradesPageSize, gradesPage * gradesPageSize);
  const gradeWideEvaluations = evaluations.filter((evaluation) => !evaluation.sectionId).length;

  return (
    <>
      <div className="space-y-5">
        <WorkspacePrelude
          eyebrow="Planeación evaluativa"
          title="Estado real de evaluaciones y notas"
          description="La pantalla prioriza volumen, cobertura y rendimiento real con una jerarquía clara entre instrumentos, resultados y seguimiento del periodo."
          actions={
            <>
              <ActionButton label="Evaluación" icon={ClipboardCheck} className="w-full sm:w-auto" onClick={() => setCreateEvaluationOpen(true)} />
              <ActionButton label="Calificación" icon={Pencil} className="w-full sm:w-auto" onClick={() => setCreateGradeOpen(true)} />
            </>
          }
          metrics={[
            { label: 'Evaluaciones', value: evaluationsSnapshot?.summary.evaluations ?? 0, helper: 'Instrumentos visibles' },
            { label: 'Con sección', value: evaluationsSnapshot?.summary.sectionScoped ?? 0, helper: 'Cobertura puntual' },
            { label: 'Calificaciones', value: gradesSnapshot?.summary.grades ?? 0, helper: 'Resultados cargados' },
            { label: 'Promedio', value: gradesSnapshot?.summary.averageScore ?? 0, helper: 'Rendimiento actual' },
          ]}
          sideLabel="Seguimiento del periodo"
          sideTitle="Avance evaluativo y volumen de notas cargadas"
          sideDescription="El módulo conserva las mismas acciones y mejora la separación entre creación de instrumentos y registro de resultados."
          sideContent={<DetailList items={[{ label: 'Asignaciones visibles', value: assignments.length }, { label: 'Estudiantes evaluables', value: studentOptions.length }, { label: 'Evaluaciones por curso', value: gradeWideEvaluations }]} />}
        />

        <DataSection
          eyebrow="Evaluaciones registradas"
          title="Instrumentos activos por materia, docente y cobertura"
          subtitle="Tabla operativa para revisar periodo, puntaje, alcance y progreso de registro en una sola lectura."
          actions={
            <>
              <span className="info-chip">{evaluations.length} evaluaciones</span>
              <ActionButton label="Nueva" icon={ClipboardCheck} className="w-full sm:w-auto" onClick={() => setCreateEvaluationOpen(true)} />
            </>
          }
        >

          {evaluationsError ? (
            <div className="table-empty text-rose-700">{evaluationsError}</div>
          ) : evaluations.length === 0 ? (
            <div className="table-empty">Todavía no hay evaluaciones registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1400px]">
                  <thead>
                    <tr>
                      <th>Evaluación</th>
                      <th>Asignación base</th>
                      <th>Cobertura</th>
                      <th>Periodo</th>
                      <th>Progreso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleEvaluations.map((evaluation) => (
                      <tr key={evaluation.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{evaluation.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{translateEvaluationType(evaluation.evaluationType)} · Máximo {evaluation.maxScore}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{evaluation.subjectName} · {evaluation.subjectCode}</p>
                          <p className="mt-1 text-sm text-slate-500">{evaluation.teacherName}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{evaluation.gradeName}{evaluation.sectionName ? ` · ${evaluation.sectionName}` : ''}</p>
                          <p className="mt-1 text-sm text-slate-500">{evaluation.sectionName ? 'Cobertura por sección' : 'Cobertura por curso o grado'}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{evaluation.periodLabel}</p>
                          <p className="mt-1 text-sm text-slate-500">{evaluation.dueDate ? formatDate(evaluation.dueDate) : 'Sin fecha programada'}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{evaluation.registeredGrades} calificaciones</p>
                          <p className="mt-1 text-sm text-slate-500">{evaluation.weightPercentage ? `${evaluation.weightPercentage}% del periodo` : 'Peso por definir'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={evaluationsPage}
                totalPages={totalEvaluationsPages}
                pageSize={evaluationsPageSize}
                totalItems={evaluations.length}
                itemLabel="evaluaciones"
                onPageChange={setEvaluationsPage}
              />
            </>
          )}
        </DataSection>

        <DataSection
          eyebrow="Calificaciones registradas"
          title="Notas por evaluación y estudiante matriculado"
          subtitle="Seguimiento de rendimiento con trazabilidad de materia, cobertura académica y retroalimentación visible."
          actions={
            <>
              <span className="info-chip">{grades.length} calificaciones</span>
              <span className="info-chip">{gradeWideEvaluations} evaluaciones por curso</span>
              <ActionButton label="Notas" icon={Pencil} className="w-full sm:w-auto" onClick={() => setCreateGradeOpen(true)} />
            </>
          }
        >

          {gradesError ? (
            <div className="table-empty text-rose-700">{gradesError}</div>
          ) : grades.length === 0 ? (
            <div className="table-empty">Todavía no hay calificaciones registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1520px]">
                  <thead>
                    <tr>
                      <th>Estudiante</th>
                      <th>Evaluación</th>
                      <th>Materia y docente</th>
                      <th>Resultado</th>
                      <th>Retroalimentación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleGrades.map((grade) => (
                      <tr key={grade.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{grade.studentName}</p>
                          <p className="mt-1 text-sm text-slate-500">{grade.studentDocument} · {grade.studentEnrollmentCode}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{grade.evaluationTitle}</p>
                          <p className="mt-1 text-sm text-slate-500">{translateEvaluationType(grade.evaluationType)} · {grade.periodLabel}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{grade.subjectName} · {grade.subjectCode}</p>
                          <p className="mt-1 text-sm text-slate-500">{grade.teacherName} · {grade.gradeName}{grade.sectionName ? ` · ${grade.sectionName}` : ''}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{grade.score} / {grade.maxScore}</p>
                          <p className="mt-1 text-sm text-slate-500">Registrada el {formatDate(grade.gradedAt)}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{grade.feedback || 'Sin retroalimentación adicional.'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={gradesPage}
                totalPages={totalGradesPages}
                pageSize={gradesPageSize}
                totalItems={grades.length}
                itemLabel="calificaciones"
                onPageChange={setGradesPage}
              />
            </>
          )}
        </DataSection>
      </div>

      <EvaluationFormModal
        open={createEvaluationOpen}
        onClose={() => setCreateEvaluationOpen(false)}
        assignments={assignments}
      />

      <EvaluationGradeFormModal
        open={createGradeOpen}
        onClose={() => setCreateGradeOpen(false)}
        evaluations={evaluationOptions}
        students={studentOptions}
      />
    </>
  );
}

function translateEvaluationType(value: EvaluationRecord['evaluationType']) {
  if (value === 'diagnostica') return 'Diagnóstica';
  if (value === 'tarea') return 'Tarea';
  if (value === 'taller') return 'Taller';
  if (value === 'prueba') return 'Prueba';
  if (value === 'proyecto') return 'Proyecto';
  if (value === 'examen') return 'Examen';
  return 'Quimestre';
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}
