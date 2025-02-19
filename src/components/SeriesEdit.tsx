import React, { useState } from 'react';
import { Series, Episode } from '../models/Series';

interface SeriesEditProps {
  series: Series;
  isEditMode: boolean;
  onSave: (series: Series) => void;
  onCancel: () => void;
}

const SeriesEdit: React.FC<SeriesEditProps> = ({ series, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Series>(series);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [isEpisodeEditorVisible, setIsEpisodeEditorVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentEpisode({ ...currentEpisode!, [name]: value });
  };

  const handleAddEpisode = () => {
    setCurrentEpisode({
      id: Date.now(),
      title: '',
      description: '',
      duration: 0,
      releaseDate: new Date().toISOString().split('T')[0],
    });
    setIsEpisodeEditorVisible(true);
  };

  const handleSaveEpisode = () => {
    if (currentEpisode) {
      setFormData({
        ...formData,
        episodes: [...formData.episodes, currentEpisode],
      });
      setIsEpisodeEditorVisible(false);
      setCurrentEpisode(null);
    }
  };

  const handleEditEpisode = (index: number) => {
    setCurrentEpisode(formData.episodes[index]);
    setIsEpisodeEditorVisible(true);
  };

  const handleDeleteEpisode = (index: number) => {
    const updatedEpisodes = formData.episodes.filter((_, i) => i !== index);
    setFormData({ ...formData, episodes: updatedEpisodes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit Series' : 'Add Series'}</h3>
      <form className="series-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="releaseDate">Release Date</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="rating">Rating</label>
          <input
            type="number"
            id="rating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            required
          />
        </div>
        <div>
          <h4>Episodes</h4>
          <button type="button" onClick={handleAddEpisode}>
            Add Episode
          </button>
          <ul>
            {formData.episodes.map((episode, index) => (
              <li key={episode.id}>
                <span>{episode.title}</span>
                <button type="button" onClick={() => handleEditEpisode(index)}>
                  Edit
                </button>
                <button type="button" onClick={() => handleDeleteEpisode(index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Series'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>

      {isEpisodeEditorVisible && (
        <div className="episode-editor">
          <h4>{currentEpisode?.id ? 'Edit Episode' : 'Add Episode'}</h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEpisode();
            }}
          >
            <div>
              <label htmlFor="episode-title">Title</label>
              <input
                type="text"
                id="episode-title"
                name="title"
                value={currentEpisode?.title || ''}
                onChange={handleEpisodeChange}
                required
              />
            </div>
            <div>
              <label htmlFor="episode-description">Description</label>
              <textarea
                id="episode-description"
                name="description"
                value={currentEpisode?.description || ''}
                onChange={handleEpisodeChange}
                required
              />
            </div>
            <div>
              <label htmlFor="episode-duration">Duration (minutes)</label>
              <input
                type="number"
                id="episode-duration"
                name="duration"
                value={currentEpisode?.duration || 0}
                onChange={handleEpisodeChange}
                required
              />
            </div>
            <div>
              <label htmlFor="episode-releaseDate">Release Date</label>
              <input
                type="date"
                id="episode-releaseDate"
                name="releaseDate"
                value={currentEpisode?.releaseDate || ''}
                onChange={handleEpisodeChange}
                required
              />
            </div>
            <button type="submit">Save Episode</button>
            <button type="button" onClick={() => setIsEpisodeEditorVisible(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SeriesEdit;