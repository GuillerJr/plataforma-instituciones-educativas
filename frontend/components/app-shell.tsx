"use client";

import type { CSSProperties, ReactNode } from "react";
import type { CurrentUser } from "../lib/current-user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  GraduationCap,
  Globe2,
  Link2,
  Menu,
  MessageCircle,
  School,
  Search,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const APP_SIDEBAR_VISIBILITY_KEY = 'edu-app-sidebar-visible';
const DESKTOP_SIDEBAR_WIDTH = '272px';
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = '88px';

const navigationItems = [
  { href: "/sistema/panel", label: "Dashboard", Icon: School, description: "Centro institucional", roles: ['superadmin', 'admin_institucional', 'docente', 'estudiante', 'representante'] },
  { href: "/sistema/estudiantes", label: "Estudiantes", Icon: GraduationCap, description: "Gestión y matrículas", roles: ['superadmin', 'admin_institucional', 'docente'] },
  { href: "/sistema/docentes", label: "Docentes", Icon: UsersRound, description: "Planta académica", roles: ['superadmin', 'admin_institucional'] },
  { href: "/sistema/materias", label: "Materias", Icon: BookOpen, description: "Oferta curricular", roles: ['superadmin', 'admin_institucional', 'docente'] },
  { href: "/sistema/academico", label: "Académico", Icon: CalendarRange, description: "Niveles, grados y secciones", roles: ['superadmin', 'admin_institucional', 'docente'] },
  { href: "/sistema/evaluaciones", label: "Calificaciones", Icon: ClipboardCheck, description: "Evaluación continua", roles: ['superadmin', 'admin_institucional', 'docente', 'estudiante', 'representante'] },
  { href: "/sistema/asistencia", label: "Asistencia", Icon: BarChart3, description: "Control diario", roles: ['superadmin', 'admin_institucional', 'docente', 'representante'] },
  { href: "/sistema/matriculas", label: "Matrículas", Icon: CalendarDays, description: "Inscripciones activas", roles: ['superadmin', 'admin_institucional'] },
  { href: "/sistema/asignaciones-academicas", label: "Asignaciones", Icon: Link2, description: "Docente, materia y curso", roles: ['superadmin', 'admin_institucional'] },
  { href: "/sistema/usuarios", label: "Configuración", Icon: Settings, description: "Usuarios y acceso", roles: ['superadmin', 'admin_institucional'] },
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
  quickAction: string;
};

const dashboardMeta: PageMeta = {
  title: "Dashboard",
  subtitle: "Panel principal de gestión educativa",
  quickAction: "Resumen institucional y seguimiento diario",
};

const pageMeta: Record<string, PageMeta> = {
  "/sistema": dashboardMeta,
  "/sistema/panel": dashboardMeta,
  "/sistema/instituciones": {
    title: "Institución",
    subtitle: "Datos base, sedes y contacto operativo",
    quickAction: "Información central de la institución",
  },
  "/sistema/academico": {
    title: "Académico",
    subtitle: "Niveles, cursos, secciones y estructura escolar",
    quickAction: "Orden académico de una sola institución",
  },
  "/sistema/docentes": {
    title: "Docentes",
    subtitle: "Planta docente y asignación académica",
    quickAction: "Seguimiento de carga y responsables",
  },
  "/sistema/estudiantes": {
    title: "Estudiantes",
    subtitle: "Altas, consulta, seguimiento y ubicación escolar",
    quickAction: "Gestión estudiantil centralizada",
  },
  "/sistema/matriculas": {
    title: "Matrículas",
    subtitle: "Inscripciones por periodo, curso y sección",
    quickAction: "Control del flujo de matrícula",
  },
  "/sistema/materias": {
    title: "Materias",
    subtitle: "Oferta curricular institucional",
    quickAction: "Base académica por nivel y curso",
  },
  "/sistema/asignaciones-academicas": {
    title: "Asignaciones",
    subtitle: "Relación entre docentes, materias y estructura",
    quickAction: "Cruce operativo académico",
  },
  "/sistema/evaluaciones": {
    title: "Calificaciones",
    subtitle: "Evaluaciones, instrumentos y resultados",
    quickAction: "Seguimiento del rendimiento",
  },
  "/sistema/asistencia": {
    title: "Asistencia",
    subtitle: "Control diario por fecha y sección",
    quickAction: "Monitoreo de presencia escolar",
  },
  "/sistema/usuarios": {
    title: "Configuración",
    subtitle: "Usuarios, perfiles y seguridad operativa",
    quickAction: "Gobierno de acceso institucional",
  },
};


function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
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

  if (href === "/sistema/panel") {
    return normalized === "/sistema" || normalized === href || normalized.startsWith(`${href}/`);
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
  if (!roleCode) return 'Sesion activa';

  const dictionary: Record<string, string> = {
    superadmin: 'Superadministrador',
    admin_institucional: 'Administrador institucional',
    docente: 'Docente',
    estudiante: 'Estudiante',
    representante: 'Representante',
  };

  return dictionary[roleCode] ?? roleCode.replace(/_/g, ' ');
}

export function AppShell({ children, currentUser }: Readonly<{ children: ReactNode; currentUser: CurrentUser | null }>) {
  const rawPathname = usePathname() ?? "/sistema";
  const pathname = useMemo(() => normalizePathname(rawPathname), [rawPathname]);
  const activePage = useMemo(() => getActivePage(pathname), [pathname]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [topbarHeight, setTopbarHeight] = useState(112);
  const topbarRef = useRef<HTMLElement | null>(null);
  const userInitials = useMemo(() => getUserInitials(currentUser?.fullName), [currentUser?.fullName]);
  const primaryRoleLabel = useMemo(() => formatRoleLabel(currentUser?.roleCodes?.[0]), [currentUser?.roleCodes]);
  const mobileSidebarLabel = mobileSidebarOpen ? 'Cerrar barra lateral' : 'Abrir barra lateral';

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileSidebarOpen(false);
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileSidebarOpen]);

  useEffect(() => {
    const storedPreference = window.localStorage.getItem(APP_SIDEBAR_VISIBILITY_KEY);
    if (storedPreference === 'false') setSidebarVisible(false);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(APP_SIDEBAR_VISIBILITY_KEY, String(sidebarVisible));
  }, [sidebarVisible]);

  useEffect(() => {
    const topbarElement = topbarRef.current;
    if (!topbarElement) return;

    const syncTopbarHeight = () => {
      setTopbarHeight(Math.ceil(topbarElement.getBoundingClientRect().height));
    };

    syncTopbarHeight();

    const resizeObserver = new ResizeObserver(() => {
      syncTopbarHeight();
    });

    resizeObserver.observe(topbarElement);
    window.addEventListener('resize', syncTopbarHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', syncTopbarHeight);
    };
  }, [activePage.subtitle, activePage.title, mobileSidebarOpen, sidebarVisible]);

  const allowedNavigationItems = useMemo(() => {
    if (!currentUser) return navigationItems.filter((item) => item.href === '/sistema/panel');
    return navigationItems.filter((item) => item.roles.some((role) => currentUser.roleCodes.includes(role)));
  }, [currentUser]);

  return (
    <div
      className="app-frame min-h-screen text-slate-900 transition-colors duration-300"
      style={{
        '--app-topbar-offset': `${topbarHeight}px`,
        '--app-sidebar-width': sidebarVisible ? DESKTOP_SIDEBAR_WIDTH : DESKTOP_SIDEBAR_COLLAPSED_WIDTH,
      } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className={`mobile-sidebar-overlay fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside
        id="sidebar"
        aria-label="Navegación principal"
        className={`app-sidebar-panel fixed inset-y-0 left-0 z-50 flex w-[272px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden px-3 py-4 shadow-2xl transition-[width,transform] duration-300 ease-out lg:translate-x-0 lg:shadow-none ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarVisible ? 'lg:w-[272px]' : 'lg:w-[88px]'}`}
      >
        <div className="sidebar-brand-panel flex shrink-0 items-center justify-between gap-3">
          <Link href="/sistema/panel" className={`flex min-w-0 items-center gap-3 ${sidebarVisible ? '' : 'lg:gap-0'}`} onClick={() => setMobileSidebarOpen(false)}>
            <div className="sidebar-brand-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-white">
              E
            </div>
            <div className={`min-w-0 ${sidebarVisible ? '' : 'lg:hidden'}`}>
              <p className="sidebar-brand-kicker">Sistema interno</p>
              <h1 className="truncate text-[15px] font-bold leading-none text-slate-950">EduSmart</h1>
              <p className="mt-1 truncate text-[11px] font-medium text-slate-500">Gestión institucional</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:flex"
              onClick={() => setSidebarVisible((value) => !value)}
              aria-label={sidebarVisible ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
              title={sidebarVisible ? 'Colapsar barra lateral' : 'Expandir barra lateral'}
              aria-controls="sidebar"
              aria-expanded={sidebarVisible}
            >
              {sidebarVisible ? <ChevronLeft aria-hidden="true" className="h-4 w-4" /> : <ChevronRight aria-hidden="true" className="h-4 w-4" />}
            </button>

            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Cerrar barra lateral"
              title="Cerrar barra lateral"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>

        {sidebarVisible ? (
          <div className="sidebar-context-card hidden lg:block">
            <p className="tiny-label">Area activa</p>
            <p className="mt-2 text-sm font-semibold text-slate-950">{activePage.title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{activePage.quickAction}</p>
          </div>
        ) : null}

        <nav className="soft-scroll sidebar-scroll min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {sidebarVisible ? <p className="sidebar-section-label px-3 pt-1">Modulos</p> : null}
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
                className={`app-sidebar-link ${isActive ? "app-sidebar-link-active" : ""} ${sidebarVisible ? '' : 'lg:justify-center lg:px-2'}`}
              >
                <span
                  className={`sidebar-link-icon ${
                    isActive ? "sidebar-link-icon-active" : ""
                  }`}
                >
                  <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
                <span className={`min-w-0 ${sidebarVisible ? '' : 'lg:hidden'}`}>
                  <span className="block truncate">{item.label}</span>
                  <span className={`hidden truncate text-[11px] font-medium xl:block ${isActive ? "text-slate-500" : "text-slate-400"}`}>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}

          <div className="my-3 h-px bg-slate-200" />

          <Link
            href="/"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Sitio público"
            title={!sidebarVisible ? 'Sitio público' : undefined}
            className={`app-sidebar-link ${sidebarVisible ? '' : 'lg:justify-center lg:px-2'}`}
          >
            <span className="sidebar-link-icon">
              <Globe2 aria-hidden="true" className="h-[18px] w-[18px]" />
            </span>
            <span className={sidebarVisible ? '' : 'lg:hidden'}>Sitio público</span>
          </Link>

          <button
            type="button"
            aria-label="Ayuda"
            title={!sidebarVisible ? 'Ayuda' : undefined}
            className={`app-sidebar-link ${sidebarVisible ? '' : 'lg:justify-center lg:px-2'}`}
          >
            <span className="sidebar-link-icon">
              <CircleHelp aria-hidden="true" className="h-[18px] w-[18px]" />
            </span>
            <span className={sidebarVisible ? '' : 'lg:hidden'}>Ayuda</span>
          </button>
        </nav>

        <div className="sidebar-footer-panel mt-3 shrink-0">
          <div className={`flex min-w-0 items-center gap-3 ${sidebarVisible ? '' : 'lg:justify-center'}`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white font-bold text-slate-700">{userInitials}</div>
            <div className={`min-w-0 ${sidebarVisible ? '' : 'lg:hidden'}`}>
              <p className="truncate text-sm font-semibold text-slate-950">{currentUser?.fullName ?? 'Acceso institucional'}</p>
              <p className="mt-1 truncate text-[11px] text-slate-500">{primaryRoleLabel}</p>
            </div>
          </div>
        </div>

      </aside>

      <main className="app-main min-h-screen min-w-0 overflow-x-hidden transition-[padding] duration-300">
        <header
          ref={topbarRef}
          className="topbar-surface fixed left-0 right-0 top-0 z-30 px-4 py-2.5 backdrop-blur transition-[left] duration-300 sm:px-5 lg:px-6"
        >
          <div className="mx-auto flex w-full max-w-[1480px] min-w-0 flex-col gap-3.5 xl:gap-4">
            <div className="flex w-full min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between xl:items-center">
              <div className="flex min-w-0 items-start gap-3">
                <button
                  type="button"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
                  onClick={() => setMobileSidebarOpen((value) => !value)}
                  aria-label={mobileSidebarLabel}
                  title={mobileSidebarLabel}
                  aria-controls="sidebar"
                  aria-expanded={mobileSidebarOpen}
                >
                  {mobileSidebarOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
                </button>

                <div className="min-w-0">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="info-chip">{primaryRoleLabel}</span>
                    <span className="info-chip hidden sm:inline-flex">{activePage.quickAction}</span>
                  </div>
                  <h2 className="mt-2 truncate text-[clamp(1.15rem,3vw,1.45rem)] font-bold leading-tight text-slate-950">{activePage.title}</h2>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-[13px]">{activePage.subtitle}</p>
                </div>
              </div>

              <div className="topbar-panel flex w-full min-w-0 flex-col gap-2.5 rounded-2xl px-3 py-3 lg:w-auto lg:min-w-[560px] lg:flex-row lg:items-center lg:justify-end xl:min-w-[720px] xl:flex-nowrap xl:gap-3">
                <label className="header-search min-w-0 flex-1">
                  <Search aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-slate-400" />
                  <input placeholder="Buscar estudiante, curso, docente..." />
                </label>

                <div className="topbar-utility-group flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
                  <select className="topbar-select h-10 w-full px-3 text-sm text-slate-700 outline-none sm:w-[168px]">
                    <option>Periodo 2026</option>
                    <option>Periodo 2025</option>
                  </select>

                  <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:justify-start">
                    <ThemeToggle />
                    <button
                      type="button"
                      className="icon-button flex h-10 w-10 items-center justify-center rounded-xl"
                      aria-label="Ver notificaciones"
                    >
                      <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
                    </button>
                    <button
                      type="button"
                      className="icon-button flex h-10 w-10 items-center justify-center rounded-xl"
                      aria-label="Ver mensajes"
                    >
                      <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" />
                    </button>

                    <div className="topbar-user-panel flex min-w-0 items-center gap-3 pl-1">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700">{userInitials}</div>
                      <div className="hidden min-w-0 sm:block">
                        <p className="truncate text-sm font-bold leading-none text-slate-900">{currentUser?.fullName ?? 'Acceso institucional'}</p>
                        <p className="mt-1 truncate text-[11px] text-slate-500">{primaryRoleLabel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="app-content-shell">
          <div className="mx-auto w-full max-w-[1480px] p-4 sm:p-5 lg:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
