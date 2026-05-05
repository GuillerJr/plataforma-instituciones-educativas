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

export function AppShell({ children, currentUser }: Readonly<{ children: ReactNode; currentUser: CurrentUser | null }>) {
  const rawPathname = usePathname() ?? "/sistema";
  const pathname = useMemo(() => normalizePathname(rawPathname), [rawPathname]);
  const activePage = useMemo(() => getActivePage(pathname), [pathname]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        className={`app-sidebar-panel fixed inset-y-0 left-0 z-50 flex w-[288px] max-w-[calc(100vw-1rem)] flex-col overflow-hidden px-4 py-5 shadow-2xl transition-transform duration-300 ease-out lg:translate-x-0 lg:shadow-none ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between pb-5">
          <Link href="/sistema/panel" className="flex min-w-0 items-center gap-3" onClick={() => setMobileSidebarOpen(false)}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-900 font-extrabold text-white shadow-soft">
              E
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-[18px] font-extrabold leading-none text-ink">EduSmart</h1>
              <p className="mt-1 truncate text-[11px] font-medium text-muted">Gestión institucional</p>
            </div>
          </Link>

          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Cerrar navegación"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 shrink-0 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-extrabold text-brand-700">AG</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-gray-800">{currentUser?.fullName ?? 'Acceso institucional'}</p>
              <p className="truncate text-[11px] font-medium text-muted">{currentUser?.roleCodes?.[0] ?? 'Sesión activa'}</p>
            </div>
          </div>
        </div>

        <nav className="soft-scroll sidebar-scroll min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">
          {allowedNavigationItems.map((item) => {
            const isActive = isActiveNavigationItem(pathname, item.href);
            const Icon = item.Icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-brand-600 text-white shadow-soft" : "text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isActive ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate">{item.label}</span>
                  <span className={`hidden truncate text-[11px] font-medium xl:block ${isActive ? "text-white/75" : "text-gray-400"}`}>
                    {item.description}
                  </span>
                </span>
              </Link>
            );
          })}

          <div className="my-4 h-px bg-gray-100" />

          <Link
            href="/"
            onClick={() => setMobileSidebarOpen(false)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
          >
            <Globe2 aria-hidden="true" className="h-[18px] w-[18px]" />
            <span>Sitio público</span>
          </Link>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
          >
            <CircleHelp aria-hidden="true" className="h-[18px] w-[18px]" />
            <span>Ayuda</span>
          </button>
        </nav>

      </aside>

      <main className="app-main min-h-screen min-w-0 overflow-x-hidden lg:pl-[288px]">
        <header className="topbar-surface sticky top-0 z-30 px-4 py-3 backdrop-blur sm:px-5 lg:px-6">
          <div className="mx-auto flex w-full max-w-[1600px] min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-brand-50 lg:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Abrir navegación"
                aria-controls="sidebar"
                aria-expanded={mobileSidebarOpen}
              >
                <Menu aria-hidden="true" className="h-5 w-5" />
              </button>

              <div className="min-w-0">
                <h2 className="truncate text-[clamp(1.25rem,3.5vw,1.75rem)] font-extrabold leading-tight text-ink">{activePage.title}</h2>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted sm:text-sm">{activePage.subtitle}</p>
              </div>
            </div>

            <div className="flex w-full min-w-0 flex-col gap-3 xl:w-auto xl:flex-row xl:items-center">
              <div className="relative min-w-0 xl:w-[320px]">
                <input
                  className="h-[42px] w-full rounded-xl border border-gray-200 bg-[#FAFBFC] pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
                  placeholder="Buscar estudiante, curso, docente..."
                />
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
              </div>

              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                <select className="h-[42px] w-full rounded-xl border border-gray-200 bg-[#FAFBFC] px-3 text-sm text-gray-700 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100 sm:w-[155px]">
                  <option>Periodo 2026</option>
                  <option>Periodo 2025</option>
                </select>

                <div className="flex min-w-0 shrink-0 flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:justify-start">
                  <ThemeToggle />
                  <button
                    type="button"
                    className="icon-button flex h-[42px] w-[42px] items-center justify-center rounded-xl"
                    aria-label="Ver notificaciones"
                  >
                    <Bell aria-hidden="true" className="h-[18px] w-[18px]" />
                  </button>
                  <button
                    type="button"
                    className="icon-button flex h-[42px] w-[42px] items-center justify-center rounded-xl"
                    aria-label="Ver mensajes"
                  >
                    <MessageCircle aria-hidden="true" className="h-[18px] w-[18px]" />
                  </button>

                  <div className="flex min-w-0 items-center gap-3 pl-1">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-800 font-bold text-white">AG</div>
                    <div className="hidden min-w-0 sm:block">
                      <p className="truncate text-sm font-bold leading-none text-gray-800">{currentUser?.fullName ?? 'Acceso institucional'}</p>
                      <p className="mt-1 truncate text-[11px] text-muted">{currentUser?.roleCodes?.[0] ?? 'Sesión activa'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-5 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
