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
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value.trim()) {
      setError('');
    }
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.name.length > 50) {
      setError('Name must not be longer than 50 characters.');
      return false;
    }
    if (formData.description && formData.description.length > 300) {
      setError('Description must not be longer than 300 characters.');
      return false;
    }
    if (formData.tags && formData.tags.length > 100) {
      setError('Tags must not be longer than 100 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Only image files allowed.');
      return;
    }

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size should not exceed ${maxSizeMB} MB`);
      return;
    }

    const url = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      imageUrl: url,
      file: file
    }));
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit Genre' : 'Add Genre'}</h3>
      <form className="genre-form" onSubmit={handleSubmit}>
        <div>
          {error && <div style={{ color: 'red', marginTop: '4px' }}>{error}</div>}
        </div>
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
        <div>
          <label htmlFor="imageUrl">Image</label>
          <input
            type="file"
            id="imageUrl"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="imageUrl" className="upload-button">Upload Image</label>
          {formData.imageUrl && (
            <div style={{ marginTop: '8px' }}>
              <img src={formData.imageUrl} alt={formData.name} style={{ width: 120, height: 90, objectFit: 'cover' }} />
            </div>
          )}
        </div>
        <div>
        <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
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
