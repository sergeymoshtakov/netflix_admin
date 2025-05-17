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
    imageUrl: '',
    description: '',
    tags: ''
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const startAdding = () => {
    setCurrentGenre({ id: Date.now(), name: '', imageUrl: '', description: '', tags: '' });
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

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredGenres = genres
    .filter((genre) => genre.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredGenres.length / itemsPerPage);
  const paginatedGenres = filteredGenres.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortIcon = sortOrder === 'asc' ? '▲' : '▼';

  return (
    <div className="genre-list">
      <div className="role-controls">
        <button onClick={startAdding}>Add New Genre</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-field"
        />
        <div className="pagination-control">
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 50].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={toggleSortOrder}>
              Name {sortIcon}
            </th>
            <th>Image</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedGenres.map((genre, index) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index;
            return (
              <tr key={genre.id}>
                <td>{genre.name}</td>
                <td>
                  {genre.imageUrl ? (
                    <a href={genre.imageUrl} target="_blank" rel="noopener noreferrer">
                      View Image
                    </a>
                  ) : (
                    'No image'
                  )}
                </td>
                <td>{genre.description}</td>
                <td>{genre.tags}</td>
                <td>
                  <button onClick={() => startEditing(genre, globalIndex)}>Edit</button>
                  <button onClick={() => onDeleteGenre(globalIndex)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination navigation */}
      <div className="pagination-control" style={{ marginTop: '10px' }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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
