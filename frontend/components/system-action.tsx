import type { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

type SharedActionProps = {
  label: string;
  icon: LucideIcon;
  className?: string;
  showLabel?: boolean;
};

function shouldShowMobileLabel(className?: string) {
  return /(^|\s)w-full(\s|$)/.test(className ?? '');
}

function getActionClassName(className?: string, showLabel?: boolean) {
  const showMobileLabel = shouldShowMobileLabel(className);

  if (showLabel || showMobileLabel) {
    return `compact-button action-button group min-h-10 min-w-0 shrink-0 justify-start gap-2.5 px-3.5 sm:h-10 sm:justify-center ${className ?? ''}`.trim();
  }

  return `compact-button action-button group h-10 w-10 shrink-0 justify-center px-0 ${className ?? ''}`.trim();
}

function ActionContent({ label, icon: Icon, showLabel = false, className }: SharedActionProps) {
  const showMobileLabel = shouldShowMobileLabel(className);

  return (
    <>
      <span>
        <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      </span>
      <span className={showLabel ? 'truncate' : showMobileLabel ? 'truncate text-left sm:sr-only' : 'sr-only'}>{label}</span>
    </>
  );
}

type ActionButtonProps = SharedActionProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function ActionButton({ label, icon, className, showLabel, type = 'button', ...props }: ActionButtonProps) {
  return (
    <button type={type} className={getActionClassName(className, showLabel)} title={label} aria-label={label} {...props}>
      <ActionContent label={label} icon={icon} className={className} showLabel={showLabel} />
    </button>
  );
}

export function ActionLink({
  href,
  label,
  icon,
  className,
  showLabel,
}: SharedActionProps & { href: string }) {
  return (
    <Link href={href} className={getActionClassName(className, showLabel)} title={label} aria-label={label}>
      <ActionContent label={label} icon={icon} className={className} showLabel={showLabel} />
    </Link>
  );
}

export function ActionAnchor({
  href,
  label,
  icon,
  className,
  showLabel,
}: SharedActionProps & { href: string }) {
  return (
    <a href={href} className={getActionClassName(className, showLabel)} title={label} aria-label={label}>
      <ActionContent label={label} icon={icon} className={className} showLabel={showLabel} />
    </a>
  );
}
