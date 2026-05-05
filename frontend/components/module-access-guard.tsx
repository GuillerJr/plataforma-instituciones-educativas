import type { ReactNode } from 'react';

export function ModuleAccessGuard({
  allowed,
  fallback,
}: {
  allowed: boolean;
  fallback: ReactNode;
}) {
  if (allowed) return null;

  return (
    <section className="table-shell overflow-hidden">
      <div className="table-toolbar soft-divider">
        <div>
          <p className="eyebrow">Acceso restringido</p>
          <h2 className="table-title">Tu perfil puede consultar, pero no administrar este módulo</h2>
          <p className="table-subtitle">Se ocultan acciones operativas para mantener coherencia con el rol del usuario logueado.</p>
        </div>
      </div>
      <div className="p-5 text-sm text-slate-600">{fallback}</div>
    </section>
  );
}
