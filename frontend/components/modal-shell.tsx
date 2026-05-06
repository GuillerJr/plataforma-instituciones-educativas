'use client';

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

type ModalShellProps = {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
};

export function ModalShell({ open, title, description, onClose, children }: ModalShellProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="modal-panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" aria-label="Cerrar modal" className="modal-close" onClick={onClose}>
          <X aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="modal-hero-shell relative overflow-hidden rounded-2xl border border-blue-100/80 bg-[linear-gradient(135deg,#ffffff_0%,#f1f7ff_100%)] p-5 pr-12 sm:pr-14">
          <div aria-hidden="true" className="modal-hero-glow absolute -right-14 -top-16 h-36 w-36 rounded-full bg-blue-100/80 blur-2xl" />
          <div className="modal-hero-content relative">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">Formulario</p>
              <span className="info-chip">Edicion operativa</span>
            </div>
            <h2 id="modal-title" className="mt-3 text-[clamp(1.35rem,4vw,1.5rem)] font-semibold leading-tight text-slate-950">{title}</h2>
            <p id="modal-description" className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {description}
            </p>
          </div>
        </div>

        <div className="modal-content-shell mt-5 rounded-2xl border border-slate-200/90 bg-white/70 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] sm:p-5">{children}</div>
      </div>
    </div>
  );
}
