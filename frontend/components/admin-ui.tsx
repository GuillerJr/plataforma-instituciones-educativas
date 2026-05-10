import type { ReactNode } from 'react';

type MetricItem = {
  label: string;
  value: ReactNode;
  helper?: string;
};

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
    <section className="page-hero-v2">
      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
        <div>
          <span className="badge badge-blue">{badge}</span>
          <h1 className="mt-5 text-[clamp(1.75rem,3vw,2.4rem)]">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 sm:text-[15px]">{description}</p>
        </div>

        <aside className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="summary-item"
              >
                <p className="tiny-label">{metric.label}</p>
                <p className="summary-value">{metric.value}</p>
                {metric.helper ? <p className="mt-2 text-xs leading-5">{metric.helper}</p> : null}
              </div>
            ))}
          </div>

          <div className="summary-item">
            <p className="tiny-label">{noteTitle}</p>
            <div className="mt-3 text-sm leading-6 text-muted">{noteDescription}</div>
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
    <section className="workspace-prelude-v2 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
      <div className="workspace-prelude-primary">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h2 className="mt-3 text-[clamp(1.4rem,2.4vw,2rem)]">{title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 sm:text-[15px]">{description}</p>
            </div>
            {actions ? <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:flex-wrap">{actions}</div> : null}
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4 sm:p-6">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <p className="tiny-label">{metric.label}</p>
              <p className="summary-value">{metric.value}</p>
              {metric.helper ? <p className="mt-2 text-xs leading-5">{metric.helper}</p> : null}
            </div>
          ))}
        </div>
      </div>

      <aside className="workspace-prelude-side overflow-hidden">
        <div>
          <p className="eyebrow">{sideLabel}</p>
          <h3 className="mt-3 text-xl">{sideTitle}</h3>
          <p className="mt-3 text-sm leading-7">{sideDescription}</p>
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
    <section className="data-section-v2 overflow-hidden">
      <div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-3 text-[clamp(1.2rem,2vw,1.7rem)]">{title}</h2>
            <p className="mt-3 text-sm leading-7">{subtitle}</p>
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
        <div key={item.label} className="summary-item">
          <p className="tiny-label">{item.label}</p>
          <div className="mt-2 text-sm leading-6">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
