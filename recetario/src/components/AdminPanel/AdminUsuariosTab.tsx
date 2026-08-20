import React from 'react';
import { Search } from 'lucide-react';
import type { UsuarioAdminItem } from '../../services/servicioAdmin';
import { LISTA_ROLES, type RolUsuario } from '../../types/auth.types';
import { ADMIN_TEXTS } from '../../constants/texts.js';

interface AdminUsuariosTabProps {
  usuarios: UsuarioAdminItem[];
  cargando: boolean;
  busqueda: string;
  setBusqueda: (val: string) => void;
  onCambiarRol: (usuarioId: string, nuevoRol: RolUsuario) => void;
}

export const AdminUsuariosTab: React.FC<AdminUsuariosTabProps> = ({
  usuarios,
  cargando,
  busqueda,
  setBusqueda,
  onCambiarRol,
}) => {
  return (
    <div className="admin-pane animate-fade">
      <div className="admin-search-wrapper">
        <Search size={18} className="search-icon-inside" />
        <input
          type="text"
          className="admin-search-input"
          placeholder={ADMIN_TEXTS.placeholderBuscarUsuario}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando ? (
        <p style={{ textAlign: 'center', padding: '20px' }}>{ADMIN_TEXTS.loadingUsuarios}</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{ADMIN_TEXTS.colNombre}</th>
                <th>{ADMIN_TEXTS.colEmail}</th>
                <th>{ADMIN_TEXTS.colRol}</th>
                <th>{ADMIN_TEXTS.colAcciones}</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.nombre}</strong></td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.rol.toLowerCase()}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>
                    <select
                      className="role-select"
                      value={u.rol}
                      onChange={(e) => onCambiarRol(u.id, e.target.value as RolUsuario)}
                    >
                      {LISTA_ROLES.map((rolItem) => (
                        <option key={rolItem} value={rolItem}>
                          {rolItem}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsuariosTab;
