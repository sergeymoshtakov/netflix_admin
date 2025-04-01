import React, { useState } from 'react';
import { Genre } from '../../models/Series';

interface GenreEditProps {
  genre: Genre;
  isEditMode: boolean;
  onSave: (genre: Genre) => void;
  onCancel: () => void;
}

const GenreEdit: React.FC<GenreEditProps> = ({ genre, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Genre>(genre);

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
      <h3>{isEditMode ? 'Edit Genre' : 'Add Genre'}</h3>
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
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Genre'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default GenreEdit;
