import type { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

type SharedActionProps = {
  label: string;
  icon: LucideIcon;
  className?: string;
  hideLabelOnMobile?: boolean;
};

function getActionClassName(className?: string) {
  return className ? `compact-button action-button group ${className}` : 'compact-button action-button group';
}

function ActionContent({ label, icon: Icon, hideLabelOnMobile = false }: SharedActionProps) {
  return (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-white/80 text-slate-600 transition group-hover:border-slate-300 group-hover:text-slate-900">
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      </span>
      <span className={hideLabelOnMobile ? 'hidden sm:inline' : undefined}>{label}</span>
    </>
  );
}

type ActionButtonProps = SharedActionProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function ActionButton({ label, icon, className, hideLabelOnMobile, type = 'button', ...props }: ActionButtonProps) {
  return (
    <button type={type} className={getActionClassName(className)} title={label} {...props}>
      <ActionContent label={label} icon={icon} hideLabelOnMobile={hideLabelOnMobile} />
    </button>
  );
}

export function ActionLink({
  href,
  label,
  icon,
  className,
  hideLabelOnMobile,
}: SharedActionProps & { href: string }) {
  return (
    <Link href={href} className={getActionClassName(className)} title={label}>
      <ActionContent label={label} icon={icon} hideLabelOnMobile={hideLabelOnMobile} />
    </Link>
  );
}

export function ActionAnchor({
  href,
  label,
  icon,
  className,
  hideLabelOnMobile,
}: SharedActionProps & { href: string }) {
  return (
    <a href={href} className={getActionClassName(className)} title={label}>
      <ActionContent label={label} icon={icon} hideLabelOnMobile={hideLabelOnMobile} />
    </a>
  );
}
