import React, { useState } from 'react';

interface User {
  firstName: string;
  lastName: string;
  registrationDate: string;
}

interface UserEditProps {
  user: User;
  isEditMode: boolean;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const UserEdit: React.FC<UserEditProps> = ({ user, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<User>(user);
  const today = new Date().toISOString().split('T')[0];

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
      <h3>{isEditMode ? 'Edit User' : 'Add User'}</h3>
      <form className="user-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registrationDate">Registration Date</label>
          <input
            type="date"
            id="registrationDate"
            name="registrationDate"
            value={formData.registrationDate}
            onChange={handleChange}
            max={today}
            required
          />
        </div>
        <p></p>
        <button type="submit" disabled={!formData.firstName || !formData.lastName || !formData.registrationDate}>
          {isEditMode ? 'Save Changes' : 'Add User'}
        </button>
        <p></p>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UserEdit;