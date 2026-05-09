import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.js';
import systemRoutes from './routes/system.routes.js';
import institutionsRoutes from './routes/institutions.routes.js';
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import academicStructureRoutes from './routes/academic-structure.routes.js';
import teachersRoutes from './routes/teachers.routes.js';
import studentsRoutes from './routes/students.routes.js';
import enrollmentsRoutes from './routes/enrollments.routes.js';
import subjectsRoutes from './routes/subjects.routes.js';
import academicAssignmentsRoutes from './routes/academic-assignments.routes.js';
import evaluationsRoutes from './routes/evaluations.routes.js';
import evaluationGradesRoutes from './routes/evaluation-grades.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import publicRequestsRoutes from './routes/public-requests.routes.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/', (_request, response) => {
    return response.json({ success: true, message: 'Educa API online' });
  });

  app.use('/api/system', systemRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/institutions', institutionsRoutes);
  app.use('/api/users', usersRoutes);
  app.use('/api/academic-structure', academicStructureRoutes);
  app.use('/api/teachers', teachersRoutes);
  app.use('/api/students', studentsRoutes);
  app.use('/api/enrollments', enrollmentsRoutes);
  app.use('/api/subjects', subjectsRoutes);
  app.use('/api/academic-assignments', academicAssignmentsRoutes);
  app.use('/api/evaluations', evaluationsRoutes);
  app.use('/api/evaluation-grades', evaluationGradesRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/public-requests', publicRequestsRoutes);
  app.use(errorHandler);

  return app;
}
