import Link from 'next/link';

const navigationItems = [
  { href: '/', label: 'Inicio' },
  { href: '/panel', label: 'Panel' },
  { href: '/instituciones', label: 'Instituciones' },
  { href: '/usuarios', label: 'Usuarios' },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),_transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <header className="glass-panel sticky top-4 z-20 mb-6 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <Link href="/" className="inline-flex items-center gap-3 text-white transition hover:text-slate-200">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-300 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.25)]">
                  E
                </span>
                <span>
                  <span className="block text-xs font-medium uppercase tracking-[0.28em] text-slate-400">Plataforma institucional</span>
                  <span className="block text-lg font-semibold tracking-tight">Educa</span>
                </span>
              </Link>
            </div>

            <nav className="flex flex-wrap gap-2">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href} className="nav-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
