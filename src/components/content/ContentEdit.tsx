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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
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

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required.';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must not exceed 100 characters.';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required.';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters.';
    }

    if (!formData.releaseDate) {
      newErrors.releaseDate = 'Release date is required.';
    }

    if (formData.durationMin == null || formData.durationMin < 1) {
      newErrors.durationMin = 'Duration must be a positive number.';
    }

    if (!formData.contentTypeId) {
      newErrors.contentTypeId = 'Content type must be selected.';
    }

    if (formData.ageRating && formData.ageRating.length > 10) {
      newErrors.ageRating = 'Age rating must not exceed 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

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
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div>
          <label htmlFor="contentTypeId">Content Type</label>
          <select
            name="contentTypeId"
            value={formData.contentTypeId}
            onChange={(e) => {
              setFormData({ ...formData, contentTypeId: Number(e.target.value) });
              setErrors((prev) => ({ ...prev, contentTypeId: '' }));
            }}
            required
          >
            <option value="">-- Select Type --</option>
            {contentTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
          {errors.contentTypeId && <div className="error">{errors.contentTypeId}</div>}
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} required />
          {errors.description && <div className="error">{errors.description}</div>}
        </div>

        <div>
          <label htmlFor="releaseDate">Release Date</label>
          <input type="date" name="releaseDate" value={formData.releaseDate?.slice(0, 10) || ''} onChange={handleChange} required />
          {errors.releaseDate && <div className="error">{errors.releaseDate}</div>}
        </div>

        <div>
          <label htmlFor="durationMin">Duration (min)</label>
          <input type="number" name="durationMin" value={formData.durationMin || 0} onChange={handleChange} min="0" required />
          {errors.durationMin && <div className="error">{errors.durationMin}</div>}
        </div>

        <div>
          <label htmlFor="ageRating">Age Rating</label>
          <input type="text" name="ageRating" value={formData.ageRating || ''} onChange={handleChange} />
          {errors.ageRating && <div className="error">{errors.ageRating}</div>}
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
