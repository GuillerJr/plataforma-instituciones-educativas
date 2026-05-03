'use client';

import { useState } from 'react';
import { PaginationControls } from '../../components/pagination-controls';
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

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="section-grid-card">
            <div className="flex flex-col gap-4">
              <div>
                <p className="eyebrow">Acciones de usuario</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">Altas y edición desde una vista compacta</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  La creación se resuelve en modal y la futura edición ya está preparada desde cada fila, evitando formularios largos dentro de la pantalla principal.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="primary-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                  Crear usuario
                </button>
                <span className="info-chip">{users.length} registrados</span>
              </div>

              <div className="surface-muted p-4 text-sm text-slate-600">
                El flujo actual de creación sigue operativo sobre la API protegida. La edición queda lista en interfaz sin modificar backend.
              </div>
            </div>
          </aside>

          <aside className="section-grid-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Catálogo de roles</p>
                <p className="mt-2 text-sm text-slate-500">Perfiles disponibles para el trabajo institucional actual.</p>
              </div>
              <span className="info-chip">{roles.length} roles</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {roles.map((role) => (
                <div key={role.id} className="surface-muted p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-slate-950">{role.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{role.code}</p>
                    </div>
                    <span className="info-chip">{role.isSystem ? 'Sistema' : 'Editable'}</span>
                  </div>
                </div>
              ))}
            </div>
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
          </aside>
        </div>

        <section className="table-shell overflow-hidden">
          <div className="table-toolbar soft-divider">
            <div>
              <p className="eyebrow">Usuarios registrados</p>
              <h2 className="table-title">Accesos y perfiles del colegio</h2>
              <p className="table-subtitle">Tabla responsiva para revisar responsables, sede asignada, roles, estado y acciones rápidas.</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
              <span className="info-chip">{users.length} usuarios</span>
              <button type="button" className="compact-button w-full sm:w-auto" onClick={() => setCreateOpen(true)}>
                Crear
              </button>
            </div>
          </div>

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
                            <button type="button" className="compact-button" onClick={() => setEditingUser(user)}>
                              Editar
                            </button>
                            <a href={`mailto:${user.email}`} className="compact-button">
                              Correo
                            </a>
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
        </section>
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
