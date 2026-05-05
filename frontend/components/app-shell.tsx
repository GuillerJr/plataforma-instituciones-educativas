"use client";

import type { ReactNode } from "react";
import type { CurrentUser } from "../lib/current-user";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  CircleHelp,
  ClipboardCheck,
  Eye,
  EyeOff,
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

const APP_HEADER_VISIBILITY_KEY = 'edu-app-header-visible';

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

export function AppShell({ children, currentUser }: Readonly<{ children: ReactNode; currentUser: CurrentUser | null }>) {
  const rawPathname = usePathname() ?? "/sistema";
  const pathname = useMemo(() => normalizePathname(rawPathname), [rawPathname]);
  const activePage = useMemo(() => getActivePage(pathname), [pathname]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const userInitials = useMemo(() => getUserInitials(currentUser?.fullName), [currentUser?.fullName]);

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
    const storedPreference = window.localStorage.getItem(APP_HEADER_VISIBILITY_KEY);
    if (storedPreference === 'false') setHeaderVisible(false);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(APP_HEADER_VISIBILITY_KEY, String(headerVisible));
  }, [headerVisible]);

  const allowedNavigationItems = useMemo(() => {
    if (!currentUser) return navigationItems.filter((item) => item.href === '/sistema/panel');
    return navigationItems.filter((item) => item.roles.some((role) => currentUser.roleCodes.includes(role)));
  }, [currentUser]);

  return (
    <div className="app-frame min-h-screen text-slate-900 transition-colors duration-300">
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          mobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside
        id="sidebar"
        aria-label="Navegación principal"
        className={`app-sidebar-panel fixed inset-y-0 left-0 z-50 flex w-[272px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden px-3 py-4 shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 pb-4">
          <Link href="/sistema/panel" className="flex min-w-0 items-center gap-3" onClick={() => setMobileSidebarOpen(false)}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 font-bold text-white">
              E
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-[15px] font-bold leading-none text-slate-950">EduSmart</h1>
              <p className="mt-1 truncate text-[11px] font-medium text-slate-500">Gestión institucional</p>
            </div>
          </Link>

          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar navegación"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <nav className="soft-scroll sidebar-scroll min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
          {allowedNavigationItems.map((item) => {
            const isActive = isActiveNavigationItem(pathname, item.href);
            const Icon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? "bg-white/10 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate">{item.label}</span>
                  <span className={`hidden truncate text-[11px] font-medium xl:block ${isActive ? "text-white/70" : "text-slate-400"}`}>
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
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <Globe2 aria-hidden="true" className="h-[18px] w-[18px]" />
            <span>Sitio público</span>
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <CircleHelp aria-hidden="true" className="h-[18px] w-[18px]" />
            <span>Ayuda</span>
          </button>
        </nav>

      </aside>

      <main className="app-main min-h-screen min-w-0 overflow-x-hidden lg:pl-[272px]">
        {!headerVisible ? (
          <div className="fixed right-4 top-4 z-40 flex items-center gap-2 sm:right-5 lg:right-6">
            <button
              type="button"
              className="icon-button flex h-10 w-10 items-center justify-center rounded-lg lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Abrir navegación"
              aria-controls="sidebar"
              aria-expanded={mobileSidebarOpen}
            >
              <Menu aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="compact-button flex h-10 items-center gap-2 rounded-lg px-3"
              onClick={() => setHeaderVisible(true)}
              aria-label="Mostrar encabezado"
            >
              <Eye aria-hidden="true" className="h-4 w-4" />
              <span className="hidden sm:inline">Mostrar encabezado</span>
            </button>
          </div>
        ) : null}

        <header
          className={`topbar-surface fixed left-0 right-0 top-0 z-30 px-4 py-2.5 backdrop-blur transition-all duration-300 sm:px-5 lg:left-[272px] lg:px-6 ${
            headerVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
          }`}
        >
          <div className="mx-auto flex w-full max-w-[1480px] min-w-0 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Abrir navegación"
                aria-controls="sidebar"
                aria-expanded={mobileSidebarOpen}
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h2 className="truncate text-[clamp(1.15rem,3vw,1.45rem)] font-bold leading-tight text-slate-950">{activePage.title}</h2>
                <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-slate-500 sm:text-[13px]">{activePage.subtitle}</p>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-2 xl:w-auto xl:flex-row xl:items-center">
              <div className="relative min-w-0 xl:w-[300px]">
                <input
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  placeholder="Buscar estudiante, curso, docente..."
                />
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
              </div>

              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-[150px]">
                  <option>Periodo 2026</option>
                  <option>Periodo 2025</option>
                </select>

                <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:justify-start">
                  <button
                    type="button"
                    className="compact-button hidden h-10 items-center gap-2 rounded-lg px-3 xl:inline-flex"
                    onClick={() => setHeaderVisible(false)}
                    aria-label="Ocultar encabezado"
                  >
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                    <span>Ocultar</span>
                  </button>
                  <ThemeToggle />
                  <button
                    type="button"
                    className="icon-button flex h-10 w-10 items-center justify-center rounded-lg"
                    aria-label="Ver notificaciones"
                  >
                    <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="icon-button flex h-10 w-10 items-center justify-center rounded-lg"
                    aria-label="Ver mensajes"
                  >
                    <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" />
                  </button>

                  <div className="flex min-w-0 items-center gap-3 pl-1">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-bold text-slate-700">{userInitials}</div>
                    <div className="hidden min-w-0 sm:block">
                      <p className="truncate text-sm font-bold leading-none text-slate-900">{currentUser?.fullName ?? 'Acceso institucional'}</p>
                      <p className="mt-1 truncate text-[11px] text-slate-500">{currentUser?.roleCodes?.[0] ?? 'Sesión activa'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className={`mx-auto w-full max-w-[1480px] p-4 transition-[padding] duration-300 sm:p-5 lg:p-6 ${headerVisible ? 'pt-28 sm:pt-32 xl:pt-24' : 'pt-20 sm:pt-20 xl:pt-6'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
