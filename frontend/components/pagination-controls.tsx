'use client';

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
};

export function PaginationControls({ page, totalPages, pageSize, totalItems, itemLabel, onPageChange }: PaginationControlsProps) {
  if (totalItems <= pageSize) return null;

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination-bar">
      <p className="leading-6 text-slate-600">
        Mostrando {start}-{end} de {totalItems} {itemLabel}
      </p>
      <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
        <button type="button" className="compact-button w-full sm:w-auto" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </button>
        <span className="info-chip justify-center">
          Página {page} de {totalPages}
        </span>
        <button type="button" className="compact-button w-full sm:w-auto" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
}
