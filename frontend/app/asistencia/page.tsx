import { getCurrentUser, canWorkOnAttendance } from '../../lib/current-user';
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
      <section className="panel-card overflow-hidden rounded-[18px] border border-[#EEF1F5] bg-white p-5 shadow-soft lg:p-6">
        <div className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr] xl:items-start">
          <div>
            <span className="badge badge-success">Fase académica 7</span>
            <h1 className="mt-4 text-[24px] font-extrabold leading-tight text-ink sm:text-[28px]">
              Asistencia por fecha y sección conectada con matrículas, estudiantes y operación académica real
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-[15px]">
              El módulo registra asistencia diaria para la única institución activa, reutilizando la estructura académica y validando cada fila contra matrículas vigentes del periodo escolar.
            </p>
          </div>

          <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-line bg-brand-50/60 p-4">
              <p className="tiny-label">Asistencias</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{snapshot?.summary.records ?? 0}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Registros diarios ya trazables por sección.</p>
            </div>
            <div className="rounded-2xl border border-line bg-white p-4">
              <p className="tiny-label">Estudiantes cubiertos</p>
              <p className="mt-2 text-[28px] font-extrabold leading-none text-ink">{snapshot?.summary.studentsCovered ?? 0}</p>
              <p className="mt-2 text-xs leading-5 text-muted">Matrículas activas con seguimiento de asistencia.</p>
            </div>
            <div className="rounded-2xl border border-dashed border-line bg-[#FAFBFC] p-4 sm:col-span-2 xl:col-span-1">
              <p className="tiny-label">Cobertura diaria</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La carga diaria puede actualizar una fecha ya registrada y mantiene vínculo directo con la sección, el periodo escolar y la matrícula operativa de cada estudiante.
              </p>
            </div>
          </aside>
        </div>
      </section>

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
