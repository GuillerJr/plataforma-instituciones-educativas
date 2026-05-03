"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigationItems = [
  { href: '/', label: 'Inicio' },
  { href: '/panel', label: 'Panel' },
  { href: '/instituciones', label: 'Instituciones' },
  { href: '/usuarios', label: 'Usuarios' },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_22%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <aside className="app-sidebar hidden w-[290px] shrink-0 lg:flex lg:flex-col lg:p-6">
          <Link href="/" className="inline-flex items-center gap-3 text-slate-950 transition hover:text-sky-700">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(2,132,199,0.22)]">
              E
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Plataforma educativa</span>
              <span className="block text-lg font-semibold tracking-tight">Educa</span>
            </span>
          </Link>

          <div className="mt-8 space-y-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`app-sidebar-link ${isActive ? 'app-sidebar-link-active' : ''}`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-600">
                    {item.label.slice(0, 1)}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-auto rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="eyebrow">Entorno institucional</p>
            <h2 className="mt-3 text-lg font-semibold text-slate-950">Operación clara para autoridades y estudiantes</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Navegación simple, superficies limpias y acceso directo a los módulos principales.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="topbar-panel sticky top-4 z-20 mb-6 px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <Link href="/" className="inline-flex items-center gap-3 text-slate-950 transition hover:text-sky-700 lg:hidden">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-600 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(2,132,199,0.22)]">
                    E
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Plataforma educativa</span>
                    <span className="block text-lg font-semibold tracking-tight">Educa</span>
                  </span>
                </Link>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-slate-500">Plataforma institucional educativa</p>
                  <h1 className="text-xl font-semibold tracking-tight text-slate-950">Gestión académica y administrativa</h1>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:hidden">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href} className="nav-link">
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <span className="info-chip">Interfaz clara</span>
                <span className="info-chip">Flujo administrativo</span>
              </div>
            </div>
          </header>

          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
