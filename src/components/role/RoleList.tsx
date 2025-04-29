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

  return (
    <div className="role-list">
      <button onClick={startAdding}>Add New Role</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
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
