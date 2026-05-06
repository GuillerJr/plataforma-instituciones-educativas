'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  IdCard,
  Layers3,
  Link2,
  Menu,
  School,
  ShieldCheck,
  UsersRound,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Producto', href: '#producto' },
  { label: 'Módulos', href: '#modulos' },
  { label: 'Flujos', href: '#flujos' },
  { label: 'Roles', href: '#roles' },
  { label: 'Acceso', href: '#acceso' },
];

const productModules = [
  {
    title: 'Instituciones y sedes',
    description: 'Registro base de institución, tipo, contacto y sedes visibles dentro del sistema.',
    icon: Building2,
  },
  {
    title: 'Usuarios y roles',
    description: 'Perfiles, estados de cuenta y gobierno de acceso para la operación institucional.',
    icon: IdCard,
  },
  {
    title: 'Estructura académica',
    description: 'Niveles, cursos y secciones que sostienen la operación escolar y la matrícula.',
    icon: Layers3,
  },
  {
    title: 'Docentes y estudiantes',
    description: 'Altas, datos base, ubicación académica y lectura rápida de actividad.',
    icon: UsersRound,
  },
  {
    title: 'Matrículas y materias',
    description: 'Inscripciones del periodo activo y catálogo curricular enlazado con la institución.',
    icon: BookOpen,
  },
  {
    title: 'Asignaciones, evaluaciones y asistencia',
    description: 'Carga docente, calificaciones y control diario sobre datos académicos reales.',
    icon: ClipboardCheck,
  },
];

const operatingFlows = [
  {
    step: '01',
    title: 'Acceso institucional seguro',
    description: 'Inicio de sesión privado para operación administrativa, docente, estudiantil y de representación familiar.',
  },
  {
    step: '02',
    title: 'Solicitud pública unificada',
    description: 'El sistema ya contempla solicitudes de acceso, información institucional y admisión desde la capa pública.',
  },
  {
    step: '03',
    title: 'Gestión académica conectada',
    description: 'La estructura, matrícula, evaluación y asistencia trabajan sobre relaciones reales entre módulos.',
  },
];

const roles = [
  {
    title: 'Superadministración',
    description: 'Visión transversal de instituciones, usuarios, estructura académica y operación general.',
  },
  {
    title: 'Administración institucional',
    description: 'Gestión operativa del colegio: estructura, personal, estudiantes, matrículas y seguimiento.',
  },
  {
    title: 'Docencia',
    description: 'Acceso a materias, estructura visible, evaluaciones y control de asistencia según su alcance.',
  },
  {
    title: 'Estudiante',
    description: 'Consulta de rendimiento y asistencia construida sobre sus registros vinculados.',
  },
  {
    title: 'Representación familiar',
    description: 'Seguimiento de estudiantes asociados y lectura directa de su situación académica.',
  },
];

const systemPillars = [
  'Permisos por rol ya definidos en código',
  'Módulos conectados entre sí sin duplicar datos',
  'Panel privado separado del sitio público',
  'Flujos preparados para acceso, información y admisión',
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_38%,#f8fafc_100%)] text-slate-900">
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="#inicio" className="flex items-center gap-3" aria-label="Ir al inicio">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#18345f_0%,#0f223d_100%)] text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,34,61,0.25)]">
              ED
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sistema educativo</p>
              <p className="text-base font-semibold text-slate-950">Educa Plataforma</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/registro?requestType=informacion&context=landing-header" className="secondary-button px-5 py-3 text-sm">
              Solicitar información
            </Link>
            <Link href="/login" className="primary-button px-5 py-3 text-sm">
              Ingresar al sistema
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-2xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
              <Link href="/registro?requestType=informacion&context=landing-mobile" className="secondary-button mt-2 w-full" onClick={() => setMobileMenuOpen(false)}>
                Solicitar información
              </Link>
              <Link href="/login" className="primary-button w-full" onClick={() => setMobileMenuOpen(false)}>
                Ingresar al sistema
              </Link>
            </nav>
          </div>
        ) : null}
      </header>

      <section id="inicio" className="px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
              <ShieldCheck className="h-4 w-4 text-sky-700" />
              Plataforma institucional con acceso privado
            </span>

            <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,6vw,5.2rem)] font-semibold leading-[1.02] tracking-tight text-slate-950">
              Gestión educativa con estructura real, permisos por rol y operación conectada de extremo a extremo.
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
              Educa organiza usuarios, sedes, estructura académica, docentes, estudiantes, matrículas, materias,
              asignaciones, evaluaciones, calificaciones y asistencia dentro de una experiencia institucional sólida,
              confiable y orientada al trabajo diario.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/login" className="primary-button px-6 py-4">
                Acceder al panel
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/registro?requestType=acceso&context=landing-hero" className="secondary-button px-6 py-4">
                Solicitar acceso
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
                <p className="text-3xl font-semibold text-slate-950">{roles.length}</p>
                <p className="mt-2 text-sm text-slate-500">roles ya contemplados</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
                <p className="text-3xl font-semibold text-slate-950">{productModules.length}</p>
                <p className="mt-2 text-sm text-slate-500">bloques funcionales visibles</p>
              </div>
              <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
                <p className="text-3xl font-semibold text-slate-950">{operatingFlows.length}</p>
                <p className="mt-2 text-sm text-slate-500">flujos públicos y privados</p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.6rem] border border-slate-200 bg-white/85 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Qué resuelve hoy</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Centraliza la operación académica y administrativa sin separar los módulos en islas ni duplicar información entre áreas.
                </p>
              </div>
              <div className="rounded-[1.6rem] border border-slate-200 bg-white/85 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Cómo se accede</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Sitio público para solicitudes y panel privado para trabajo real del personal institucional, docentes, estudiantes y representantes.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-x-12 -top-10 h-40 rounded-full bg-sky-200/40 blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-10 left-10 h-40 w-40 rounded-full bg-emerald-200/35 blur-3xl" aria-hidden="true" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/92 p-4 shadow-[0_28px_90px_rgba(15,23,42,0.12)] sm:p-6">
              <div className="grid gap-4 rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#f7fafc_0%,#eef3f8_100%)] p-5">
                <div className="rounded-[1.35rem] bg-slate-950 px-5 py-5 text-white shadow-[0_18px_50px_rgba(2,6,23,0.22)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-white/55">Mapa operativo</p>
                      <p className="mt-1 text-lg font-semibold">Panel institucional conectado por capas reales</p>
                    </div>
                    <School className="h-6 w-6 text-sky-300" />
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      ['Acceso', 'Roles y permisos'],
                      ['Académico', 'Estructura y matrícula'],
                      ['Seguimiento', 'Notas y asistencia'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-4">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</p>
                        <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cobertura funcional existente</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Instituciones', 'Usuarios', 'Docentes', 'Estudiantes', 'Matrículas', 'Materias', 'Asignaciones', 'Evaluaciones', 'Asistencia'].map((item) => (
                        <span key={item} className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rutas activas</p>
                    <div className="mt-3 space-y-2 text-sm text-slate-600">
                      <p><code>/login</code> acceso institucional</p>
                      <p><code>/registro</code> solicitudes públicas</p>
                      <p><code>/sistema/*</code> módulos privados</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ['Usuarios y roles', 'Accesos, estados y gobierno institucional'],
                    ['Estructura académica', 'Niveles, cursos, secciones y relaciones operativas'],
                    ['Docentes y estudiantes', 'Base humana del periodo y ubicación escolar'],
                    ['Evaluaciones y asistencia', 'Seguimiento académico sobre datos reales'],
                  ].map(([title, copy]) => (
                    <article key={title} className="rounded-[1.35rem] border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
                      <p className="text-sm font-semibold text-slate-950">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="producto" className="border-y border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          <div>
            <p className="eyebrow">Producto institucional</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Diseñado para ordenar operación, permisos y seguimiento académico dentro de una sola experiencia.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {systemPillars.map((pillar) => (
              <div key={pillar} className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                {pillar}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modulos" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Módulos reales</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              La interfaz pública comunica exactamente lo que el sistema ya soporta en el panel interno.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              No se muestran promesas vacías ni funciones inventadas. Cada bloque corresponde a capacidades ya presentes en rutas, permisos y flujos existentes del proyecto.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {productModules.map((module) => {
              const Icon = module.icon;

              return (
                <article key={module.title} className="rounded-[1.8rem] border border-white bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.08)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_14px_34px_rgba(15,23,42,0.18)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-950">{module.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{module.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="flujos" className="bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Flujos existentes</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Desde la capa pública hasta la operación interna, la experiencia responde a funcionalidades ya implementadas.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {operatingFlows.map((flow) => (
              <article key={flow.step} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-6 shadow-[0_18px_48px_rgba(2,6,23,0.22)]">
                <p className="text-sm font-semibold tracking-[0.18em] text-sky-300">{flow.step}</p>
                <h3 className="mt-4 text-xl font-semibold">{flow.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/72">{flow.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="eyebrow">Roles del sistema</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              La plataforma ya distingue responsabilidades reales según el tipo de usuario logueado.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {roles.map((role) => (
              <article key={role.title} className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-[0_16px_44px_rgba(15,23,42,0.06)]">
                <h3 className="text-lg font-semibold text-slate-950">{role.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{role.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="acceso" className="px-4 pb-16 pt-4 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-white bg-white p-7 shadow-[0_24px_70px_rgba(15,23,42,0.10)] sm:p-8">
            <p className="eyebrow">Acceso y solicitudes</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Un punto de entrada claro para el equipo institucional y para quien necesita contactar o solicitar acceso.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              El proyecto ya separa el sitio público del sistema privado y dispone de páginas para autenticación,
              recuperación y solicitudes de acceso, información o admisión.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/login" className="primary-button px-6 py-4">
                Iniciar sesión
              </Link>
              <Link href="/registro?requestType=informacion&context=landing-final" className="secondary-button px-6 py-4">
                Registrar solicitud
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#edf3f8_100%)] p-7 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Rutas visibles</p>
            <div className="mt-5 space-y-3">
              {[
                ['/login', 'Acceso institucional protegido'],
                ['/registro', 'Solicitud pública unificada'],
                ['/sistema/panel', 'Panel principal por rol'],
                ['/sistema/*', 'Módulos académicos y administrativos'],
              ].map(([route, label]) => (
                <div key={route} className="rounded-[1.25rem] border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700">
                  <code className="font-semibold text-slate-950">{route}</code>
                  <span className="ml-2 text-slate-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-950">Educa Plataforma</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              Interfaz institucional para gestión educativa con módulos reales de usuarios, estructura académica,
              matrícula, evaluación y seguimiento escolar.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
            <Link href="/login" className="transition hover:text-slate-950">Acceso</Link>
            <Link href="/registro?requestType=informacion&context=landing-footer" className="transition hover:text-slate-950">Solicitudes</Link>
            <Link href="#modulos" className="transition hover:text-slate-950">Módulos</Link>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl border-t border-slate-200 pt-6 text-sm text-slate-400">
          © {currentYear} Educa. Gestión institucional para instituciones educativas.
        </div>
      </footer>
    </main>
  );
}
