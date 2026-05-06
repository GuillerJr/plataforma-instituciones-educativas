'use client';

import { useMemo, useState } from 'react';
import { Mail, Pencil, UserPlus } from 'lucide-react';
import { DataSection, DetailList, WorkspacePrelude } from '../../components/admin-ui';
import { PaginationControls } from '../../components/pagination-controls';
import { ActionAnchor, ActionButton } from '../../components/system-action';
import { UserFormModal, UserFormValues } from './user-create-form';

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
  error: string | null;
};

export function UsersWorkspace({ users, roles, institutions, error }: UsersWorkspaceProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EduUser | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const paginatedUsers = users.slice((page - 1) * pageSize, page * pageSize);
  const systemRoles = roles.filter((role) => role.isSystem).length;
  const usersByStatus = useMemo(() => ({
    active: users.filter((user) => user.status === 'active').length,
    pending: users.filter((user) => user.status === 'pending').length,
    blocked: users.filter((user) => user.status === 'blocked').length,
  }), [users]);
  const rolesInUse = useMemo(() => new Set(users.flatMap((user) => user.roleCodes)).size, [users]);

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
