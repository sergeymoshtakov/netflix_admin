import React, { useState } from 'react';
import { Episode, Content, ContentType } from '../../models/Series';

interface EpisodeEditProps {
  episode: Episode;
  isEditMode: boolean;
  onSave: (episode: Episode) => void;
  onCancel: () => void;
  contentList: Content[];
  contentTypes: ContentType[];
}

const EpisodeEdit: React.FC<EpisodeEditProps> = ({
  episode,
  isEditMode,
  onSave,
  onCancel,
  contentList,
  contentTypes,
}) => {
  const [formData, setFormData] = useState<Episode>(episode);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'durationMin' ? Number(value) : value });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'videoUrl' | 'trailerUrl',
    maxSizeMB: number,
    type: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith(type)) {
      alert(`Only ${type} files allowed.`);
      return;
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File exceeds ${maxSizeMB}MB`);
      return;
    }

    const url = URL.createObjectURL(file);
    setFormData({ ...formData, [field]: url });
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
      createdAt: isEditMode ? formData.createdAt : now,
    };
    onSave(dataToSave);
  };

  const tvShows = contentList.filter((c) =>
    contentTypes.find((t) => t.id === c.contentTypeId && t.name.toLowerCase() === 'tv series')
  );

  return (
    <div>
      <h3>{isEditMode ? 'Edit Episode' : 'Add Episode'}</h3>
      <form className="episode-form" onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>TV Show</label>
          <select name="contentId" value={formData.contentId} onChange={handleChange} required>
            <option value="">Select TV Show</option>
            {tvShows.map((show) => (
              <option key={show.id} value={show.id}>
                {show.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Season</label>
          <input
            name="seasonNumber"
            type="number"
            value={formData.seasonNumber}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <div>
          <label>Episode</label>
          <input
            name="episodeNumber"
            type="number"
            value={formData.episodeNumber}
            onChange={handleChange}
            min={1}
            required
          />
        </div>

        <div>
          <label>Duration (min)</label>
          <input
            name="durationMin"
            type="number"
            value={formData.durationMin || ''}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea name="description" value={formData.description || ''} onChange={handleChange} />
        </div>

        <div>
          <label>Release Date</label>
          <input type="date" name="releaseDate" value={formData.releaseDate?.slice(0, 10) || ''} onChange={handleChange} />
        </div>

        <div>
          <label>Trailer</label>
          <input 
            type="file"
            id='trailer'
            accept="video/*" 
            onChange={(e) => handleFileUpload(e, 'trailerUrl', 100, 'video')} 
            style={{ display: 'none' }} 
          />
          <label htmlFor="trailer" className="upload-button">Upload Trailer</label>
          {formData.trailerUrl && (
            <div>
              <a 
                href={formData.trailerUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="upload-button"
                >
                  View trailer
              </a>
            </div>
          )}
        </div>

        <div>
          <label>Video</label>
          <input 
            type="file" 
            id='video'
            accept="video/*" 
            onChange={(e) => handleFileUpload(e, 'videoUrl', 500, 'video')}
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

        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Episode'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EpisodeEdit;
