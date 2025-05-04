import React, { useState } from 'react';
import RoleEdit from './RoleEdit';
import { Role } from '../../models/AppUser';

interface RoleListProps {
  roles: Role[];
  onAddRole: (role: Role) => void;
  onEditRole: (role: Role, index: number) => void;
  onDeleteRole: (index: number) => void;
}

const RoleList: React.FC<RoleListProps> = ({
  roles,
  onAddRole,
  onEditRole,
  onDeleteRole,
}) => {
  const [currentRole, setCurrentRole] = useState<Role>({ id: 0, name: '' });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const startAdding = () => {
    setCurrentRole({ id: Date.now(), name: '' });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (role: Role, index: number) => {
    setCurrentRole({ ...role });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveRole = (role: Role) => {
    if (isEditMode && editingIndex !== null) {
      onEditRole(role, editingIndex);
    } else {
      onAddRole(role);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredRoles = roles
    .filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const sortIcon = sortOrder === 'asc' ? '▲' : '▼';

  return (
    <div className="role-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Role</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-field"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={toggleSortOrder}>
              Name {sortIcon}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((role, index) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                <button onClick={() => startEditing(role, index)}>Edit</button>
                <button onClick={() => onDeleteRole(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditorVisible && (
        <RoleEdit
          role={currentRole}
          isEditMode={isEditMode}
          onSave={saveRole}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default RoleList;
