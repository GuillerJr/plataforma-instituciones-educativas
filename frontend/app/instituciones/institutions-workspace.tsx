'use client';

import { useState } from 'react';
import { Building2, Mail, Pencil } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionAnchor, ActionButton } from '../../components/system-action';
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
        <WorkspacePrelude
          eyebrow="Estructura institucional"
          title="Estado real de sedes y registros base"
          description="La prioridad sigue siendo contacto, tipología y capacidad de seguimiento real, ahora con una composición más institucional y menos genérica."
          actions={
            <>
              <ActionButton label="Registro" icon={Building2} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
              <span className="info-chip">{institutions.length} registros</span>
            </>
          }
          metrics={[
            { label: 'Con contacto', value: institutionsWithContact, helper: 'Correo o teléfono cargado' },
            { label: 'Sin contacto', value: Math.max(institutions.length - institutionsWithContact, 0), helper: 'Pendientes de completar' },
          ]}
          sideLabel="Cobertura operativa"
          sideTitle="Registros listos para contacto y seguimiento"
          sideDescription="La vista mantiene el mismo alcance funcional y reorganiza la información para detectar rápido qué sedes ya están preparadas para operación administrativa."
          sideContent={
            <DetailList
              items={[
                { label: 'Con contacto', value: `${institutionsWithContact} registros con medios de contacto visibles.` },
                { label: 'Sin contacto', value: `${Math.max(institutions.length - institutionsWithContact, 0)} registros pendientes de completar.` },
              ]}
            />
          }
        />

        <DataSection
          eyebrow="Estructura institucional"
          title="Sedes y datos base"
          subtitle="Tabla responsiva para revisar ubicación, contacto y tipo de registro."
          actions={
            <>
              <span className="info-chip">{institutions.length} registros</span>
              <ActionButton label="Nuevo" icon={Building2} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </>
          }
        >

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
                            <ActionButton label="Editar" icon={Pencil} onClick={() => setEditingInstitution(institution)} />
                            {institution.contactEmail ? (
                              <ActionAnchor href={`mailto:${institution.contactEmail}`} label="Correo" icon={Mail} />
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
        </DataSection>
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
