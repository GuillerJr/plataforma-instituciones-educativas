import Link from 'next/link';

export const dynamic = 'force-dynamic';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4100/api';

type DashboardPayload = {
  metrics: {
    institutions: number;
    users: number;
    activeUsers: number;
    roles: number;
  };
  institutions: Array<{
    id: string;
    name: string;
    slug: string;
    activeSchoolYearLabel?: string | null;
  }>;
  recentUsers: Array<{
    id: string;
    fullName: string;
    email: string;
    status: string;
    institutionName?: string | null;
  }>;
};

async function loadDashboard() {
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@educa.local', password: 'Educa2026!' }),
    cache: 'no-store',
  });

  if (!loginResponse.ok) {
    return { dashboard: null as DashboardPayload | null, error: 'No fue posible autenticar el panel demo.' };
  }

  const loginPayload = (await loginResponse.json()) as { data?: { accessToken?: string } };
  const accessToken = loginPayload.data?.accessToken;

  if (!accessToken) {
    return { dashboard: null as DashboardPayload | null, error: 'No se recibió token de acceso.' };
  }

  const dashboardResponse = await fetch(`${API_BASE_URL}/system/dashboard`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });

  if (!dashboardResponse.ok) {
    return { dashboard: null as DashboardPayload | null, error: 'No fue posible cargar el dashboard.' };
  }

  const payload = (await dashboardResponse.json()) as { data?: DashboardPayload };
  return { dashboard: payload.data ?? null, error: null };
}

export default async function PanelPage() {
  const { dashboard, error } = await loadDashboard();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-300">Panel administrativo inicial</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Vista central de operación educativa</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Este panel ya resume instituciones, usuarios, usuarios activos y roles del sistema a partir de la API protegida.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/instituciones" className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
            Instituciones
          </Link>
          <Link href="/usuarios" className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10">
            Usuarios
          </Link>
        </div>
      </div>

      {error || !dashboard ? (
        <div className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">{error ?? 'No hay datos del dashboard.'}</div>
      ) : (
        <>
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Instituciones" value={dashboard.metrics.institutions} />
            <MetricCard label="Usuarios" value={dashboard.metrics.users} />
            <MetricCard label="Usuarios activos" value={dashboard.metrics.activeUsers} />
            <MetricCard label="Roles" value={dashboard.metrics.roles} />
          </section>

          <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Instituciones recientes</p>
              </div>
              <div>
                {dashboard.institutions.map((institution) => (
                  <div key={institution.id} className="border-b border-white/6 px-5 py-4 text-sm text-slate-200 last:border-b-0">
                    <p className="font-medium text-white">{institution.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{institution.slug}</p>
                    <p className="mt-2 text-xs text-slate-400">Año activo: {institution.activeSchoolYearLabel ?? 'Por definir'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Usuarios recientes</p>
              </div>
              <div>
                {dashboard.recentUsers.map((user) => (
                  <div key={user.id} className="border-b border-white/6 px-5 py-4 text-sm text-slate-200 last:border-b-0">
                    <p className="font-medium text-white">{user.fullName}</p>
                    <p className="mt-1 text-xs text-slate-500">{user.email}</p>
                    <p className="mt-2 text-xs text-slate-400">{user.institutionName ?? 'Global / sin institución'} · {user.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
    </div>
  );
}
