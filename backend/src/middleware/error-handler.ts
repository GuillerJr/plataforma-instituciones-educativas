import { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';

type PgLikeError = Error & {
  code?: string;
  constraint?: string;
  detail?: string;
};

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (error instanceof ZodError) {
    return response.status(400).json({
      success: false,
      message: error.issues[0]?.message ?? 'Datos inválidos.',
    });
  }

  const pgError = error as PgLikeError;

  if (pgError.code === '23505') {
    if (pgError.constraint?.includes('edu_institutions_slug')) {
      return response.status(409).json({ success: false, message: 'Ya existe una institución con ese slug.' });
    }

    if (pgError.constraint?.includes('edu_users_email')) {
      return response.status(409).json({ success: false, message: 'Ya existe un usuario con ese correo.' });
    }

    if (pgError.constraint?.includes('edu_teachers_institution_id_identity_document')) {
      return response.status(409).json({ success: false, message: 'Ya existe un docente con ese documento en la institución actual.' });
    }

    if (pgError.constraint?.includes('edu_teachers_institution_id_email')) {
      return response.status(409).json({ success: false, message: 'Ya existe un docente con ese correo en la institución actual.' });
    }

    if (pgError.constraint?.includes('edu_students_institution_id_identity_document')) {
      return response.status(409).json({ success: false, message: 'Ya existe un estudiante con ese documento en la institución actual.' });
    }

    if (pgError.constraint?.includes('edu_students_institution_id_enrollment_code')) {
      return response.status(409).json({ success: false, message: 'Ya existe un estudiante con ese código de matrícula en la institución actual.' });
    }

    if (pgError.constraint?.includes('edu_students_institution_id_email')) {
      return response.status(409).json({ success: false, message: 'Ya existe un estudiante con ese correo en la institución actual.' });
    }

    if (pgError.constraint?.includes('edu_enrollments_student_id_school_year_label')) {
      return response.status(409).json({ success: false, message: 'El estudiante ya tiene una matrícula registrada para el periodo escolar activo.' });
    }

    if (pgError.constraint?.includes('edu_subjects_institution_id_code')) {
      return response.status(409).json({ success: false, message: 'Ya existe una materia con ese código en la institución actual.' });
    }

    if (pgError.constraint?.includes('edu_subjects_institution_id_name')) {
      return response.status(409).json({ success: false, message: 'Ya existe una materia con ese nombre en la institución actual.' });
    }

    if (pgError.constraint?.includes('edu_evaluation_grades_evaluation_id_student_id')) {
      return response.status(409).json({ success: false, message: 'El estudiante ya tiene una calificación registrada para esa evaluación.' });
    }

    if (pgError.constraint?.includes('edu_attendance_records_enrollment_id_attendance_date')) {
      return response.status(409).json({ success: false, message: 'La matrícula ya tiene asistencia registrada para esa fecha.' });
    }

    return response.status(409).json({ success: false, message: 'Ya existe un registro con esos datos.' });
  }

  if (pgError.code === '23503') {
    return response.status(400).json({ success: false, message: 'La relación seleccionada no existe o ya no está disponible.' });
  }

  console.error(error);
  return response.status(500).json({ success: false, message: 'Error interno del servidor.' });
}
