"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigationItems = [
  { href: '/', label: 'Inicio', shortLabel: 'IN', description: 'Resumen general' },
  { href: '/panel', label: 'Panel', shortLabel: 'PA', description: 'Centro operativo' },
  { href: '/instituciones', label: 'Institución', shortLabel: 'IE', description: 'Datos base y sedes' },
  { href: '/academico', label: 'Académico', shortLabel: 'AC', description: 'Niveles, grados y secciones' },
  { href: '/docentes', label: 'Docentes', shortLabel: 'DO', description: 'Planta y asignación académica' },
  { href: '/estudiantes', label: 'Estudiantes', shortLabel: 'ES', description: 'Matrícula y ubicación académica' },
  { href: '/matriculas', label: 'Matrículas', shortLabel: 'MT', description: 'Inscripciones por estudiante y sección' },
  { href: '/materias', label: 'Materias', shortLabel: 'MA', description: 'Oferta curricular y carga base' },
  { href: '/asignaciones-academicas', label: 'Asignaciones', shortLabel: 'AA', description: 'Docente + materia + estructura' },
  { href: '/evaluaciones', label: 'Evaluaciones', shortLabel: 'EV', description: 'Instrumentos y calificaciones' },
  { href: '/usuarios', label: 'Usuarios', shortLabel: 'US', description: 'Accesos y perfiles' },
];

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Centro de gestión escolar',
    subtitle: 'Vista resumida para rectorado, coordinación y personal administrativo.',
  },
  '/panel': {
    title: 'Panel institucional',
    subtitle: 'Seguimiento diario de operación, accesos y actividad reciente.',
  },
  '/instituciones': {
    title: 'Institución',
    subtitle: 'Datos base, sedes y contacto operativo en una sola vista.',
  },
  '/academico': {
    title: 'Estructura académica',
    subtitle: 'Niveles, cursos y secciones operativas para una sola institución.',
  },
  '/docentes': {
    title: 'Docentes y carga académica',
    subtitle: 'Planta docente con asignaciones visibles por nivel, curso o sección.',
  },
  '/estudiantes': {
    title: 'Estudiantes y matrícula académica',
    subtitle: 'Alta y consulta de estudiantes ubicados en nivel, curso y sección.',
  },
  '/matriculas': {
    title: 'Matrículas e inscripciones',
    subtitle: 'Registro del periodo escolar enlazado con estudiante, curso y sección.',
  },
  '/materias': {
    title: 'Materias y oferta curricular',
    subtitle: 'Base de materias visible para la institución activa y su carga académica.',
  },
  '/asignaciones-academicas': {
    title: 'Asignaciones académicas',
    subtitle: 'Vínculo operativo entre docente, materia, nivel, curso y sección.',
  },
  '/evaluaciones': {
    title: 'Evaluaciones y calificaciones',
    subtitle: 'Seguimiento por materia, docente, evaluación y estudiante matriculado.',
  },
  '/usuarios': {
    title: 'Usuarios y gobierno de acceso',
    subtitle: 'Control de perfiles, permisos y seguridad operativa del colegio.',
  },
};

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const activePage = pathname ? (pageMeta[pathname] ?? pageMeta['/']) : pageMeta['/'];
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMobileSidebarOpen(false);
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#ffffff_0%,_#f6f9fc_34%,_#eef3f8_100%)] text-slate-900">
      {mobileSidebarOpen ? (
        <div className="mobile-sidebar-overlay lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <aside className="mobile-sidebar-panel" onClick={(event) => event.stopPropagation()}>
            <div className="sidebar-scroll flex h-full min-h-0 flex-col">
              <SidebarContent pathname={pathname ?? '/'} onNavigate={() => setMobileSidebarOpen(false)} />
            </div>
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex min-h-screen w-full max-w-[1580px] gap-4 px-4 py-3 sm:px-6 lg:gap-5 lg:px-8 lg:py-4">
        <aside className="app-sidebar hidden w-[292px] shrink-0 lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col lg:p-4">
          <div className="sidebar-scroll flex h-full min-h-0 flex-col">
            <SidebarContent pathname={pathname ?? '/'} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="topbar-panel sticky top-2 z-20 mb-4 px-3 py-3 sm:top-3 sm:px-4">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-3 lg:hidden">
                  <button type="button" className="icon-button" aria-label="Abrir navegación" onClick={() => setMobileSidebarOpen(true)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-slate-700">
                      <path d="M4 7h16v1.5H4V7Zm0 4.25h16v1.5H4v-1.5ZM4 15.5h16V17H4v-1.5Z" fill="currentColor" />
                    </svg>
                  </button>

                  <Link href="/" className="inline-flex min-w-0 items-center gap-2.5 text-slate-950 transition hover:text-sky-700">
                    <span className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]">
                      ED
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Gestión escolar</span>
                      <span className="block truncate text-base font-semibold tracking-tight">Campus Central</span>
                    </span>
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    <span className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-0.5 text-sky-700">Sistema institucional</span>
                    <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-flex" />
                    <span className="hidden sm:inline">Campus Central</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-emerald-700 sm:ml-auto xl:ml-0">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Operación activa
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
                    <div className="min-w-0">
                      <h1 className="text-lg font-semibold tracking-tight text-slate-950 sm:text-[1.45rem]">{activePage.title}</h1>
                      <p className="max-w-3xl text-[13px] leading-5 text-slate-500">{activePage.subtitle}</p>
                    </div>

                    <div className="hidden items-center gap-2.5 xl:flex xl:shrink-0">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Vista actual</p>
                        <p className="mt-1 text-xs font-semibold text-slate-950">Control diario y acceso inmediato</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:min-w-[520px] xl:max-w-[680px] xl:justify-end">
                <label className="header-search sm:flex-1 xl:max-w-[320px]">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-slate-400">
                    <path d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.43 1.06-1.06-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" fill="currentColor" />
                  </svg>
                  <input aria-label="Buscar" placeholder="Buscar usuario, vista o registro" />
                </label>

                <div className="flex flex-wrap items-stretch justify-between gap-2 sm:justify-end xl:shrink-0 xl:justify-start">
                  <button type="button" className="icon-button" aria-label="Notificaciones">
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-sky-500" />
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-slate-600">
                      <path d="M12 3.75a4.25 4.25 0 0 0-4.25 4.25v1.02c0 .64-.2 1.26-.57 1.78L5.8 12.77A1.75 1.75 0 0 0 7.23 15.5h9.54a1.75 1.75 0 0 0 1.43-2.73l-1.38-1.97a3.23 3.23 0 0 1-.57-1.78V8A4.25 4.25 0 0 0 12 3.75Zm0 16.5a2.24 2.24 0 0 0 2.12-1.5H9.88A2.24 2.24 0 0 0 12 20.25Z" fill="currentColor" />
                    </svg>
                  </button>

                  <div className="hidden rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right lg:block">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Acceso rápido</p>
                    <p className="mt-1 text-xs font-medium text-slate-700">Alta y consulta de usuarios</p>
                  </div>

                  <Link href="/usuarios" className="primary-button min-h-10 w-full rounded-xl px-3.5 py-2 text-xs sm:w-auto sm:text-sm">
                    Nuevo usuario
                  </Link>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex min-w-0 items-center gap-3 text-slate-950 transition hover:text-sky-700" onClick={onNavigate}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
              ED
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Gestión escolar</span>
              <span className="block truncate text-lg font-semibold tracking-tight">Campus Central</span>
            </span>
          </Link>
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">En línea</span>
        </div>
        <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50/80 px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Foco del día</p>
          <p className="mt-2 text-sm font-semibold text-slate-950">Accesos, estructura y pendientes en un solo flujo.</p>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50/85 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Perfil activo</p>
        <div className="mt-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
            AP
          </span>
          <div>
            <p className="font-semibold text-slate-950">Administración general</p>
            <p className="text-sm text-slate-500">Rectorado y operación</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Navegación</p>
      </div>

      <nav className="mt-3 space-y-2" aria-label="Principal">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`app-sidebar-link ${isActive ? 'app-sidebar-link-active' : ''}`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-semibold ${isActive ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {item.shortLabel}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="mt-1 block text-xs font-medium text-slate-500">{item.description}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[26px] border border-slate-200 bg-slate-950 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Seguimiento escolar</p>
        <h2 className="mt-3 text-lg font-semibold">87% de continuidad estudiantil este periodo</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          La interfaz ahora prioriza menos ruido visual, lectura rápida y control diario para una sola institución.
        </p>
        <div className="mt-4 rounded-[18px] border border-white/10 bg-white/5 px-3.5 py-3 text-sm text-slate-200">
          Prioridades visibles, acciones más cerca y mejor lectura en móvil y escritorio.
        </div>
        <Link href="/panel" className="mt-5 inline-flex items-center text-sm font-semibold text-sky-200 transition hover:text-white" onClick={onNavigate}>
          Abrir panel diario
        </Link>
      </div>
    </>
  );
}
