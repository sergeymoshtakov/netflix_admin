import React, { useState } from 'react';
import { Content, Genre, ContentType } from '../../models/Series';

interface ContentEditProps {
  content: Content;
  isEditMode: boolean;
  onSave: (content: Content) => void;
  onCancel: () => void;
  genres: Genre[];
  contentTypes: ContentType[];
}

const ContentEdit: React.FC<ContentEditProps> = ({
  content,
  isEditMode,
  onSave,
  onCancel,
  genres,
  contentTypes,
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

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      const allowedTypes = ["video/mp4", "video/avi", "video/mkv"];
      if (!allowedTypes.includes(file.type)) {
        alert("Wrong format! Only MP4, AVI, MKV permitted.");
        return;
      }

      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        alert("File is bigger than 500MB!");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, videoUrl: fileUrl });
    }
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        alert("Wrong format! Only JPEG, PNG, GIF permitted.");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("File is bigger than 5MB!");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, posterUrl: fileUrl });
    }
  };

  const handleTrailerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];

      const allowedTypes = ["video/mp4", "video/avi", "video/mkv"];
      if (!allowedTypes.includes(file.type)) {
        alert("Wrong format! Only MP4, AVI, MKV permitted.");
        return;
      }

      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert("File is bigger than 100MB!");
        return;
      }

      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, trailerUrl: fileUrl });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
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
          <label htmlFor="contentTypeId">Content Type</label>
          <select
            id="contentTypeId"
            name="contentTypeId"
            value={formData.contentTypeId}
            onChange={(e) => setFormData({ ...formData, contentTypeId: Number(e.target.value) })}
            required
          >
          <option value="">-- Select Type --</option>
            {contentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
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
          <label>
            <input 
              type="checkbox" 
              name="isActive" 
              checked={formData.isActive || false} 
              onChange={handleCheckboxChange} 
            />
            Is Active
          </label>
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
          <label htmlFor="poster">Poster Image</label>
          <input 
            type="file" 
            id="poster" 
            accept="image/*" 
            onChange={handlePosterUpload} 
          />
          {formData.posterUrl && (
            <div>
              <p>Uploaded poster:</p>
              <img src={formData.posterUrl} alt="Poster preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="trailer">Trailer Video</label>
          <input 
            type="file" 
            id="trailer" 
            accept="video/*" 
            onChange={handleTrailerUpload} 
          />
          {formData.trailerUrl && (
            <div>
              <p>Uploaded trailer: <a href={formData.trailerUrl} target="_blank" rel="noopener noreferrer">View trailer</a></p>
            </div>
          )}
        </div>
        
        <div>
          <label htmlFor="video">Main Video</label>
          <input 
            type="file" 
            id="video" 
            accept="video/*" 
            onChange={handleVideoUpload} 
          />
          {formData.videoUrl && (
            <div>
              <p>Uploaded video: <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer">View video</a></p>
            </div>
          )}
        </div>
        
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Content'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ContentEdit;