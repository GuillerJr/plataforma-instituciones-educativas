'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const modules = [
  'Usuarios',
  'Instituciones',
  'Estudiantes',
  'Docentes',
  'Materias',
  'Matrículas',
  'Asignaciones',
  'Estructura',
  'Evaluaciones',
  'Calificaciones',
  'Asistencia',
];

const areas = [
  ['Comunidad', 'Estudiantes y representantes', 'La institución acompaña el proceso escolar con datos de matrícula, seguimiento académico y solicitudes de acceso.'],
  ['Docencia', 'Equipo docente', 'Los docentes sostienen la planificación, la carga de asistencia, las evaluaciones y las calificaciones asignadas.'],
  ['Academia', 'Materias y asignaciones', 'Cada periodo relaciona materias, cursos, secciones y docentes para mantener una organización académica consistente.'],
  ['Estructura', 'Niveles, grados y secciones', 'Inicial, primaria y media se ordenan por grados, secciones y periodos de trabajo institucional.'],
  ['Evaluación', 'Calificaciones', 'El colegio registra evaluaciones y resultados para que la trayectoria del estudiante sea consultable y trazable.'],
  ['Asistencia', 'Jornada diaria', 'El registro de asistencia permite acompañar la presencia del estudiante y detectar pendientes de forma oportuna.'],
];

const roles = [
  ['Dirección', 'Supervisa instituciones, usuarios y lineamientos generales del periodo escolar.'],
  ['Administración', 'Gestiona matrículas, estructura académica, docentes, estudiantes y solicitudes.'],
  ['Docentes', 'Registran asistencia, evaluaciones y calificaciones de sus asignaciones.'],
  ['Estudiantes', 'Consultan su información académica según los permisos definidos por la institución.'],
  ['Representantes', 'Dan seguimiento a estudiantes asociados y a solicitudes vinculadas al colegio.'],
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="public-page-v2 min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-[clamp(16px,5vw,56px)] py-3.5">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 font-semibold tracking-[-.02em]" aria-label="Ir al inicio">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-fg text-[13px] text-white">RA</span>
          <span className="truncate">Registro Académico</span>
        </Link>

        <nav className="hidden flex-wrap items-center gap-2 sm:flex" aria-label="Navegación pública">
          <Link className="rounded-md bg-surface px-2.5 py-2 text-sm font-medium text-fg shadow-line" href="/">Home</Link>
          <Link className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-fg hover:shadow-line" href="/login">Login</Link>
          <Link className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-fg hover:shadow-line" href="/registro?requestType=acceso&context=landing-nav">Solicitud de acceso</Link>
          <Link className="rounded-md px-2.5 py-2 text-sm font-medium text-muted hover:bg-surface hover:text-fg hover:shadow-line" href="/sistema/panel">Panel privado</Link>
        </nav>

        <button
          type="button"
          className="inline-grid h-10 w-10 place-items-center rounded-lg bg-surface text-fg shadow-line sm:hidden"
          aria-label={mobileMenuOpen ? 'Cerrar menú público' : 'Abrir menú público'}
          onClick={() => setMobileMenuOpen((value) => !value)}
        >
          {mobileMenuOpen ? <X aria-hidden="true" className="h-4 w-4" /> : <Menu aria-hidden="true" className="h-4 w-4" />}
        </button>
      </header>

      {mobileMenuOpen ? (
        <nav className="grid gap-2 border-b border-border bg-surface px-4 py-3 sm:hidden" aria-label="Navegación pública móvil">
          <Link className="rounded-md px-3 py-2 text-sm font-semibold" href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          <Link className="rounded-md px-3 py-2 text-sm font-semibold" href="/registro?requestType=acceso&context=landing-mobile" onClick={() => setMobileMenuOpen(false)}>Solicitud de acceso</Link>
          <Link className="rounded-md px-3 py-2 text-sm font-semibold" href="/sistema/panel" onClick={() => setMobileMenuOpen(false)}>Panel privado</Link>
        </nav>
      ) : null}

      <section className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-10 px-[clamp(18px,5vw,56px)] pb-14 pt-14 xl:grid-cols-[minmax(0,.98fr)_minmax(340px,.72fr)] xl:gap-14 xl:pt-[88px]">
        <div className="min-w-0 max-w-[760px]">
          <div className="eyebrow">Institución educativa</div>
          <h1 className="max-w-[720px] text-[clamp(42px,5.7vw,72px)] font-[650] leading-[.98] tracking-[-.045em]">
            Colegio Central: formación académica con acompañamiento, orden y comunidad.
          </h1>
          <p className="mt-4 max-w-[60ch] text-[19px] leading-[1.65] text-muted">
            Somos una institución dedicada a formar estudiantes con criterio, responsabilidad y continuidad académica. Familias, docentes y equipo administrativo trabajan sobre una misma base: seguimiento claro, comunicación responsable y procesos escolares bien organizados.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link href="/registro?requestType=acceso&context=landing-hero" className="primary-button px-4 py-2.5">Solicitar acceso</Link>
            <Link href="/login" className="secondary-button px-4 py-2.5">Ingresar al portal</Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2" aria-label="Comunidad educativa">
            {['Inicial', 'Primaria', 'Media', 'Docentes', 'Familias'].map((item) => <span key={item} className="badge">{item}</span>)}
          </div>
        </div>

        <div className="relative z-10 w-full min-w-0 rounded-[18px] bg-surface p-4 shadow-card xl:mt-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="eyebrow">Periodo escolar</div>
              <strong className="block truncate text-lg tracking-[-.03em]">Colegio Central · 2026</strong>
            </div>
            <span className="badge badge-success shrink-0">Abierto</span>
          </div>
          <div className="grid gap-px overflow-hidden rounded-xl bg-border shadow-line">
            {[
              ['Matrícula institucional', 'Inicial, primaria y media', '642 estudiantes', 'badge'],
              ['Equipo docente', 'Áreas académicas y coordinación', '58 docentes', 'badge'],
              ['Atención a representantes', 'Solicitudes, seguimiento y consulta', 'Portal activo', 'badge badge-blue'],
              ['Jornada académica', 'Registro diario de clases y asistencia', 'Operativa', 'badge badge-success'],
            ].map(([title, description, value, badgeClass]) => (
              <div key={title} className="grid grid-cols-1 gap-2 bg-surface p-3.5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-3">
                <div className="min-w-0">
                  <strong className="text-sm">{title}</strong>
                  <small className="mt-1 block text-muted">{description}</small>
                </div>
                <span className={`${badgeClass} shrink-0 justify-self-start sm:justify-self-end`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[clamp(18px,5vw,56px)] py-9">
        <div className="mb-5 max-w-[780px]">
          <div className="eyebrow">Proyecto educativo</div>
          <h2 className="text-[clamp(30px,4vw,48px)] font-[640] leading-[1.05] tracking-[-.035em]">Una comunidad escolar enfocada en continuidad, responsabilidad y acompañamiento.</h2>
          <p className="mt-3 text-[17px] leading-[1.65] text-muted">El Colegio Central organiza su vida académica alrededor de procesos claros: inscripción, seguimiento docente, evaluación, asistencia y comunicación con representantes.</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            ['Formación integral', 'La institución articula áreas académicas, hábitos de estudio y acompañamiento cotidiano para sostener el avance de cada grupo.'],
            ['Gestión responsable', 'Secretaría, coordinación y dirección mantienen registros claros de estudiantes, docentes, secciones, periodos y procesos escolares.'],
            ['Vínculo con familias', 'Los representantes cuentan con canales de acceso para consultar información académica y dar seguimiento a sus solicitudes.'],
          ].map(([title, description]) => (
            <article key={title} className="rounded-xl bg-surface p-4 shadow-card">
              <h3 className="text-[22px] font-[620] leading-[1.18] tracking-[-.025em]">{title}</h3>
              <p className="mt-2 text-muted">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[clamp(18px,5vw,56px)] py-9">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
          <div className="rounded-xl bg-surface p-5 shadow-card lg:sticky lg:top-24">
            <div className="eyebrow">Vida institucional</div>
            <h2 className="mt-2 text-[clamp(30px,4vw,48px)] font-[640] leading-[1.05] tracking-[-.035em]">Áreas que sostienen el trabajo académico del colegio.</h2>
            <p className="mt-3 text-muted">La información pública presenta cómo se organiza la institución y orienta a estudiantes, docentes y representantes antes de ingresar al portal.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {areas.map(([badge, title, description]) => (
              <article key={title} className="rounded-xl bg-surface p-4 shadow-card">
                <span className="badge">{badge}</span>
                <h3 className="mt-3 text-[22px] font-[620] leading-[1.18] tracking-[-.025em]">{title}</h3>
                <p className="mt-2 text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[clamp(18px,5vw,56px)] py-9">
        <div className="mb-5">
          <div className="eyebrow">Comunidad educativa</div>
          <h2 className="text-[clamp(30px,4vw,48px)] font-[640] leading-[1.05] tracking-[-.035em]">Un portal institucional con accesos diferenciados para cada responsabilidad.</h2>
        </div>
        <div className="overflow-hidden rounded-xl bg-surface shadow-card">
          <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-5 md:divide-x md:divide-y-0">
            {roles.map(([title, description]) => (
              <article key={title} className="p-4">
                <strong>{title}</strong>
                <p className="mt-2 text-sm text-muted">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[clamp(18px,5vw,56px)] py-9">
        <div className="grid grid-cols-1 gap-4 rounded-[18px] bg-surface p-5 shadow-card lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="eyebrow">Acceso institucional</div>
            <h2 className="text-[clamp(30px,4vw,48px)] font-[640] leading-[1.05] tracking-[-.035em]">Ingreso ordenado para familias, estudiantes, docentes y administración.</h2>
            <p className="mt-3 max-w-[70ch] text-muted">El portal público informa y recibe solicitudes. El acceso privado se reserva para la comunidad autorizada, con permisos según la responsabilidad de cada persona dentro del colegio.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[420px]">
            {['1. Solicitud de acceso', '2. Validación institucional', '3. Consulta o gestión'].map((item) => (
              <span key={item} className="rounded-xl bg-[oklch(98%_.002_250)] p-3 text-sm font-semibold shadow-line">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-[clamp(18px,5vw,56px)] pb-14 pt-4">
        <div className="flex flex-wrap gap-2" aria-label="Módulos conservados">
          {modules.map((module) => <span key={module} className="badge">{module}</span>)}
        </div>
      </section>
    </main>
  );
}
