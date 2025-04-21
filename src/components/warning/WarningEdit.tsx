import React, { useState } from 'react';
import { Warning } from '../../models/Series';

interface WarningEditProps {
  warning: Warning;
  isEditMode: boolean;
  onSave: (warning: Warning) => void;
  onCancel: () => void;
}

const WarningEdit: React.FC<WarningEditProps> = ({ warning, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Warning>(warning);

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
      <h3>{isEditMode ? 'Edit Warning' : 'Add Warning'}</h3>
      <form className="genre-form" onSubmit={handleSubmit}>
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
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Warning'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default WarningEdit;
