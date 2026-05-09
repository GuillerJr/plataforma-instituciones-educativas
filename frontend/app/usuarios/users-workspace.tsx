'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Mail, Pencil, UserPlus, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionAnchor, ActionButton } from '../../components/system-action';
import { UserFormModal, UserFormValues } from './user-create-form';
import type { PublicRequestRecord } from './page';

type EduUser = UserFormValues & {
  id: string;
  institutionName?: string | null;
};

type EduRole = {
  id: string;
  code: string;
  name: string;
  isSystem: boolean;
};

type InstitutionOption = {
  id: string;
  name: string;
};

type UsersWorkspaceProps = {
  users: EduUser[];
  roles: EduRole[];
  institutions: InstitutionOption[];
  publicRequests: PublicRequestRecord[];
  error: string | null;
};

export function UsersWorkspace({ users, roles, institutions, publicRequests, error }: UsersWorkspaceProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EduUser | null>(null);
  const [page, setPage] = useState(1);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestAction, setRequestAction] = useState<{ id: string; status: PublicRequestRecord['status'] } | null>(null);
  const [requestActionError, setRequestActionError] = useState<string | null>(null);
  const pageSize = 10;
  const requestsPageSize = 6;
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const totalRequestPages = Math.max(1, Math.ceil(publicRequests.length / requestsPageSize));
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);
  const paginatedPublicRequests = publicRequests.slice((requestsPage - 1) * requestsPageSize, requestsPage * requestsPageSize);
  const systemRoles = roles.filter((role) => role.isSystem).length;
  const usersByStatus = useMemo(() => ({
    active: users.filter((user) => user.status === 'active').length,
    pending: users.filter((user) => user.status === 'pending').length,
    blocked: users.filter((user) => user.status === 'blocked').length,
  }), [users]);
  const rolesInUse = useMemo(() => new Set(users.flatMap((user) => user.roleCodes)).size, [users]);
  const requestsByStatus = useMemo(() => ({
    new: publicRequests.filter((request) => request.status === 'new').length,
    inReview: publicRequests.filter((request) => request.status === 'in_review').length,
    closed: publicRequests.filter((request) => request.status === 'resolved' || request.status === 'discarded').length,
  }), [publicRequests]);

  async function updateRequestStatus(id: string, status: PublicRequestRecord['status']) {
    setRequestAction({ id, status });
    setRequestActionError(null);

    try {
      const response = await fetch(`/api/backend/public-requests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json().catch(() => null) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? 'No fue posible actualizar la solicitud.');
      }

      router.refresh();
    } catch (error) {
      setRequestActionError(error instanceof Error ? error.message : 'No fue posible actualizar la solicitud.');
    } finally {
      setRequestAction(null);
    }
  }

  return (
    <>
      <div className="space-y-5">
        <WorkspacePrelude
          eyebrow="Gobierno de acceso"
          title="Estado real de usuarios y perfiles"
          description="La pantalla prioriza lectura útil para decidir altas, bloqueos, cobertura por rol y sedes con una jerarquía visual más fuerte."
          actions={<ActionButton label="Usuario" icon={UserPlus} onClick={() => setCreateOpen(true)} />}
          metrics={[
            { label: 'Activos', value: usersByStatus.active, helper: 'Cuentas habilitadas' },
            { label: 'Pendientes', value: usersByStatus.pending, helper: 'Requieren seguimiento' },
            { label: 'Bloqueados', value: usersByStatus.blocked, helper: 'Suspendidos' },
            { label: 'Roles en uso', value: rolesInUse, helper: 'Cobertura operativa' },
            { label: 'Solicitudes', value: publicRequests.length, helper: 'Entradas públicas' },
          ]}
          sideLabel="Catálogo de roles"
          sideTitle="Perfiles disponibles para la operación"
          sideDescription="Los perfiles y sedes ya disponibles siguen siendo los mismos, pero ahora se presentan con mejor lectura y separación visual."
          sideContent={
            <>
              <DetailList
                items={roles.map((role) => ({
                  label: role.code,
                  value: (
                    <div className="flex items-center justify-between gap-3">
                      <span>{role.name}</span>
                      <span className="info-chip">{role.isSystem ? 'Sistema' : 'Editable'}</span>
                    </div>
                  ),
                }))}
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="metric-tile">
                  <p className="summary-label">Roles del sistema</p>
                  <p className="summary-value">{systemRoles}</p>
                </div>
                <div className="metric-tile">
                  <p className="summary-label">Sedes disponibles</p>
                  <p className="summary-value">{institutions.length}</p>
                </div>
              </div>
            </>
          }
        />

        <DataSection
          eyebrow="Solicitudes públicas"
          title="Entradas recibidas desde el sitio público"
          subtitle="Seguimiento inicial de solicitudes de acceso, admisión o información antes de convertirlas en usuarios o procesos administrativos."
          actions={
            <>
              <span className="info-chip">{requestsByStatus.new} nuevas</span>
              <span className="info-chip">{requestsByStatus.inReview} en revisión</span>
              <span className="info-chip">{requestsByStatus.closed} cerradas</span>
            </>
          }
        >
          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : publicRequests.length === 0 ? (
            <div className="table-empty">Todavía no hay solicitudes públicas registradas.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1180px]">
                  <thead>
                    <tr>
                      <th>Solicitante</th>
                      <th>Motivo</th>
                      <th>Vinculación</th>
                      <th>Estado</th>
                      <th>Mensaje</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPublicRequests.map((request) => (
                      <tr key={request.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{request.fullName}</p>
                          <p className="mt-1 text-sm text-slate-500">{request.email}</p>
                        </td>
                        <td>
                          <p className="font-medium text-slate-950">{translateRequestType(request.requestType)}</p>
                          <p className="mt-1 text-sm text-slate-500">{formatDate(request.createdAt)}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{translateRelationship(request.relationship)}</p>
                          <p className="mt-1 text-xs text-slate-400">{request.sourceContext ?? 'Origen público'}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateRequestStatus(request.status)}</span>
                        </td>
                        <td>
                          <p className="line-clamp-2 text-sm leading-6 text-slate-600">{request.message || 'Sin mensaje adicional.'}</p>
                        </td>
                        <td>
                          <div className="table-actions">
                            {request.status !== 'in_review' ? (
                              <ActionButton
                                label="Marcar en revisión"
                                icon={Clock3}
                                disabled={requestAction?.id === request.id}
                                onClick={() => updateRequestStatus(request.id, 'in_review')}
                              />
                            ) : null}
                            {request.status !== 'resolved' ? (
                              <ActionButton
                                label="Marcar resuelta"
                                icon={CheckCircle2}
                                disabled={requestAction?.id === request.id}
                                onClick={() => updateRequestStatus(request.id, 'resolved')}
                              />
                            ) : null}
                            {request.status !== 'discarded' ? (
                              <ActionButton
                                label="Descartar"
                                icon={XCircle}
                                disabled={requestAction?.id === request.id}
                                onClick={() => updateRequestStatus(request.id, 'discarded')}
                              />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationControls
                page={requestsPage}
                totalPages={totalRequestPages}
                pageSize={requestsPageSize}
                totalItems={publicRequests.length}
                itemLabel="solicitudes"
                onPageChange={setRequestsPage}
              />
              {requestActionError ? <div className="px-5 pb-5 text-sm text-rose-700">{requestActionError}</div> : null}
            </>
          )}
        </DataSection>

        <DataSection
          eyebrow="Usuarios registrados"
          title="Accesos y perfiles del colegio"
          subtitle="Tabla responsiva para revisar responsables, sede asignada, roles, estado y acciones rápidas."
          actions={
            <>
              <span className="info-chip">{users.length} usuarios</span>
              <ActionButton label="Nuevo" icon={UserPlus} className="w-full sm:w-auto" onClick={() => setCreateOpen(true)} />
            </>
          }
        >

          {error ? (
            <div className="table-empty text-rose-700">{error}</div>
          ) : users.length === 0 ? (
            <div className="table-empty">Todavía no hay usuarios registrados.</div>
          ) : (
            <>
              <div className="table-scroller">
                <table className="data-table min-w-[1120px]">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Sede</th>
                      <th>Roles</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <p className="font-semibold text-slate-950">{user.fullName}</p>
                          <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{user.institutionName ?? 'Sin sede asociada'}</p>
                        </td>
                        <td>
                          <p className="text-sm text-slate-600">{user.roleCodes.join(', ')}</p>
                        </td>
                        <td>
                          <span className="info-chip h-fit">{translateUserStatus(user.status)}</span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <ActionButton label="Editar" icon={Pencil} onClick={() => setEditingUser(user)} />
                            <ActionAnchor href={`mailto:${user.email}`} label="Correo" icon={Mail} />
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
                totalItems={users.length}
                itemLabel="usuarios"
                onPageChange={setPage}
              />
            </>
          )}
        </DataSection>
      </div>

      <UserFormModal
        open={createOpen}
        mode="create"
        institutions={institutions}
        roles={roles}
        onClose={() => setCreateOpen(false)}
      />
      <UserFormModal
        open={editingUser !== null}
        mode="edit"
        initialValues={editingUser ?? undefined}
        institutions={institutions}
        roles={roles}
        onClose={() => setEditingUser(null)}
      />
    </>
  );
}

function translateUserStatus(status: EduUser['status']) {
  if (status === 'active') return 'Activo';
  if (status === 'pending') return 'Pendiente';
  return 'Bloqueado';
}

function translateRequestType(requestType: PublicRequestRecord['requestType']) {
  if (requestType === 'admision') return 'Admisión';
  if (requestType === 'informacion') return 'Información';
  return 'Acceso al sistema';
}

function translateRelationship(relationship: PublicRequestRecord['relationship']) {
  if (relationship === 'familia') return 'Familia';
  if (relationship === 'docente') return 'Docente';
  if (relationship === 'administrativo') return 'Administrativo';
  return 'Aspirante';
}

function translateRequestStatus(status: PublicRequestRecord['status']) {
  if (status === 'new') return 'Nueva';
  if (status === 'in_review') return 'En revisión';
  if (status === 'resolved') return 'Resuelta';
  return 'Descartada';
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
