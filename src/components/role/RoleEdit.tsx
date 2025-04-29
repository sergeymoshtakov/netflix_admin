import React, { useState } from 'react';
import { Role } from '../../models/AppUser';

interface RoleEditProps {
  role: Role;
  isEditMode: boolean;
  onSave: (role: Role) => void;
  onCancel: () => void;
}

const RoleEdit: React.FC<RoleEditProps> = ({ role, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Role>(role);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit Role' : 'Add Role'}</h3>
      <form onSubmit={handleSubmit} className='roles-form'>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Role'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default RoleEdit;
