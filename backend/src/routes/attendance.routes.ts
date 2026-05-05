import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/require-auth.js';
import { successResponse } from '../utils/api.js';
import { canReadAcademic, canWorkOnAttendance } from '../utils/access-control.js';
import { appendRepresentativeScope, appendStudentScope, appendTeacherAssignmentScope, resolveAcademicIdentityScope } from '../utils/profile-academic-filters.js';

const router = Router();

const attendanceStatusSchema = z.enum(['present', 'absent', 'late', 'justified']);

const attendanceBatchSchema = z.object({
  sectionId: z.string().uuid(),
  attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  entries: z.array(z.object({
    enrollmentId: z.string().uuid(),
    status: attendanceStatusSchema,
    notes: z.string().max(500).optional().or(z.literal('')),
  })).min(1).max(80),
});

async function resolveInstitutionId(preferredInstitutionId?: string | null) {
  if (preferredInstitutionId) {
    const institution = await pool.query(
      `
        SELECT id, name, active_school_year_label AS "activeSchoolYearLabel"
        FROM edu_institutions
        WHERE id = $1
        LIMIT 1
      `,
      [preferredInstitutionId],
    );

    if (institution.rows[0]) {
      return institution.rows[0] as { id: string; name: string; activeSchoolYearLabel?: string | null };
    }
  }

  const fallback = await pool.query(
    `
      SELECT id, name, active_school_year_label AS "activeSchoolYearLabel"
      FROM edu_institutions
      ORDER BY created_at ASC
      LIMIT 1
    `,
  );

  if (!fallback.rows[0]) {
    throw new Error('No hay una institución base configurada.');
  }

  return fallback.rows[0] as { id: string; name: string; activeSchoolYearLabel?: string | null };
}

router.get('/', requireAuth, async (request, response) => {
  if (!canReadAcademic(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para consultar asistencia.' });
  }

  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const scope = await resolveAcademicIdentityScope(request.auth, institution.id);
  const recordConditions = ['ar.institution_id = $1'];
  const recordValues: Array<string | string[]> = [institution.id];

  appendStudentScope(scope, recordConditions, recordValues, 'ar.student_id');
  appendRepresentativeScope(scope, recordConditions, recordValues, 'ar.student_id');

  const [recordsResult, levelsResult, gradesResult, sectionsResult, enrollmentsResult] = await Promise.all([
    pool.query(
      `
        SELECT
          ar.id,
          ar.enrollment_id AS "enrollmentId",
          ar.student_id AS "studentId",
          ar.section_id AS "sectionId",
          ar.school_year_label AS "schoolYearLabel",
          ar.attendance_date AS "attendanceDate",
          ar.attendance_status AS "status",
          ar.notes,
          ar.created_at AS "createdAt",
          st.full_name AS "studentName",
          st.identity_document AS "studentDocument",
          st.enrollment_code AS "studentEnrollmentCode",
          l.id AS "levelId",
          l.name AS "levelName",
          g.id AS "gradeId",
          g.name AS "gradeName",
          s.name AS "sectionName",
          s.shift
        FROM edu_attendance_records ar
        INNER JOIN edu_students st ON st.id = ar.student_id
        INNER JOIN edu_academic_sections s ON s.id = ar.section_id
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE ${recordConditions.join(' AND ')}
        ORDER BY ar.attendance_date DESC, l.sort_order ASC, g.sort_order ASC, s.name ASC, st.full_name ASC
      `,
      recordValues,
    ),
    pool.query(
      `
        SELECT
          id,
          name,
          code,
          educational_stage AS "educationalStage",
          sort_order AS "sortOrder"
        FROM edu_academic_levels
        WHERE institution_id = $1
        ORDER BY sort_order ASC, created_at ASC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          g.id,
          g.level_id AS "levelId",
          l.name AS "levelName",
          g.name,
          g.code,
          g.sort_order AS "sortOrder"
        FROM edu_academic_grades g
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE g.institution_id = $1
        ORDER BY l.sort_order ASC, g.sort_order ASC, g.created_at ASC
      `,
      [institution.id],
    ),
    pool.query(
      `
        SELECT
          s.id,
          s.grade_id AS "gradeId",
          g.level_id AS "levelId",
          l.name AS "levelName",
          g.name AS "gradeName",
          s.name,
          s.code,
          s.shift,
          s.capacity,
          COUNT(e.id) FILTER (WHERE e.status = 'active' AND e.school_year_label = $2)::int AS "activeEnrollments"
        FROM edu_academic_sections s
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        LEFT JOIN edu_enrollments e ON e.section_id = s.id AND e.institution_id = s.institution_id
        LEFT JOIN edu_academic_assignments aa ON aa.section_id = s.id
        WHERE s.institution_id = $1
          AND ($3::boolean = FALSE OR aa.teacher_id = $4::uuid)
        GROUP BY s.id, g.level_id, l.name, g.name
        ORDER BY l.sort_order ASC, g.sort_order ASC, s.name ASC, s.created_at ASC
      `,
      [institution.id, institution.activeSchoolYearLabel?.trim() || new Date().getFullYear().toString(), scope.isTeacher && Boolean(scope.teacherId) && !scope.isGlobalScope, scope.teacherId ?? null],
    ),
    pool.query(
      `
        SELECT
          e.id AS "enrollmentId",
          e.student_id AS "studentId",
          e.section_id AS "sectionId",
          e.school_year_label AS "schoolYearLabel",
          e.enrollment_date AS "enrollmentDate",
          st.full_name AS "studentName",
          st.identity_document AS "studentDocument",
          st.enrollment_code AS "studentEnrollmentCode",
          l.id AS "levelId",
          l.name AS "levelName",
          g.id AS "gradeId",
          g.name AS "gradeName",
          s.name AS "sectionName"
        FROM edu_enrollments e
        INNER JOIN edu_students st ON st.id = e.student_id
        INNER JOIN edu_academic_sections s ON s.id = e.section_id
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        LEFT JOIN edu_academic_assignments aa ON aa.section_id = e.section_id
        WHERE e.institution_id = $1
          AND e.status = 'active'
          AND e.school_year_label = $2
          AND (
            $3::boolean = TRUE
            OR ($4::boolean = TRUE AND aa.teacher_id = $5::uuid)
            OR ($6::boolean = TRUE AND st.id = $7::uuid)
            OR ($8::boolean = TRUE AND st.id = ANY($9::uuid[]))
            OR ($10::boolean = FALSE AND $11::boolean = FALSE AND $12::boolean = FALSE)
          )
        ORDER BY l.sort_order ASC, g.sort_order ASC, s.name ASC, st.full_name ASC
      `,
      [
        institution.id,
        institution.activeSchoolYearLabel?.trim() || new Date().getFullYear().toString(),
        scope.isGlobalScope,
        scope.isTeacher && Boolean(scope.teacherId),
        scope.teacherId ?? null,
        scope.isStudent && Boolean(scope.studentId),
        scope.studentId ?? null,
        scope.isRepresentative && scope.representativeStudentIds.length > 0,
        scope.representativeStudentIds,
        scope.isTeacher,
        scope.isStudent,
        scope.isRepresentative,
      ],
    ),
  ]);

  const summary = {
    records: recordsResult.rows.length,
    present: recordsResult.rows.filter((row) => row.status === 'present').length,
    absent: recordsResult.rows.filter((row) => row.status === 'absent').length,
    late: recordsResult.rows.filter((row) => row.status === 'late').length,
    justified: recordsResult.rows.filter((row) => row.status === 'justified').length,
    studentsCovered: new Set(recordsResult.rows.map((row) => row.studentId as string)).size,
    sectionsCovered: new Set(recordsResult.rows.map((row) => row.sectionId as string)).size,
    trackedDates: new Set(recordsResult.rows.map((row) => row.attendanceDate as string)).size,
  };

  return response.json(successResponse('Asistencia cargada.', {
    institution,
    summary,
    records: recordsResult.rows,
    options: {
      levels: levelsResult.rows,
      grades: gradesResult.rows,
      sections: sectionsResult.rows,
      enrollments: enrollmentsResult.rows,
    },
  }));
});

router.post('/', requireAuth, async (request, response) => {
  if (!canWorkOnAttendance(request.auth?.roleCodes)) {
    return response.status(403).json({ success: false, message: 'No tienes permisos para registrar asistencia.' });
  }

  const payload = attendanceBatchSchema.parse(request.body);
  const institution = await resolveInstitutionId(request.auth?.institutionId);
  const schoolYearLabel = institution.activeSchoolYearLabel?.trim() || new Date().getFullYear().toString();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const sectionResult = await client.query(
      `
        SELECT
          s.id,
          s.name,
          g.id AS "gradeId",
          g.name AS "gradeName",
          l.name AS "levelName"
        FROM edu_academic_sections s
        INNER JOIN edu_academic_grades g ON g.id = s.grade_id
        INNER JOIN edu_academic_levels l ON l.id = g.level_id
        WHERE s.id = $1 AND s.institution_id = $2
        LIMIT 1
      `,
      [payload.sectionId, institution.id],
    );

    const section = sectionResult.rows[0] as {
      id: string;
      name: string;
      gradeId: string;
      gradeName: string;
      levelName: string;
    } | undefined;

    if (!section) {
      throw new Error('La sección seleccionada no existe en la institución actual.');
    }

    const duplicates = new Set<string>();
    for (const entry of payload.entries) {
      if (duplicates.has(entry.enrollmentId)) {
        throw new Error('No puede repetir la misma matrícula dentro del mismo registro de asistencia.');
      }

      duplicates.add(entry.enrollmentId);
    }

    const eligibleEnrollmentsResult = await client.query(
      `
        SELECT
          e.id AS "enrollmentId",
          e.student_id AS "studentId",
          e.section_id AS "sectionId",
          st.full_name AS "studentName",
          st.enrollment_code AS "studentEnrollmentCode"
        FROM edu_enrollments e
        INNER JOIN edu_students st ON st.id = e.student_id
        WHERE e.institution_id = $1
          AND e.section_id = $2
          AND e.school_year_label = $3
          AND e.status = 'active'
      `,
      [institution.id, payload.sectionId, schoolYearLabel],
    );

    const eligibleEnrollments = new Map(
      eligibleEnrollmentsResult.rows.map((row) => [
        row.enrollmentId as string,
        row as {
          enrollmentId: string;
          studentId: string;
          sectionId: string;
          studentName: string;
          studentEnrollmentCode: string;
        },
      ]),
    );

    if (eligibleEnrollments.size === 0) {
      throw new Error('La sección seleccionada no tiene matrículas activas en el periodo escolar vigente.');
    }

    for (const entry of payload.entries) {
      if (!eligibleEnrollments.has(entry.enrollmentId)) {
        throw new Error('Una o más matrículas no pertenecen a la sección activa seleccionada.');
      }
    }

    const values: Array<string | null> = [];
    const placeholders = payload.entries.map((entry, index) => {
      const start = index * 8;
      const enrollment = eligibleEnrollments.get(entry.enrollmentId)!;

      values.push(
        institution.id,
        enrollment.enrollmentId,
        enrollment.studentId,
        payload.sectionId,
        schoolYearLabel,
        payload.attendanceDate,
        entry.status,
        entry.notes?.trim() || null,
      );

      return `($${start + 1}, $${start + 2}, $${start + 3}, $${start + 4}, $${start + 5}, $${start + 6}, $${start + 7}, $${start + 8})`;
    });

    const result = await client.query(
      `
        INSERT INTO edu_attendance_records (
          institution_id,
          enrollment_id,
          student_id,
          section_id,
          school_year_label,
          attendance_date,
          attendance_status,
          notes
        ) VALUES ${placeholders.join(', ')}
        ON CONFLICT (enrollment_id, attendance_date)
        DO UPDATE SET
          attendance_status = EXCLUDED.attendance_status,
          notes = EXCLUDED.notes,
          section_id = EXCLUDED.section_id,
          school_year_label = EXCLUDED.school_year_label,
          updated_at = NOW()
        RETURNING id
      `,
      values,
    );

    await client.query('COMMIT');

    return response.status(201).json(successResponse('Asistencia registrada.', {
      section,
      attendanceDate: payload.attendanceDate,
      schoolYearLabel,
      recordsSaved: result.rows.length,
    }));
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
});

export default router;
