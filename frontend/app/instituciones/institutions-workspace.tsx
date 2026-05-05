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
  const institutionsWithContact = institutions.filter((institution) => institution.contactEmail || institution.contactPhone).length;

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="workspace-hero">
            <div className="table-toolbar soft-divider">
              <div>
                <p className="eyebrow">Estructura institucional</p>
                <h2 className="table-title">Estado real de sedes y registros base</h2>
                <p className="table-subtitle">La prioridad es contacto, tipología y capacidad de seguimiento real.</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                  Nuevo registro
                </button>
                <span className="info-chip">{institutions.length} registros</span>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              <div className="metric-tile">
                <p className="summary-label">Con contacto</p>
                <p className="summary-value">{institutionsWithContact}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Sin contacto</p>
                <p className="summary-value">{Math.max(institutions.length - institutionsWithContact, 0)}</p>
              </div>
            </div>
          </section>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Cobertura operativa</p>
                <p className="mt-2 text-sm text-slate-500">Registros con mejor preparación para contacto y seguimiento.</p>
              </div>
              <span className="info-chip">Resumen</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="metric-tile">
                <p className="summary-label">Con contacto</p>
                <p className="summary-value">{institutionsWithContact}</p>
              </div>
              <div className="metric-tile">
                <p className="summary-label">Sin contacto</p>
                <p className="summary-value">{Math.max(institutions.length - institutionsWithContact, 0)}</p>
              </div>
            </div>
          </aside>
        </div>

        <section className="table-shell">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Estructura institucional</p>
              <h2 className="table-title">Sedes y datos base</h2>
              <p className="table-subtitle">Tabla responsiva para revisar ubicación, contacto y tipo de registro.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{institutions.length} registros</span>
              <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                Crear
              </button>
            </div>
          </div>

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : institutions.length === 0 ? (
            <div className="table-empty">Todavía no hay sedes o datos base registrados.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[900px]">
                  <thead>
                    <tr>
                      <th>Registro</th>
                      <th>Tipo</th>
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
                          <p className="mt-2 text-sm text-slate-500">{institution.address ?? 'Dirección por definir'}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateInstitutionType(institution.institutionType)}</span>
                        </td>
                        <td>
                          <div className="space-y-1 text-sm text-slate-600">
                            <p>{institution.contactEmail ?? 'Sin correo'}</p>
                            <p>{institution.contactPhone ?? 'Sin teléfono'}</p>
                          </div>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button type="button" className="compact-button" onClick={() => setEditingInstitution(institution)}>
                              Editar
                            </button>
                            {institution.contactEmail ? (
                              <a href={`mailto:${institution.contactEmail}`} className="compact-button">
                                Correo
                              </a>
                            ) : null}
                          </div>
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
