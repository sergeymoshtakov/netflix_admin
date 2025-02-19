import React, { useState } from 'react';
import { AppUser, Role } from '../models/AppUser';

interface RoleEditProps {
  user: AppUser;
  roles: Role[];
  onSave: (user: AppUser) => void;
  onCancel: () => void;
}

const RoleEdit: React.FC<RoleEditProps> = ({ user, roles, onSave, onCancel }) => {
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(user.roles || []);

  const handleRoleChange = (role: Role) => {
    if (selectedRoles.some((r) => r.id === role.id)) {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...user, roles: selectedRoles });
  };

  return (
    <div>
      <h3>Edit Roles for {user.username}</h3>
      <form onSubmit={handleSubmit}>
        {roles.map((role) => (
          <div key={role.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedRoles.some((r) => r.id === role.id)}
                onChange={() => handleRoleChange(role)}
              />
              {role.name}
            </label>
          </div>
        ))}
        <button type="submit">Save Roles</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default RoleEdit;