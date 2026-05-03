"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigationItems = [
  { href: '/', label: 'Inicio', shortLabel: 'IN', description: 'Resumen general' },
  { href: '/panel', label: 'Panel', shortLabel: 'PA', description: 'Centro operativo' },
  { href: '/instituciones', label: 'Institución', shortLabel: 'IE', description: 'Datos y sedes' },
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
    title: 'Institución y sedes',
    subtitle: 'Datos institucionales, sedes y contacto operativo en una sola vista.',
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
    <div className="min-h-screen bg-[#f3f6fb] text-slate-900">
      {mobileSidebarOpen ? (
        <div className="mobile-sidebar-overlay lg:hidden" onClick={() => setMobileSidebarOpen(false)}>
          <aside className="mobile-sidebar-panel" onClick={(event) => event.stopPropagation()}>
            <SidebarContent pathname={pathname ?? '/'} onNavigate={() => setMobileSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-5 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <aside className="app-sidebar hidden w-[284px] shrink-0 lg:flex lg:flex-col lg:p-4">
          <SidebarContent pathname={pathname ?? '/'} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="topbar-panel sticky top-4 z-20 mb-5 px-4 py-3.5 sm:px-5 lg:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3 lg:hidden">
                  <button type="button" className="icon-button" aria-label="Abrir navegación" onClick={() => setMobileSidebarOpen(true)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-slate-700">
                      <path d="M4 7h16v1.5H4V7Zm0 4.25h16v1.5H4v-1.5ZM4 15.5h16V17H4v-1.5Z" fill="currentColor" />
                    </svg>
                  </button>

                  <Link href="/" className="inline-flex items-center gap-3 text-slate-950 transition hover:text-sky-700">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
                      ED
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Gesti\u00f3n escolar</span>
                      <span className="block text-lg font-semibold tracking-tight">Campus Central</span>
                    </span>
                  </Link>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">Sistema institucional</p>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{activePage.title}</h1>
                  <p className="mt-1 hidden text-sm text-slate-500 lg:block">{activePage.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:min-w-[520px] xl:max-w-[680px] xl:flex-row xl:items-center xl:justify-end">
                <label className="header-search xl:flex-1">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 text-slate-400">
                    <path d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.43 1.06-1.06-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 1.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z" fill="currentColor" />
                  </svg>
                  <input aria-label="Buscar" placeholder="Buscar sede, usuario o módulo" />
                </label>

                <div className="flex items-center gap-3 xl:shrink-0">
                  <button type="button" className="icon-button" aria-label="Notificaciones">
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-sky-500" />
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-slate-600">
                      <path d="M12 3.75a4.25 4.25 0 0 0-4.25 4.25v1.02c0 .64-.2 1.26-.57 1.78L5.8 12.77A1.75 1.75 0 0 0 7.23 15.5h9.54a1.75 1.75 0 0 0 1.43-2.73l-1.38-1.97a3.23 3.23 0 0 1-.57-1.78V8A4.25 4.25 0 0 0 12 3.75Zm0 16.5a2.24 2.24 0 0 0 2.12-1.5H9.88A2.24 2.24 0 0 0 12 20.25Z" fill="currentColor" />
                    </svg>
                  </button>
                  <Link href="/usuarios" className="primary-button whitespace-nowrap">
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
      <div className="flex items-center justify-between rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3.5">
        <Link href="/" className="inline-flex items-center gap-3 text-slate-950 transition hover:text-sky-700" onClick={onNavigate}>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
            ED
          </span>
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Gesti\u00f3n escolar</span>
            <span className="block text-lg font-semibold tracking-tight">Campus Central</span>
          </span>
        </Link>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">En línea</span>
      </div>

      <div className="mt-4 rounded-[20px] border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Perfil activo</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sm font-semibold text-sky-700">AP</div>
          <div>
            <p className="font-semibold text-slate-950">Administraci\u00f3n general</p>
            <p className="text-sm text-slate-500">Rectorado y operaci\u00f3n</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Navegación</p>
      </div>

      <div className="mt-3 space-y-2">
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
      </div>

      <div className="mt-auto rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Seguimiento escolar</p>
        <h2 className="mt-3 text-lg font-semibold">87% de continuidad estudiantil este periodo</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          La interfaz ahora prioriza menos ruido visual, lectura r\u00e1pida y control diario para una sola instituci\u00f3n.
        </p>
        <Link href="/panel" className="mt-5 inline-flex items-center text-sm font-semibold text-sky-200 transition hover:text-white" onClick={onNavigate}>
          Abrir panel diario
        </Link>
      </div>
    </>
  );
}
