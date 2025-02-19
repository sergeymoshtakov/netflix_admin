import React, { useState } from 'react';
import { Role } from '../models/AppUser';

interface RoleListProps {
  roles: Role[];
  onEditRole: (role: Role, index: number) => void;
  onDeleteRole: (index: number) => void;
}

const RoleList: React.FC<RoleListProps> = ({ roles, onEditRole, onDeleteRole }) => {
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startEditing = (role: Role, index: number) => {
    setEditingRole(role);
    setEditingIndex(index);
  };

  const handleSave = (role: Role) => {
    if (editingIndex !== null) {
      onEditRole(role, editingIndex);
    }
    setEditingRole(null);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingRole(null);
    setEditingIndex(null);
  };

  return (
    <div className="role-list">
      <h2>Roles</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <button onClick={() => startEditing(role, index)}>Edit</button>
                <button onClick={() => onDeleteRole(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingRole && (
        <div className="role-edit-form">
          <h3>Edit Role</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave(editingRole);
            }}
          >
            <div>
              <label htmlFor="role-name">Name</label>
              <input
                type="text"
                id="role-name"
                value={editingRole.name}
                onChange={(e) =>
                  setEditingRole({ ...editingRole, name: e.target.value })
                }
                required
              />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RoleList;