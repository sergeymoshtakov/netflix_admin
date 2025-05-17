import React, { useState } from 'react';
import ActorEdit from './ActorEdit';
import { Actor } from '../../models/Series';

interface ActorListProps {
  actors: Actor[];
  onAddActor: (actor: Actor) => void;
  onEditActor: (actor: Actor, index: number) => void;
  onDeleteActor: (index: number) => void;
}

const ActorList: React.FC<ActorListProps> = ({
  actors,
  onAddActor,
  onEditActor,
  onDeleteActor,
}) => {
  const [currentActor, setCurrentActor] = useState<Actor>({
    id: 0,
    name: '',
    surname: '',
    biography: '',
  });

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'surname'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: 'name' | 'surname') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const startAdding = () => {
    setCurrentActor({
      id: Date.now(),
      name: '',
      surname: '',
      biography: '',
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (actor: Actor, index: number) => {
    setCurrentActor({ ...actor });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveActor = (actor: Actor) => {
    if (isEditMode && editingIndex !== null) {
      onEditActor(actor, editingIndex);
    } else {
      onAddActor(actor);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  const filteredAndSortedActors = [...actors]
    .filter((actor) =>
      (actor.name + ' ' + actor.surname).toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField].toLowerCase();
      const bValue = b[sortField].toLowerCase();
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedActors.length / itemsPerPage);
  const paginatedActors = filteredAndSortedActors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="actor-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Actor</button>
        <input
          type="text"
          placeholder="Search by name or surname..."
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
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('surname')} style={{ cursor: 'pointer' }}>
              Surname {sortField === 'surname' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Biography</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedActors.map((actor, index) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index;
            return (
              <tr key={actor.id}>
                <td>{actor.name}</td>
                <td>{actor.surname}</td>
                <td>{actor.biography}</td>
                <td>
                  <button onClick={() => startEditing(actor, globalIndex)}>Edit</button>
                  <button onClick={() => onDeleteActor(globalIndex)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
        <ActorEdit
          actor={currentActor}
          isEditMode={isEditMode}
          onSave={saveActor}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default ActorList;