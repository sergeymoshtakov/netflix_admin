import React, { useState } from 'react';
import { AppUser, Role } from '../models/AppUser';

interface UserEditProps {
  user: AppUser;
  roles: Role[];
  isEditMode: boolean;
  onSave: (user: AppUser) => void;
  onCancel: () => void;
}

const UserEdit: React.FC<UserEditProps> = ({ user, roles, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<AppUser>(user);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(user.roles || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRoleChange = (role: Role) => {
    if (selectedRoles.some((r) => r.id === role.id)) {
      setSelectedRoles(selectedRoles.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, roles: selectedRoles });
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit User' : 'Add User'}</h3>
      <form className="user-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="surname">Surname</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="phone_num">Phone</label>
          <input
            type="text"
            id="phone_num"
            name="phone_num"
            value={formData.phone_num}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="enc_password">Password</label>
          <input
            type="password"
            id="enc_password"
            name="enc_password"
            value={formData.enc_password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="avatar">Avatar URL</label>
          <input
            type="text"
            id="avatar"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isBanned"
              checked={formData.isBanned}
              onChange={handleChange}
            />
            Is banned
          </label>
        </div>
        <div>
          <h4>Roles</h4>
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
        </div>
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add User'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserEdit;