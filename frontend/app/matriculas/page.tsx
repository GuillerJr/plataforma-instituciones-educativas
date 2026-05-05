import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { EnrollmentsWorkspace } from './enrollments-workspace';

export const dynamic = 'force-dynamic';

export type EnrollmentStatus = 'active' | 'withdrawn' | 'cancelled';

export type EnrollmentAcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
};

export type EnrollmentAcademicGrade = {
  id: string;
  levelId: string;
  levelName: string;
  name: string;
  code: string;
  sortOrder: number;
};

export type EnrollmentAcademicSection = {
  id: string;
  levelId: string;
  gradeId: string;
  levelName: string;
  gradeName: string;
  name: string;
  code: string;
  shift?: 'matutina' | 'vespertina' | null;
  capacity?: number | null;
};

export type EnrollmentStudent = {
  id: string;
  fullName: string;
  enrollmentCode: string;
  identityDocument: string;
  status: 'active' | 'inactive' | 'retirado';
  levelId: string;
  gradeId: string;
  sectionId: string;
  levelName: string;
  gradeName: string;
  sectionName: string;
};

export type EnrollmentRecord = {
  id: string;
  studentId: string;
  studentName: string;
  studentDocument: string;
  studentEnrollmentCode: string;
  sectionId: string;
  levelId: string;
  levelName: string;
  gradeId: string;
  gradeName: string;
  sectionName: string;
  schoolYearLabel: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
  notes?: string | null;
  shift?: 'matutina' | 'vespertina' | null;
  capacity?: number | null;
};

type EnrollmentsPayload = {
  institution: {
    id: string;
    name: string;
    activeSchoolYearLabel?: string | null;
  };
  summary: {
    enrollments: number;
    activeEnrollments: number;
    uniqueStudents: number;
    sectionsInUse: number;
  };
  enrollments: EnrollmentRecord[];
  students: EnrollmentStudent[];
  academicOptions: {
    levels: EnrollmentAcademicLevel[];
    grades: EnrollmentAcademicGrade[];
    sections: EnrollmentAcademicSection[];
  };
};

async function loadEnrollmentsModule() {
  try {
    const snapshot = await fetchDemoApi<EnrollmentsPayload>('/enrollments');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as EnrollmentsPayload | null, error: error.message };
    }

    return { snapshot: null as EnrollmentsPayload | null, error: 'No fue posible cargar el módulo de matrículas.' };
  }
}

export default async function MatriculasPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadEnrollmentsModule(), getCurrentUser()]);
  const nonActiveEnrollments = Math.max(0, (snapshot?.summary.enrollments ?? 0) - (snapshot?.summary.activeEnrollments ?? 0));
  const canManage = canManageAcademic(session.user);

  return (
    <main className="space-y-6">
      <section className="panel-card overflow-hidden p-5 lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-blue">Fase académica 5</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Matrículas e inscripciones enlazadas con estudiantes y secciones reales
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              El módulo registra la matrícula del periodo activo sobre una sola institución educativa y deriva automáticamente nivel y curso desde la sección elegida.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Matrículas activas</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{snapshot?.summary.activeEnrollments ?? 0}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Inscripciones vigentes para operación diaria.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Con novedad</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{nonActiveEnrollments}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Retiros o anulaciones visibles para control.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Periodo activo</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {snapshot?.institution.activeSchoolYearLabel ?? 'Sin periodo configurado'} · La matrícula actualiza la ubicación del estudiante y mantiene la trazabilidad por sección.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {canManage ? (
        <EnrollmentsWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede consultar matrículas, pero no registrar ni modificar inscripciones desde esta cuenta."
        />
      )}
    </main>
  );
}
