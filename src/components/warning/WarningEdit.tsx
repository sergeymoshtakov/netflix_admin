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
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim()) {
      setError('');
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    } else if (formData.name.length > 50) {
      setError('Name must not be longer than 50 characters.');
    }
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
          {error && <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
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
