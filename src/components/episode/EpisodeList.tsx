import React, { useState } from 'react';
import EpisodeEdit from './EpisodeEdit';
import { Episode, Content, ContentType } from '../../models/Series';

interface EpisodeListProps {
  episodes: Episode[];
  onAddEpisode: (episode: Episode) => void;
  onEditEpisode: (episode: Episode, index: number) => void;
  onDeleteEpisode: (index: number) => void;
  contentList: Content[];
  contentTypes: ContentType[];
}

const EpisodeList: React.FC<EpisodeListProps> = ({
  episodes,
  onAddEpisode,
  onEditEpisode,
  onDeleteEpisode,
  contentList,
  contentTypes,
}) => {
  const [currentEpisode, setCurrentEpisode] = useState<Episode>({
    id: 0,
    name: '',
    contentId: 0,
    seasonNumber: 1,
    episodeNumber: 1,
    durationMin: 0,
    description: '',
    trailerUrl: '',
    videoUrl: '',
    releaseDate: '',
    createdAt: '',
  });

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentEpisode({
      id: Date.now(),
      name: '',
      contentId: 0,
      seasonNumber: 1,
      episodeNumber: 1,
      durationMin: 0,
      description: '',
      trailerUrl: '',
      videoUrl: '',
      releaseDate: '',
      createdAt: '',
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (episode: Episode, index: number) => {
    setCurrentEpisode({ ...episode });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveEpisode = (episode: Episode) => {
    if (isEditMode && editingIndex !== null) {
      onEditEpisode(episode, editingIndex);
    } else {
      onAddEpisode(episode);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  const getContentName = (id: number) =>
    contentList.find((c) => c.id === id)?.name || 'Unknown';

  return (
    <div className="episode-list">
      <button onClick={startAdding}>Add Episode</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Content</th>
            <th>Season</th>
            <th>Episode</th>
            <th>Duration</th>
            <th>Release</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((ep, index) => (
            <tr key={ep.id}>
              <td>{ep.name}</td>
              <td>{getContentName(ep.contentId)}</td>
              <td>{ep.seasonNumber}</td>
              <td>{ep.episodeNumber}</td>
              <td>{ep.durationMin} min</td>
              <td>{ep.releaseDate || '-'}</td>
              <td>
                <button onClick={() => startEditing(ep, index)}>Edit</button>
                <button onClick={() => onDeleteEpisode(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditorVisible && (
        <EpisodeEdit
          episode={currentEpisode}
          isEditMode={isEditMode}
          onSave={saveEpisode}
          onCancel={cancelEdit}
          contentList={contentList}
          contentTypes={contentTypes}
        />
      )}
    </div>
  );
};

export default EpisodeList;
