import React, { useState } from 'react';
import SeriesEdit from './SeriesEdit';
import { Series } from '../models/Series';

interface SeriesListProps {
  seriesList: Series[];
  onAddSeries: (series: Series) => void;
  onEditSeries: (series: Series, index: number) => void;
  onDeleteSeries: (index: number) => void;
}

const SeriesList: React.FC<SeriesListProps> = ({ seriesList, onAddSeries, onEditSeries, onDeleteSeries }) => {
  const [currentSeries, setCurrentSeries] = useState<Series>({
    id: 0,
    title: '',
    description: '',
    releaseDate: new Date().toISOString().split('T')[0],
    rating: 0,
    episodes: [],
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentSeries({
      id: Date.now(),
      title: '',
      description: '',
      releaseDate: new Date().toISOString().split('T')[0],
      rating: 0,
      episodes: [],
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (series: Series, index: number) => {
    setCurrentSeries({ ...series });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveSeries = (series: Series) => {
    if (isEditMode && editingIndex !== null) {
      onEditSeries(series, editingIndex);
    } else {
      onAddSeries(series);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  return (
    <div className="series-list">
      <button onClick={startAdding}>Add New Series</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Release Date</th>
            <th>Rating</th>
            <th>Episodes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {seriesList.map((series, index) => (
            <tr key={series.id}>
              <td>{series.title}</td>
              <td>{series.description}</td>
              <td>{series.releaseDate}</td>
              <td>{series.rating}</td>
              <td>
                <ul>
                  {series.episodes.map((episode) => (
                    <li key={episode.id}>{episode.title}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => startEditing(series, index)}>Edit</button>
                <button onClick={() => onDeleteSeries(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditorVisible && (
        <SeriesEdit
          series={currentSeries}
          isEditMode={isEditMode}
          onSave={saveSeries}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default SeriesList;