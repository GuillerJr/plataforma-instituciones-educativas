'use client';

import { useState } from 'react';
import { PaginationControls } from '../../components/pagination-controls';
import { InstitutionFormModal, InstitutionFormValues } from './institution-create-form';

type Institution = InstitutionFormValues & {
  id: string;
};

type InstitutionsWorkspaceProps = {
  institutions: Institution[];
  error: string | null;
};

export function InstitutionsWorkspace({ institutions, error }: InstitutionsWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(institutions.length / pageSize));
  const paginatedInstitutions = institutions.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <div className="space-y-5">
        <aside className="section-grid-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Acciones institucionales</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">Altas y edici\u00f3n sin sacar el foco del listado</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                La vista principal se mantiene libre de formularios persistentes. El alta y la futura edici\u00f3n viven en modal para favorecer lectura y velocidad operativa.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button type="button" className="primary-button" onClick={() => setCreateOpen(true)}>
                Nuevo registro
              </button>
              <span className="info-chip">{institutions.length} registros</span>
            </div>
          </div>
        </aside>

        <section className="table-shell">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Registro institucional</p>
              <h2 className="table-title">Sedes y datos institucionales</h2>
              <p className="table-subtitle">Tabla responsiva para revisar informaci\u00f3n operativa, contacto y ciclo activo.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="info-chip">{institutions.length} registros</span>
              <button type="button" className="compact-button" onClick={() => setCreateOpen(true)}>
                Crear
              </button>
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : institutions.length === 0 ? (
            <div className="table-empty">Todav\u00eda no hay registros institucionales.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[980px]">
                  <thead>
                    <tr>
                      <th>Registro</th>
                      <th>Tipo</th>
                      <th>A\u00f1o lectivo</th>
                      <th>Contacto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedInstitutions.map((institution) => (
                      <tr key={institution.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{institution.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{institution.slug}</p>
                          <p className="mt-2 text-sm text-slate-500">{institution.address ?? 'Direcci\u00f3n por definir'}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateInstitutionType(institution.institutionType)}</span>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{institution.activeSchoolYearLabel ?? 'Año por definir'}</span>
                        </td>
                        <td>
                          <div className="space-y-1 text-sm text-slate-600">
                            <p>{institution.contactEmail ?? 'Sin correo'}</p>
                            <p>{institution.contactPhone ?? 'Sin tel\u00e9fono'}</p>
                          </div>
                        </td>
                        <td>
                          <button type="button" className="compact-button" onClick={() => setEditingInstitution(institution)}>
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={page}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={institutions.length}
                itemLabel="registros"
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </div>

      <InstitutionFormModal open={createOpen} mode="create" onClose={() => setCreateOpen(false)} />
      <InstitutionFormModal
        open={editingInstitution !== null}
        mode="edit"
        initialValues={editingInstitution ?? undefined}
        onClose={() => setEditingInstitution(null)}
      />
    </>
  );
}

function translateInstitutionType(type: Institution['institutionType']) {
  if (type === 'publica') return 'Pública';
  return 'Privada';
}
