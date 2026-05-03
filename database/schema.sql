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
