import React, { useState } from 'react';
import GenreEdit from './GenreEdit';
import { Genre } from '../../models/Series';

interface GenreListProps {
  genres: Genre[];
  onAddGenre: (genre: Genre) => void;
  onEditGenre: (genre: Genre, index: number) => void;
  onDeleteGenre: (index: number) => void;
}

const GenreList: React.FC<GenreListProps> = ({
  genres,
  onAddGenre,
  onEditGenre,
  onDeleteGenre,
}) => {
  const [currentGenre, setCurrentGenre] = useState<Genre>({
    id: 0,
    name: '',
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentGenre({
      id: Date.now(),
      name: '',
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (genre: Genre, index: number) => {
    setCurrentGenre({ ...genre });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveGenre = (genre: Genre) => {
    if (isEditMode && editingIndex !== null) {
      onEditGenre(genre, editingIndex);
    } else {
      onAddGenre(genre);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  return (
    <div className="genre-list">
      <button onClick={startAdding}>Add New Genre</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {genres.map((genre, index) => (
            <tr key={genre.id}>
              <td>{genre.name}</td>
              <td>
                <button onClick={() => startEditing(genre, index)}>Edit</button>
                <button onClick={() => onDeleteGenre(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditorVisible && (
        <GenreEdit
          genre={currentGenre}
          isEditMode={isEditMode}
          onSave={saveGenre}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default GenreList;
