import type { ReactNode } from 'react';

type MetricItem = {
  label: string;
  value: ReactNode;
  helper?: string;
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function PageHero({
  badge,
  title,
  description,
  metrics,
  noteTitle,
  noteDescription,
}: {
  badge: string;
  title: string;
  description: string;
  metrics: MetricItem[];
  noteTitle: string;
  noteDescription: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f2f6fb_100%)] p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] lg:p-7">
      <div aria-hidden="true" className="absolute right-0 top-0 h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 left-16 h-40 w-40 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="relative grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
        <div>
          <span className="badge badge-blue">{badge}</span>
          <h1 className="mt-5 text-[clamp(1.75rem,3vw,2.4rem)] font-semibold leading-tight tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-[15px]">{description}</p>
        </div>

        <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.5rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)]"
              >
                <p className="tiny-label">{metric.label}</p>
                <p className="mt-2 text-[1.95rem] font-semibold leading-none tracking-tight text-slate-950">{metric.value}</p>
                {metric.helper ? <p className="mt-2 text-xs leading-5 text-slate-500">{metric.helper}</p> : null}
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/85 p-4">
            <p className="tiny-label">{noteTitle}</p>
            <div className="mt-3 text-sm leading-6 text-slate-600">{noteDescription}</div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export function WorkspacePrelude({
  eyebrow,
  title,
  description,
  actions,
  metrics,
  sideLabel,
  sideTitle,
  sideDescription,
  sideContent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  metrics: MetricItem[];
  sideLabel: string;
  sideTitle: string;
  sideDescription: string;
  sideContent?: ReactNode;
}) {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
      <div className="overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-[linear-gradient(180deg,#0f223d_0%,#17345f_100%)] text-white shadow-[0_28px_80px_rgba(15,23,42,0.18)]">
        <div className="border-b border-white/10 px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">{eyebrow}</p>
              <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight tracking-tight">{title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/72 sm:text-[15px]">{description}</p>
            </div>
            {actions ? <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-6">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={cx(
                'rounded-[1.35rem] border p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
                index === 0 && 'border-sky-300/20 bg-sky-400/10',
                index === 1 && 'border-emerald-300/20 bg-emerald-400/10',
                index === 2 && 'border-violet-300/20 bg-violet-400/10',
                index === 3 && 'border-amber-300/20 bg-amber-400/10',
              )}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">{metric.label}</p>
              <p className="mt-3 text-[2rem] font-semibold leading-none tracking-tight text-white">{metric.value}</p>
              {metric.helper ? <p className="mt-2 text-xs leading-5 text-white/60">{metric.helper}</p> : null}
            </div>
          ))}
        </div>
      </div>

      <aside className="overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f6f9fc_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
        <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
          <p className="eyebrow">{sideLabel}</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{sideTitle}</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{sideDescription}</p>
        </div>

        <div className="p-5 sm:p-6">{sideContent}</div>
      </aside>
    </section>
  );
}

export function DataSection({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.9rem] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7f9fc_100%)] shadow-[0_24px_70px_rgba(15,23,42,0.07)]">
      <div className="border-b border-slate-200/80 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-3 text-[clamp(1.2rem,2vw,1.7rem)] font-semibold tracking-tight text-slate-950">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{subtitle}</p>
          </div>
          {actions ? <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">{actions}</div> : null}
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}

export function DetailList({ items }: { items: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="rounded-[1.25rem] border border-slate-200/80 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
          <div className="mt-2 text-sm leading-6 text-slate-700">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
