INSERT INTO edu_roles (code, name, is_system)
VALUES
('superadmin', 'Superadministrador', TRUE),
('admin_institucional', 'Administrador institucional', TRUE),
('docente', 'Docente', TRUE),
('estudiante', 'Estudiante', TRUE),
('representante', 'Representante', TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO edu_institutions (
  id,
  name,
  slug,
  institution_type,
  contact_email,
  contact_phone,
  address,
  active_school_year_label
)
VALUES (
  '10000000-0000-0000-0000-000000000001',
  'Unidad Educativa Demo Educa',
  'unidad-educativa-demo-educa',
  'privada',
  'info@educa.demo',
  '+593000000000',
  'Quito, Ecuador',
  '2026-2027'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO edu_users (
  id,
  institution_id,
  full_name,
  email,
  password_hash,
  status
)
VALUES (
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Guiller JR',
  'admin@educa.local',
  crypt('Educa2026!', gen_salt('bf')),
  'active'
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO edu_user_roles (user_id, role_id)
SELECT '20000000-0000-0000-0000-000000000001', r.id
FROM edu_roles r
WHERE r.code = 'superadmin'
ON CONFLICT DO NOTHING;

INSERT INTO edu_academic_levels (id, institution_id, name, code, educational_stage, sort_order)
VALUES
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Inicial', 'INI', 'inicial', 1),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Educación General Básica', 'EGB', 'basica', 2),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Bachillerato General Unificado', 'BGU', 'bachillerato', 3)
ON CONFLICT (institution_id, code) DO NOTHING;

INSERT INTO edu_academic_grades (id, institution_id, level_id, name, code, sort_order)
VALUES
  ('31000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Inicial 1', 'INI1', 1),
  ('31000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'Inicial 2', 'INI2', 2),
  ('31000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Primero de EGB', 'EGB1', 1),
  ('31000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Séptimo de EGB', 'EGB7', 7),
  ('31000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'Primero de BGU', 'BGU1', 1),
  ('31000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003', 'Tercero de BGU', 'BGU3', 3)
ON CONFLICT (institution_id, code) DO NOTHING;

INSERT INTO edu_academic_sections (id, institution_id, grade_id, name, code, shift, capacity)
VALUES
  ('32000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000001', 'A', 'INI1-A', 'matutina', 20),
  ('32000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000002', 'A', 'INI2-A', 'matutina', 25),
  ('32000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000003', 'A', 'EGB1-A', 'matutina', 32),
  ('32000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000003', 'B', 'EGB1-B', 'vespertina', 30),
  ('32000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000004', 'A', 'EGB7-A', 'matutina', 34),
  ('32000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000005', 'A', 'BGU1-A', 'matutina', 36),
  ('32000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000005', 'B', 'BGU1-B', 'vespertina', 35),
  ('32000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', '31000000-0000-0000-0000-000000000006', 'A', 'BGU3-A', 'matutina', 38)
ON CONFLICT (institution_id, code) DO NOTHING;

INSERT INTO edu_teachers (
  id,
  institution_id,
  full_name,
  identity_document,
  email,
  phone,
  specialty,
  status
)
VALUES
  ('33000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Mariana Pérez', 'DOC-001', 'mariana.perez@educa.demo', '+593111111111', 'Lengua y Literatura', 'active'),
  ('33000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Carlos Andrade', 'DOC-002', 'carlos.andrade@educa.demo', '+593222222222', 'Matemática', 'active'),
  ('33000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Lucía Naranjo', 'DOC-003', 'lucia.naranjo@educa.demo', '+593333333333', 'Inicial', 'licencia')
ON CONFLICT (institution_id, identity_document) DO NOTHING;

INSERT INTO edu_teacher_assignments (
  id,
  institution_id,
  teacher_id,
  level_id,
  grade_id,
  section_id,
  assignment_title,
  notes
)
VALUES
  (
    '34000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '33000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    '31000000-0000-0000-0000-000000000004',
    '32000000-0000-0000-0000-000000000005',
    'Tutora de sección',
    'Responsable del seguimiento académico y convivencia de Séptimo de EGB A.'
  ),
  (
    '34000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '33000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000003',
    '31000000-0000-0000-0000-000000000005',
    NULL,
    'Docente de área',
    'Carga principal para Primero de BGU en jornada matutina y vespertina.'
  ),
  (
    '34000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '33000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000001',
    NULL,
    NULL,
    'Coordinación de nivel',
    'Acompañamiento académico del nivel Inicial.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO edu_students (
  id,
  institution_id,
  level_id,
  grade_id,
  section_id,
  full_name,
  identity_document,
  enrollment_code,
  email,
  phone,
  status
)
VALUES
  (
    '35000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    '31000000-0000-0000-0000-000000000003',
    '32000000-0000-0000-0000-000000000003',
    'Sofía Cárdenas',
    'EST-001',
    'MAT-2026-001',
    'sofia.cardenas@familia.demo',
    '+593444444441',
    'active'
  ),
  (
    '35000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    '31000000-0000-0000-0000-000000000003',
    '32000000-0000-0000-0000-000000000004',
    'Mateo Villacrés',
    'EST-002',
    'MAT-2026-002',
    'mateo.villacres@familia.demo',
    '+593444444442',
    'active'
  ),
  (
    '35000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003',
    '31000000-0000-0000-0000-000000000005',
    '32000000-0000-0000-0000-000000000006',
    'Valentina Rojas',
    'EST-003',
    'MAT-2026-003',
    'valentina.rojas@familia.demo',
    '+593444444443',
    'inactive'
  )
ON CONFLICT (institution_id, identity_document) DO NOTHING;

INSERT INTO edu_subjects (
  id,
  institution_id,
  level_id,
  name,
  code,
  area,
  weekly_hours,
  status
)
VALUES
  (
    '36000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    'Matemática',
    'MAT',
    'Ciencias exactas',
    6,
    'active'
  ),
  (
    '36000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    'Lengua y Literatura',
    'LEN',
    'Comunicación',
    5,
    'active'
  ),
  (
    '36000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003',
    'Biología',
    'BIO',
    'Ciencias naturales',
    4,
    'active'
  ),
  (
    '36000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    'Expresión Artística',
    'ART',
    'Expresión y creatividad',
    3,
    'active'
  )
ON CONFLICT (institution_id, code) DO NOTHING;

INSERT INTO edu_academic_assignments (
  id,
  institution_id,
  teacher_id,
  subject_id,
  level_id,
  grade_id,
  section_id,
  weekly_hours,
  notes
)
VALUES
  (
    '37000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '33000000-0000-0000-0000-000000000002',
    '36000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000003',
    '31000000-0000-0000-0000-000000000005',
    '32000000-0000-0000-0000-000000000006',
    8,
    'Carga principal de Matemática para Primero de BGU A.'
  ),
  (
    '37000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '33000000-0000-0000-0000-000000000001',
    '36000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    '31000000-0000-0000-0000-000000000004',
    '32000000-0000-0000-0000-000000000005',
    6,
    'Lengua y Literatura para Séptimo de EGB A.'
  ),
  (
    '37000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '33000000-0000-0000-0000-000000000003',
    '36000000-0000-0000-0000-000000000004',
    '30000000-0000-0000-0000-000000000001',
    '31000000-0000-0000-0000-000000000002',
    NULL,
    3,
    'Cobertura artística para Inicial 2 en sus paralelos activos.'
  ),
  (
    '37000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000001',
    '33000000-0000-0000-0000-000000000002',
    '36000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000002',
    '31000000-0000-0000-0000-000000000003',
    NULL,
    6,
    'Matemática general para Primero de EGB en sus paralelos activos.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO edu_enrollments (
  id,
  institution_id,
  student_id,
  section_id,
  school_year_label,
  enrollment_date,
  status,
  notes
)
VALUES
  (
    '38000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '35000000-0000-0000-0000-000000000001',
    '32000000-0000-0000-0000-000000000003',
    '2026-2027',
    DATE '2026-09-02',
    'active',
    'Matrícula ordinaria confirmada para Primero de EGB A.'
  ),
  (
    '38000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '35000000-0000-0000-0000-000000000002',
    '32000000-0000-0000-0000-000000000004',
    '2026-2027',
    DATE '2026-09-03',
    'active',
    'Matrícula validada para la jornada vespertina de Primero de EGB B.'
  ),
  (
    '38000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '35000000-0000-0000-0000-000000000003',
    '32000000-0000-0000-0000-000000000006',
    '2026-2027',
    DATE '2026-09-04',
    'withdrawn',
    'Retiro registrado luego de cambio de institución durante el primer quimestre.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO edu_evaluations (
  id,
  institution_id,
  academic_assignment_id,
  school_year_label,
  title,
  evaluation_type,
  period_label,
  due_date,
  max_score,
  weight_percentage,
  description
)
VALUES
  (
    '39000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '37000000-0000-0000-0000-000000000004',
    '2026-2027',
    'Diagnóstico inicial de Matemática',
    'diagnostica',
    'Primer parcial',
    DATE '2026-09-15',
    10,
    10,
    'Punto de partida para medir comprensión numérica de Primero de EGB.'
  ),
  (
    '39000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '37000000-0000-0000-0000-000000000002',
    '2026-2027',
    'Ensayo de lectura crítica',
    'taller',
    'Primer quimestre',
    DATE '2026-10-03',
    10,
    15,
    'Actividad escrita para Lengua y Literatura en Séptimo de EGB A.'
  ),
  (
    '39000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '37000000-0000-0000-0000-000000000001',
    '2026-2027',
    'Prueba corta de funciones',
    'prueba',
    'Primer parcial',
    DATE '2026-09-28',
    20,
    20,
    'Verificación rápida sobre funciones y expresiones algebraicas en BGU.'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO edu_evaluation_grades (
  id,
  institution_id,
  evaluation_id,
  student_id,
  enrollment_id,
  score,
  feedback,
  graded_at
)
VALUES
  (
    '39500000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '39000000-0000-0000-0000-000000000001',
    '35000000-0000-0000-0000-000000000001',
    '38000000-0000-0000-0000-000000000001',
    8.75,
    'Buen dominio de secuencias y conteo. Reforzar problemas verbales.',
    DATE '2026-09-16'
  ),
  (
    '39500000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '39000000-0000-0000-0000-000000000001',
    '35000000-0000-0000-0000-000000000002',
    '38000000-0000-0000-0000-000000000002',
    9.2,
    'Participación sólida y resolución correcta en la mayoría de ejercicios.',
    DATE '2026-09-16'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO edu_attendance_records (
  id,
  institution_id,
  enrollment_id,
  student_id,
  section_id,
  school_year_label,
  attendance_date,
  attendance_status,
  notes
)
VALUES
  (
    '39600000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '38000000-0000-0000-0000-000000000001',
    '35000000-0000-0000-0000-000000000001',
    '32000000-0000-0000-0000-000000000003',
    '2026-2027',
    DATE '2026-09-17',
    'present',
    'Ingreso puntual y participación activa en la primera hora.'
  ),
  (
    '39600000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    '38000000-0000-0000-0000-000000000002',
    '35000000-0000-0000-0000-000000000002',
    '32000000-0000-0000-0000-000000000004',
    '2026-2027',
    DATE '2026-09-17',
    'late',
    'Llegada con diez minutos de retraso por transporte escolar.'
  ),
  (
    '39600000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000001',
    '38000000-0000-0000-0000-000000000001',
    '35000000-0000-0000-0000-000000000001',
    '32000000-0000-0000-0000-000000000003',
    '2026-2027',
    DATE '2026-09-18',
    'justified',
    'Permiso médico informado por representante y validado por coordinación.'
  )
ON CONFLICT (id) DO NOTHING;
