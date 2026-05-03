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
  const { snapshot, error } = await loadAttendanceModule();

  return (
    <main className="page-main">
      <section className="hero-panel">
        <div className="hero-grid">
          <div>
            <p className="eyebrow">Fase académica 7</p>
            <h1 className="section-title mt-3">Asistencia por fecha y sección conectada con matrículas, estudiantes y operación académica real</h1>
            <p className="section-copy mt-4 max-w-3xl">
              El módulo registra asistencia diaria para la única institución activa, reutilizando la estructura académica y validando cada fila contra matrículas vigentes del periodo escolar.
            </p>
          </div>
          <aside className="side-note-card">
            <div className="summary-strip xl:grid-cols-2">
              <div className="summary-item">
                <p className="summary-label">Asistencias</p>
                <p className="summary-value">{snapshot?.summary.records ?? 0}</p>
                <p className="mt-1 text-sm text-slate-500">Registros diarios ya trazables por sección.</p>
              </div>
              <div className="summary-item">
                <p className="summary-label">Estudiantes cubiertos</p>
                <p className="summary-value">{snapshot?.summary.studentsCovered ?? 0}</p>
                <p className="mt-1 text-sm text-slate-500">Matrículas activas con seguimiento de asistencia.</p>
              </div>
            </div>
            <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Cobertura diaria</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La carga diaria puede actualizar una fecha ya registrada y mantiene vínculo directo con la sección, el periodo escolar y la matrícula operativa de cada estudiante.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <AttendanceWorkspace snapshot={snapshot} error={error} />
    </main>
  );
}
