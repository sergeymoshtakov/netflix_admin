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

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<null | keyof Episode | 'contentName'>(
    null
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const getContentName = (id: number) => {
    const content = contentList.find((c) => +c.id === +id);
    return content ? content.name : 'Unknown';
  };

  const handleSort = (
    field: keyof Episode | 'contentName'
  ) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedEpisodes = [...episodes]
    .filter((ep) => {
      const contentName = getContentName(ep.contentId);
      return (
        ep.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      let aVal: string | number = '';
      let bVal: string | number = '';

      if (sortField === 'contentName') {
        aVal = getContentName(a.contentId).toLowerCase();
        bVal = getContentName(b.contentId).toLowerCase();
      } else if (sortField === 'releaseDate') {
        aVal = a.releaseDate || '';
        bVal = b.releaseDate || '';
      } else {
        aVal = (a[sortField] ?? '').toString().toLowerCase();
        bVal = (b[sortField] ?? '').toString().toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="episode-list">
      <div style={{ marginBottom: 10 }}>
        <button onClick={startAdding}>Add Episode</button>
        <input
          type="text"
          placeholder="Search by name or content"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: 10 }}
          className="search-field"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('contentName')} style={{ cursor: 'pointer' }}>
              Content {sortField === 'contentName' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('seasonNumber')} style={{ cursor: 'pointer' }}>
              Season {sortField === 'seasonNumber' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('episodeNumber')} style={{ cursor: 'pointer' }}>
              Episode {sortField === 'episodeNumber' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('durationMin')} style={{ cursor: 'pointer' }}>
              Duration {sortField === 'durationMin' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('releaseDate')} style={{ cursor: 'pointer' }}>
              Release {sortField === 'releaseDate' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedEpisodes.map((ep, index) => (
            <tr key={ep.id}>
              <td>{ep.name}</td>
              <td>{getContentName(ep.contentId)}</td>
              <td>{ep.seasonNumber}</td>
              <td>{ep.episodeNumber}</td>
              <td>{ep.durationMin} min</td>
              <td>{ep.releaseDate ? new Date(ep.releaseDate).toLocaleDateString('en-US') : '-'}</td>
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
