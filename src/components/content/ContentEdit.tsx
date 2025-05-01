import React, { useState } from 'react';
import { Content, Genre, ContentType, Actor, Warning } from '../../models/Series';

interface ContentEditProps {
  content: Content;
  isEditMode: boolean;
  onSave: (content: Content) => void;
  onCancel: () => void;
  genres: Genre[];
  contentTypes: ContentType[];
  actors: Actor[];
  warnings: Warning[];
}

const ContentEdit: React.FC<ContentEditProps> = ({
  content,
  isEditMode,
  onSave,
  onCancel,
  genres,
  contentTypes,
  actors,
  warnings,
}) => {
  const [formData, setFormData] = useState<Content>(content);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setFormData({ ...formData, videoUrl: URL.createObjectURL(file) });
  };

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setFormData({ ...formData, posterUrl: URL.createObjectURL(file) });
  };

  const handleTrailerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

    setFormData({ ...formData, trailerUrl: URL.createObjectURL(file) });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();

    const isoReleaseDate = formData.releaseDate
      ? new Date(formData.releaseDate).toISOString()
      : undefined;

    const dataToSave = {
      ...formData,
      releaseDate: isoReleaseDate,
      updatedAt: now,
      createdAt: isEditMode ? formData.createdAt : now,
    };

    onSave(dataToSave);
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
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="releaseDate">Release Date</label>
          <input type="date" id="releaseDate" name="releaseDate" value={formData.releaseDate?.slice(0, 10) || ''} onChange={handleChange} required />
        </div>

        <div>
          <label htmlFor="durationMin">Duration (min)</label>
          <input type="number" id="durationMin" name="durationMin" value={formData.durationMin || 0} onChange={handleChange} required min="0" />
        </div>

        <div>
          <label htmlFor="ageRating">Age Rating</label>
          <input type="text" id="ageRating" name="ageRating" value={formData.ageRating || ''} onChange={handleChange} />
        </div>

        <div>
          <label>
            <input type="checkbox" name="isActive" checked={formData.isActive || false} onChange={handleCheckboxChange} />
            Is Active
          </label>
        </div>

        <div>
          <label>Genres</label>
          <div className="__select">
            <div className="__select__content">
              {genres.map((genre) => (
                <React.Fragment key={genre.id}>
                  <input
  id={`genre-${genre.id}`}
  className="__select__input"
  type="checkbox"
  checked={formData.genreIds?.includes(genre.id) || false}
  onChange={(e) => {
    const updated = e.target.checked
      ? [...(formData.genreIds || []), genre.id]
      : formData.genreIds?.filter((id) => id !== genre.id) || [];
    setFormData({ ...formData, genreIds: updated });
  }}
/>
                  <label htmlFor={`genre-${genre.id}`} className="__select__label">
                    {genre.name}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label>Actors</label>
          <div className="__select">
            <div className="__select__content">
              {actors.map((actor) => (
                <React.Fragment key={actor.id}>
                  <input
  id={`actor-${actor.id}`}
  className="__select__input"
  type="checkbox"
  checked={formData.actorIds?.includes(actor.id) || false}
  onChange={(e) => {
    const updated = e.target.checked
      ? [...(formData.actorIds || []), actor.id]
      : formData.actorIds?.filter((id) => id !== actor.id) || [];
    setFormData({ ...formData, actorIds: updated });
  }}
/>
                  <label htmlFor={`actor-${actor.id}`} className="__select__label">
                    {actor.name} {actor.surname}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label>Warnings</label>
          <div className="__select">
            <div className="__select__content">
              {warnings.map((warning) => (
                <React.Fragment key={warning.id}>
                  <input
  id={`warning-${warning.id}`}
  className="__select__input"
  type="checkbox"
  checked={formData.warningIds?.includes(warning.id) || false}
  onChange={(e) => {
    const updated = e.target.checked
      ? [...(formData.warningIds || []), warning.id]
      : formData.warningIds?.filter((id) => id !== warning.id) || [];
    setFormData({ ...formData, warningIds: updated });
  }}
/>
                  <label htmlFor={`warning-${warning.id}`} className="__select__label">
                    {warning.name}
                  </label>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="poster">Poster Image</label>
          <input
            type="file"
            id="poster"
            accept="image/*"
            onChange={handlePosterUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="poster" className="upload-button">Upload Poster</label>

          {formData.posterUrl && (
            <div>
              <img
                src={formData.posterUrl}
                alt="Poster preview"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  maxWidth: '200px',
                  maxHeight: '200px',
                  marginTop: '10px'
                }}
              />
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
            style={{ display: 'none' }} 
          />
          <label htmlFor="trailer" className="upload-button">Upload Video</label>
          {formData.trailerUrl && (
            <div>
              <a
                href={formData.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="upload-button"
              >
                View Trailer
              </a>
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
            style={{ display: 'none' }} 
          />
          <label htmlFor="video" className="upload-button">Upload Video</label>
          {formData.videoUrl && (
            <div>
              <a 
                href={formData.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="upload-button"
                >
                  View video
              </a>
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
