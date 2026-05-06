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
          <h2 className="table-title">Tu perfil puede consultar, pero no operar este módulo</h2>
          <p className="table-subtitle">La interfaz mantiene visibles los datos permitidos y oculta acciones de edición según el rol autenticado.</p>
        </div>
      </div>
      <div className="form-cluster m-5 text-sm text-slate-600">{fallback}</div>
    </section>
  );
}
