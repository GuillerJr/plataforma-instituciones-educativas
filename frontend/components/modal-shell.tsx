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

        <div className="modal-hero-shell">
          <div className="modal-hero-content">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">Formulario</p>
              <span className="info-chip">Edición operativa</span>
            </div>
            <h2 id="modal-title" className="mt-3 text-[clamp(1.35rem,4vw,1.5rem)]">{title}</h2>
            <p id="modal-description" className="mt-3 max-w-2xl text-sm leading-7">
              {description}
            </p>
          </div>
        </div>

        <div className="modal-content-shell">{children}</div>
      </div>
    </div>
  );
}
