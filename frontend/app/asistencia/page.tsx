import { getCurrentUser, canWorkOnAttendance } from '../../lib/current-user';
import { PageHero } from '../../components/admin-ui';
import { ModuleAccessGuard } from '../../components/module-access-guard';
import { DemoApiError, fetchDemoApi } from '../lib/demo-api';
import { AttendanceWorkspace } from './attendance-workspace';

export const dynamic = 'force-dynamic';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'justified';

export type AttendanceAcademicLevel = {
  id: string;
  name: string;
  code: string;
  educationalStage: 'inicial' | 'basica' | 'bachillerato';
  sortOrder: number;
};

export type AttendanceAcademicGrade = {
  id: string;
  levelId: string;
  levelName: string;
  name: string;
  code: string;
  sortOrder: number;
};

export type AttendanceAcademicSection = {
  id: string;
  levelId: string;
  gradeId: string;
  levelName: string;
  gradeName: string;
  name: string;
  code: string;
  shift?: 'matutina' | 'vespertina' | null;
  capacity?: number | null;
  activeEnrollments: number;
};

export type AttendanceEnrollmentOption = {
  enrollmentId: string;
  studentId: string;
  sectionId: string;
  schoolYearLabel: string;
  enrollmentDate: string;
  studentName: string;
  studentDocument: string;
  studentEnrollmentCode: string;
  levelId: string;
  levelName: string;
  gradeId: string;
  gradeName: string;
  sectionName: string;
};

export type AttendanceRecord = {
  id: string;
  enrollmentId: string;
  studentId: string;
  sectionId: string;
  schoolYearLabel: string;
  attendanceDate: string;
  status: AttendanceStatus;
  notes?: string | null;
  createdAt: string;
  studentName: string;
  studentDocument: string;
  studentEnrollmentCode: string;
  levelId: string;
  levelName: string;
  gradeId: string;
  gradeName: string;
  sectionName: string;
  shift?: 'matutina' | 'vespertina' | null;
};

type AttendancePayload = {
  institution: {
    id: string;
    name: string;
    activeSchoolYearLabel?: string | null;
  };
  summary: {
    records: number;
    present: number;
    absent: number;
    late: number;
    justified: number;
    studentsCovered: number;
    sectionsCovered: number;
    trackedDates: number;
  };
  records: AttendanceRecord[];
  options: {
    levels: AttendanceAcademicLevel[];
    grades: AttendanceAcademicGrade[];
    sections: AttendanceAcademicSection[];
    enrollments: AttendanceEnrollmentOption[];
  };
};

async function loadAttendanceModule() {
  try {
    const snapshot = await fetchDemoApi<AttendancePayload>('/attendance');
    return { snapshot, error: null };
  } catch (error) {
    if (error instanceof DemoApiError) {
      return { snapshot: null as AttendancePayload | null, error: error.message };
    }

    return { snapshot: null as AttendancePayload | null, error: 'No fue posible cargar el módulo de asistencia.' };
  }
}

export default async function AsistenciaPage() {
  const [{ snapshot, error }, session] = await Promise.all([loadAttendanceModule(), getCurrentUser()]);
  const canManage = canWorkOnAttendance(session.user);

  return (
    <main className="space-y-6">
      <PageHero
        badge="Asistencia"
        title="Asistencia por fecha y sección conectada con matrículas, estudiantes y operación académica real"
        description="La experiencia mantiene la carga diaria existente y mejora la lectura de cobertura, filtros y seguimiento por fecha o sección."
        metrics={[
          { label: 'Asistencias', value: snapshot?.summary.records ?? 0, helper: 'Registros diarios ya trazables por sección.' },
          { label: 'Estudiantes cubiertos', value: snapshot?.summary.studentsCovered ?? 0, helper: 'Matrículas activas con seguimiento de asistencia.' },
        ]}
        noteTitle="Seguimiento diario"
        noteDescription="La carga diaria mantiene vínculo directo con sección, periodo escolar y matrícula operativa de cada estudiante."
      />

      {canManage ? (
        <AttendanceWorkspace snapshot={snapshot} error={error} />
      ) : (
        <ModuleAccessGuard
          allowed={false}
          fallback="Tu perfil puede revisar asistencia, pero no registrar ni modificar tomas diarias desde esta cuenta."
        />
      )}
    </main>
  );
}
