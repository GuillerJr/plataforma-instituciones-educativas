'use client';

import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Link2,
  Menu,
  School,
  Settings,
  UsersRound,
  X,
} from 'lucide-react';
import type { CurrentUser } from '../lib/current-user';
import { LogoutButton } from './logout-button';
import { ThemeToggle } from './theme-toggle';

const APP_SIDEBAR_VISIBILITY_KEY = 'edu-app-sidebar-visible';
const DESKTOP_SIDEBAR_WIDTH = 308;
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 110;

const navigationItems = [
  {
    href: '/sistema/panel',
    label: 'Panel',
    Icon: LayoutDashboard,
    description: 'Resumen operativo',
    roles: ['superadmin', 'admin_institucional', 'docente', 'estudiante', 'representante'],
  },
  {
    href: '/sistema/estudiantes',
    label: 'Estudiantes',
    Icon: GraduationCap,
    description: 'Registro y seguimiento',
    roles: ['superadmin', 'admin_institucional', 'docente'],
  },
  {
    href: '/sistema/docentes',
    label: 'Docentes',
    Icon: UsersRound,
    description: 'Planta académica',
    roles: ['superadmin', 'admin_institucional'],
  },
  {
    href: '/sistema/materias',
    label: 'Materias',
    Icon: BookOpen,
    description: 'Oferta curricular',
    roles: ['superadmin', 'admin_institucional', 'docente'],
  },
  {
    href: '/sistema/academico',
    label: 'Académico',
    Icon: CalendarRange,
    description: 'Niveles y secciones',
    roles: ['superadmin', 'admin_institucional', 'docente'],
  },
  {
    href: '/sistema/evaluaciones',
    label: 'Calificaciones',
    Icon: ClipboardCheck,
    description: 'Evaluación continua',
    roles: ['superadmin', 'admin_institucional', 'docente', 'estudiante', 'representante'],
  },
  {
    href: '/sistema/asistencia',
    label: 'Asistencia',
    Icon: BarChart3,
    description: 'Control diario',
    roles: ['superadmin', 'admin_institucional', 'docente', 'representante'],
  },
  {
    href: '/sistema/matriculas',
    label: 'Matrículas',
    Icon: CalendarDays,
    description: 'Periodo escolar',
    roles: ['superadmin', 'admin_institucional'],
  },
  {
    href: '/sistema/asignaciones-academicas',
    label: 'Asignaciones',
    Icon: Link2,
    description: 'Carga docente',
    roles: ['superadmin', 'admin_institucional'],
  },
  {
    href: '/sistema/usuarios',
    label: 'Usuarios',
    Icon: Settings,
    description: 'Accesos y perfiles',
    roles: ['superadmin', 'admin_institucional'],
  },
] satisfies ReadonlyArray<{
  href: string;
  label: string;
  Icon: LucideIcon;
  description: string;
  roles: readonly string[];
}>;

type PageMeta = {
  title: string;
  subtitle: string;
  section: string;
};

const dashboardMeta: PageMeta = {
  title: 'Panel institucional',
  subtitle: 'Lectura ejecutiva del sistema con alcance filtrado por rol y módulos habilitados.',
  section: 'Operación general',
};

const pageMeta: Record<string, PageMeta> = {
  '/sistema': dashboardMeta,
  '/sistema/panel': dashboardMeta,
  '/sistema/instituciones': {
    title: 'Instituciones',
    subtitle: 'Sedes, contacto base y visibilidad institucional dentro del entorno activo.',
    section: 'Configuración institucional',
  },
  '/sistema/academico': {
    title: 'Estructura académica',
    subtitle: 'Niveles, cursos y secciones que sostienen matrícula, docencia y seguimiento escolar.',
    section: 'Operación académica',
  },
  '/sistema/docentes': {
    title: 'Docentes',
    subtitle: 'Planta académica, disponibilidad y cobertura actual sobre la estructura del colegio.',
    section: 'Operación académica',
  },
  '/sistema/estudiantes': {
    title: 'Estudiantes',
    subtitle: 'Registro, ubicación escolar y datos base de la matrícula institucional.',
    section: 'Operación académica',
  },
  '/sistema/matriculas': {
    title: 'Matrículas',
    subtitle: 'Inscripciones del periodo activo con trazabilidad por estudiante, nivel y sección.',
    section: 'Gestión del periodo',
  },
  '/sistema/materias': {
    title: 'Materias',
    subtitle: 'Catálogo curricular y carga referencial disponible para la institución activa.',
    section: 'Operación académica',
  },
  '/sistema/asignaciones-academicas': {
    title: 'Asignaciones académicas',
    subtitle: 'Cruce operativo entre docentes, materias, cursos y secciones reales.',
    section: 'Operación académica',
  },
  '/sistema/evaluaciones': {
    title: 'Evaluaciones y notas',
    subtitle: 'Instrumentos, resultados y rendimiento registrados sobre matrículas reales.',
    section: 'Seguimiento académico',
  },
  '/sistema/asistencia': {
    title: 'Asistencia',
    subtitle: 'Control diario por fecha, sección y estudiante con visibilidad útil para coordinación.',
    section: 'Seguimiento académico',
  },
  '/sistema/usuarios': {
    title: 'Usuarios y roles',
    subtitle: 'Gobierno de acceso, perfiles y estados de cuenta dentro del sistema institucional.',
    section: 'Seguridad y acceso',
  },
};

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

function getActivePage(pathname: string): PageMeta {
  const normalized = normalizePathname(pathname);
  const exactMatch = pageMeta[normalized];

  if (exactMatch) return exactMatch;

  const nestedMatch = Object.entries(pageMeta)
    .filter(([href]) => normalized === href || normalized.startsWith(`${href}/`))
    .sort(([firstHref], [secondHref]) => secondHref.length - firstHref.length)[0];

  return nestedMatch?.[1] ?? dashboardMeta;
}

function isActiveNavigationItem(pathname: string, href: string) {
  const normalized = normalizePathname(pathname);

  if (href === '/sistema/panel') {
    return normalized === '/sistema' || normalized === href || normalized.startsWith(`${href}/`);
  }

  return normalized === href || normalized.startsWith(`${href}/`);
}

function getUserInitials(fullName?: string | null) {
  if (!fullName) return 'ED';

  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? '')
    .join('');

  return initials || 'ED';
}

function formatRoleLabel(roleCode?: string | null) {
  if (!roleCode) return 'Sesión activa';

  const dictionary: Record<string, string> = {
    superadmin: 'Superadministración',
    admin_institucional: 'Administración institucional',
    docente: 'Docencia',
    estudiante: 'Estudiante',
    representante: 'Representación familiar',
  };

  return dictionary[roleCode] ?? roleCode.replace(/_/g, ' ');
}

function getBreadcrumbs(pathname: string) {
  const normalized = normalizePathname(pathname);
  const activeItem = navigationItems.find((item) => isActiveNavigationItem(normalized, item.href));

  if (!activeItem || activeItem.href === '/sistema/panel') {
    return ['Sistema', 'Panel'];
  }

  return ['Sistema', activeItem.label];
}

function getUserStatusLabel(status?: CurrentUser['status']) {
  if (status === 'active') return 'Cuenta activa';
  if (status === 'pending') return 'Pendiente';
  if (status === 'blocked') return 'Bloqueada';
  return 'Sesión institucional';
}

export function AppShell({ children, currentUser }: Readonly<{ children: ReactNode; currentUser: CurrentUser | null }>) {
  const rawPathname = usePathname() ?? '/sistema';
  const pathname = useMemo(() => normalizePathname(rawPathname), [rawPathname]);
  const activePage = useMemo(() => getActivePage(pathname), [pathname]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);
  const userInitials = useMemo(() => getUserInitials(currentUser?.fullName), [currentUser?.fullName]);
  const primaryRoleLabel = useMemo(() => formatRoleLabel(currentUser?.roleCodes?.[0]), [currentUser?.roleCodes]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const mobileSidebarLabel = mobileSidebarOpen ? 'Cerrar navegación principal' : 'Abrir navegación principal';

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

  useEffect(() => {
    const storedPreference = window.localStorage.getItem(APP_SIDEBAR_VISIBILITY_KEY);

    if (storedPreference === 'false') {
      setSidebarVisible(false);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(APP_SIDEBAR_VISIBILITY_KEY, String(sidebarVisible));
  }, [sidebarVisible]);

  const allowedNavigationItems = useMemo(() => {
    if (!currentUser) return navigationItems.filter((item) => item.href === '/sistema/panel');
    return navigationItems.filter((item) => item.roles.some((role) => currentUser.roleCodes.includes(role)));
  }, [currentUser]);

  return (
    <div
      className="app-frame min-h-screen text-slate-900"
      style={
        {
          '--app-sidebar-width': `${sidebarVisible ? DESKTOP_SIDEBAR_WIDTH : DESKTOP_SIDEBAR_COLLAPSED_WIDTH}px`,
        } as CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className={`mobile-sidebar-overlay fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside
        id="sidebar"
        aria-label="Navegación principal"
        className={`app-sidebar-panel fixed inset-y-0 left-0 z-50 flex w-[308px] max-w-[calc(100vw-1rem)] flex-col transition-[width,transform] duration-300 ease-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarVisible ? 'lg:w-[308px]' : 'lg:w-[110px]'}`}
      >
        <div className="sidebar-brand-panel flex items-start justify-between gap-3">
          <Link
            href="/sistema/panel"
            className={`flex min-w-0 items-center gap-3 ${sidebarVisible ? '' : 'lg:justify-center lg:gap-0'}`}
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="sidebar-brand-mark flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-semibold text-white">
              E
            </div>
            <div className={`min-w-0 ${sidebarVisible ? '' : 'lg:hidden'}`}>
              <p className="sidebar-brand-kicker">Sistema institucional</p>
              <h1 className="truncate text-base font-semibold leading-none text-slate-950">Educa</h1>
              <p className="mt-1 truncate text-xs text-slate-500">Gestión académica y administrativa</p>
            </div>
          </Link>

          <button
            type="button"
            className="icon-button lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar navegación principal"
            title="Cerrar navegación principal"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {sidebarVisible ? (
          <div className="sidebar-context-card hidden lg:block">
            <p className="tiny-label">Área activa</p>
            <p className="mt-3 text-sm font-semibold text-slate-950">{activePage.title}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{activePage.subtitle}</p>
          </div>
        ) : null}

        <nav className="sidebar-scroll min-h-0 flex-1 space-y-1 pr-1">
          {sidebarVisible ? <p className="sidebar-section-label px-3 pb-2 pt-1">Módulos</p> : null}
          {allowedNavigationItems.map((item) => {
            const isActive = isActiveNavigationItem(pathname, item.href);
            const Icon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                aria-label={item.label}
                title={!sidebarVisible ? item.label : undefined}
                className={`app-sidebar-link ${isActive ? 'app-sidebar-link-active' : ''} ${sidebarVisible ? '' : 'lg:justify-center lg:px-2'}`}
              >
                <span className={`sidebar-link-icon ${isActive ? 'sidebar-link-icon-active' : ''}`}>
                  <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
                <span className={`min-w-0 ${sidebarVisible ? '' : 'lg:hidden'}`}>
                  <span className="block truncate">{item.label}</span>
                  <span className={`mt-0.5 hidden truncate text-[11px] xl:block ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer-panel mt-4 space-y-3">
          {sidebarVisible ? (
            <Link href="/" className="secondary-button w-full justify-between px-4 py-3 text-sm">
              Ir al sitio público
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          ) : (
            <Link href="/" className="icon-button hidden lg:inline-flex" aria-label="Ir al sitio público" title="Ir al sitio público">
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}

          <div className={`flex min-w-0 items-center gap-3 ${sidebarVisible ? '' : 'lg:justify-center'}`}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white font-semibold text-slate-700">
              {userInitials}
            </div>
            <div className={`min-w-0 ${sidebarVisible ? '' : 'lg:hidden'}`}>
              <p className="truncate text-sm font-semibold text-slate-950">{currentUser?.fullName ?? 'Acceso institucional'}</p>
              <p className="mt-1 truncate text-[11px] text-slate-500">{primaryRoleLabel}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="transition-[padding] duration-300 lg:pl-[var(--app-sidebar-width)]">
        <main className="app-main min-h-screen min-w-0 overflow-x-hidden">
          <header className="topbar-surface sticky top-0 z-30 px-4 py-4 sm:px-5 lg:px-6">
            <div className="mx-auto flex w-full max-w-[1480px] min-w-0 flex-col gap-4">
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <button
                    type="button"
                    className="icon-button lg:hidden"
                    onClick={() => setMobileSidebarOpen((value) => !value)}
                    aria-label={mobileSidebarLabel}
                    title={mobileSidebarLabel}
                    aria-controls="sidebar"
                    aria-expanded={mobileSidebarOpen}
                  >
                    {mobileSidebarOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                      {breadcrumbs.map((crumb, index) => (
                        <span key={`${crumb}-${index}`} className="inline-flex items-center gap-2">
                          {index > 0 ? <span className="text-slate-300">/</span> : null}
                          <span>{crumb}</span>
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex min-w-0 flex-wrap items-center gap-2">
                      <span className="info-chip">{activePage.section}</span>
                      <span className="info-chip">{primaryRoleLabel}</span>
                      <span className="info-chip">{getUserStatusLabel(currentUser?.status)}</span>
                    </div>
                    <h2 className="mt-3 text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-tight text-slate-950">
                      {activePage.title}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-[15px]">{activePage.subtitle}</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="icon-button hidden lg:inline-flex"
                  onClick={() => setSidebarVisible((value) => !value)}
                  aria-label={sidebarVisible ? 'Colapsar navegación lateral' : 'Expandir navegación lateral'}
                  title={sidebarVisible ? 'Colapsar navegación lateral' : 'Expandir navegación lateral'}
                >
                  <Menu aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>

              <div className="topbar-panel flex flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 font-semibold text-slate-700">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{currentUser?.fullName ?? 'Acceso institucional'}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{currentUser?.email ?? primaryRoleLabel}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <Link href="/" className="secondary-button w-full sm:w-auto">
                    Sitio público
                  </Link>
                  <ThemeToggle />
                  <LogoutButton className="secondary-button w-full sm:w-auto" />
                </div>
              </div>
            </div>
          </header>

          <div className="app-content-shell">
            <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-5 lg:p-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
