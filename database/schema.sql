CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS edu_institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(180) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  institution_type VARCHAR(20) NOT NULL CHECK (institution_type IN ('publica', 'privada')),
  contact_email VARCHAR(180),
  contact_phone VARCHAR(40),
  address TEXT,
  active_school_year_label VARCHAR(80),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS edu_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS edu_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID REFERENCES edu_institutions(id) ON DELETE SET NULL,
  full_name VARCHAR(180) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS edu_user_roles (
  user_id UUID NOT NULL REFERENCES edu_users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES edu_roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS edu_academic_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(40) NOT NULL,
  educational_stage VARCHAR(30) NOT NULL CHECK (educational_stage IN ('inicial', 'basica', 'bachillerato')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (institution_id, code),
  UNIQUE (institution_id, name)
);

CREATE TABLE IF NOT EXISTS edu_academic_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES edu_academic_levels(id) ON DELETE CASCADE,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(40) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (institution_id, code),
  UNIQUE (level_id, name)
);

CREATE TABLE IF NOT EXISTS edu_academic_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  grade_id UUID NOT NULL REFERENCES edu_academic_grades(id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,
  code VARCHAR(40) NOT NULL,
  shift VARCHAR(30),
  capacity INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (institution_id, code),
  UNIQUE (grade_id, name)
);

CREATE TABLE IF NOT EXISTS edu_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  full_name VARCHAR(180) NOT NULL,
  identity_document VARCHAR(40) NOT NULL,
  email VARCHAR(180),
  phone VARCHAR(40),
  specialty VARCHAR(140),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'licencia')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (institution_id, identity_document),
  UNIQUE (institution_id, email)
);

CREATE TABLE IF NOT EXISTS edu_teacher_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES edu_teachers(id) ON DELETE CASCADE,
  level_id UUID REFERENCES edu_academic_levels(id) ON DELETE CASCADE,
  grade_id UUID REFERENCES edu_academic_grades(id) ON DELETE CASCADE,
  section_id UUID REFERENCES edu_academic_sections(id) ON DELETE CASCADE,
  assignment_title VARCHAR(140) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    level_id IS NOT NULL
    OR grade_id IS NOT NULL
    OR section_id IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS edu_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES edu_academic_levels(id) ON DELETE RESTRICT,
  grade_id UUID NOT NULL REFERENCES edu_academic_grades(id) ON DELETE RESTRICT,
  section_id UUID NOT NULL REFERENCES edu_academic_sections(id) ON DELETE RESTRICT,
  full_name VARCHAR(180) NOT NULL,
  identity_document VARCHAR(40) NOT NULL,
  enrollment_code VARCHAR(40) NOT NULL,
  email VARCHAR(180),
  phone VARCHAR(40),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'retirado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (institution_id, identity_document),
  UNIQUE (institution_id, enrollment_code),
  UNIQUE (institution_id, email)
);

CREATE TABLE IF NOT EXISTS edu_user_profiles (
  user_id UUID PRIMARY KEY REFERENCES edu_users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  teacher_id UUID UNIQUE REFERENCES edu_teachers(id) ON DELETE SET NULL,
  student_id UUID UNIQUE REFERENCES edu_students(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (teacher_id IS NOT NULL OR student_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS edu_student_guardians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES edu_students(id) ON DELETE CASCADE,
  representative_user_id UUID NOT NULL REFERENCES edu_users(id) ON DELETE CASCADE,
  relationship_label VARCHAR(80) NOT NULL DEFAULT 'Representante',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, representative_user_id)
);

CREATE TABLE IF NOT EXISTS edu_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  level_id UUID REFERENCES edu_academic_levels(id) ON DELETE SET NULL,
  name VARCHAR(140) NOT NULL,
  code VARCHAR(40) NOT NULL,
  area VARCHAR(120),
  weekly_hours INTEGER CHECK (weekly_hours IS NULL OR (weekly_hours >= 1 AND weekly_hours <= 60)),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (institution_id, code),
  UNIQUE (institution_id, name)
);

CREATE TABLE IF NOT EXISTS edu_academic_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES edu_teachers(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES edu_subjects(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES edu_academic_levels(id) ON DELETE RESTRICT,
  grade_id UUID NOT NULL REFERENCES edu_academic_grades(id) ON DELETE RESTRICT,
  section_id UUID REFERENCES edu_academic_sections(id) ON DELETE RESTRICT,
  weekly_hours INTEGER CHECK (weekly_hours IS NULL OR (weekly_hours >= 1 AND weekly_hours <= 60)),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS edu_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES edu_students(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES edu_academic_sections(id) ON DELETE RESTRICT,
  school_year_label VARCHAR(80) NOT NULL,
  enrollment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, school_year_label)
 );

CREATE TABLE IF NOT EXISTS edu_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  academic_assignment_id UUID NOT NULL REFERENCES edu_academic_assignments(id) ON DELETE CASCADE,
  school_year_label VARCHAR(80) NOT NULL,
  title VARCHAR(180) NOT NULL,
  evaluation_type VARCHAR(30) NOT NULL CHECK (evaluation_type IN ('diagnostica', 'tarea', 'taller', 'prueba', 'proyecto', 'examen', 'quimestre')),
  period_label VARCHAR(80) NOT NULL,
  due_date DATE,
  max_score NUMERIC(5,2) NOT NULL CHECK (max_score > 0 AND max_score <= 100),
  weight_percentage NUMERIC(5,2) CHECK (weight_percentage IS NULL OR (weight_percentage >= 0 AND weight_percentage <= 100)),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS edu_evaluation_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  evaluation_id UUID NOT NULL REFERENCES edu_evaluations(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES edu_students(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES edu_enrollments(id) ON DELETE RESTRICT,
  score NUMERIC(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
  feedback TEXT,
  graded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (evaluation_id, student_id)
);

CREATE TABLE IF NOT EXISTS edu_attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES edu_institutions(id) ON DELETE CASCADE,
  enrollment_id UUID NOT NULL REFERENCES edu_enrollments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES edu_students(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES edu_academic_sections(id) ON DELETE RESTRICT,
  school_year_label VARCHAR(80) NOT NULL,
  attendance_date DATE NOT NULL,
  attendance_status VARCHAR(20) NOT NULL CHECK (attendance_status IN ('present', 'absent', 'late', 'justified')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (enrollment_id, attendance_date)
);
