import React, { useState } from 'react';
import { AppUser, Role } from '../../models/AppUser';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) newErrors.username = 'Username is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (!formData.encPassword) newErrors.encPassword = 'Password is required.';
    else if (formData.encPassword.length < 6) newErrors.encPassword = 'Password must be at least 6 characters.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSave({ ...formData, roles: selectedRoles });
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, avatar: 'Only image files are allowed.' }));
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, avatar: 'Image exceeds 5MB size limit.' }));
      return;
    }

    const url = URL.createObjectURL(file);
    setFormData({ ...formData, avatar: url });
    setErrors((prev) => ({ ...prev, avatar: '' }));
  };

  return (
    <div>
      <form className="user-form" onSubmit={handleSubmit}>
        <h3>{isEditMode ? 'Edit User' : 'Add User'}</h3>
        <br />
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
          {errors.username && <div className="error">{errors.username}</div>}
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
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="phoneNum">Phone</label>
          <input
            type="text"
            id="phoneNum"
            name="phoneNum"
            value={formData.phoneNum}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="encPassword">Password</label>
          <input
            type="password"
            id="encPassword"
            name="encPassword"
            value={formData.encPassword}
            onChange={handleChange}
            required
          />
          {errors.encPassword && <div className="error">{errors.encPassword}</div>}
        </div>
        <div>
          <label>Avatar</label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="avatar-upload" className="upload-button">Upload Avatar</label>
          {formData.avatar && (
            <div>
              <img src={formData.avatar} alt="Avatar preview" style={{ maxWidth: '100px', marginTop: '10px' }} />
            </div>
          )}
          {errors.avatar && <div className="error">{errors.avatar}</div>}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Is Active
          </label>
        </div>
        <div>
          <label>Roles</label>
          <div className="__select">
            <div className="__select__content">
              {roles.map((role) => (
                <React.Fragment key={role.id}>
                  <input
                    id={`role-${role.id}`}
                    className="__select__input"
                    type="checkbox"
                    checked={selectedRoles.some((r) => r.id === role.id)}
                    onChange={() => handleRoleChange(role)}
                  />
                  <label htmlFor={`role-${role.id}`} className="__select__label">
                    {role.name}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
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
