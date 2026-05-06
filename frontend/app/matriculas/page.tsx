import { getCurrentUser, canManageAcademic } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
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
      <PageHero
        badge="Matrículas"
        title="Matrículas e inscripciones enlazadas con estudiantes, periodos y secciones reales"
        description="La experiencia conserva la lógica del periodo activo y mejora la lectura de estado, trazabilidad y ubicación académica de cada inscripción."
        metrics={[
          { label: 'Matrículas activas', value: snapshot?.summary.activeEnrollments ?? 0, helper: 'Inscripciones vigentes para operación diaria.' },
          { label: 'Con novedad', value: nonActiveEnrollments, helper: 'Retiros o anulaciones visibles para control.' },
        ]}
        noteTitle="Trazabilidad"
        noteDescription={`${snapshot?.institution.activeSchoolYearLabel ?? 'Sin periodo configurado'} · La matrícula mantiene la relación con estudiante, sección y periodo escolar actual.`}
      />

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
