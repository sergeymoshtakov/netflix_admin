import React, { useState } from 'react';
import { Content, Genre } from '../../models/Series';

interface ContentEditProps {
  content: Content;
  isEditMode: boolean;
  onSave: (content: Content) => void;
  onCancel: () => void;
  genres: Genre[];
}

const ContentEdit: React.FC<ContentEditProps> = ({
  content,
  isEditMode,
  onSave,
  onCancel,
  genres,
}) => {
  const [formData, setFormData] = useState<Content>(content);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIds = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    const selectedGenres = genres.filter((genre) => selectedIds.includes(genre.id));
    setFormData({ ...formData, genres: selectedGenres });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit Content' : 'Add Content'}</h3>
      <form className="content-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="releaseDate">Release Date</label>
          <input type="date" id="releaseDate" name="releaseDate" value={formData.releaseDate || ''} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="durationMin">Duration (min)</label>
          <input type="number" id="durationMin" name="durationMin" value={formData.durationMin || 0} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="ageRating">Age Rating</label>
          <input type="text" id="ageRating" name="ageRating" value={formData.ageRating || ''} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="genres">Genres</label>
          <select id="genres" multiple value={formData.genres?.map((g) => g.id.toString()) || []} onChange={handleGenreChange}>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="trailerUrl">Trailer URL</label>
          <input type="text" id="trailerUrl" name="trailerUrl" value={formData.trailerUrl || ''} onChange={handleChange} />
        </div>
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Content'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ContentEdit;
