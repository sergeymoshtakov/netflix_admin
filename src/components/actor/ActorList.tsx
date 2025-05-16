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

  return (
    <div className="actor-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Actor</button>
        <input
          type="text"
          placeholder="Search by name or surname..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-field'
        />
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
          {filteredAndSortedActors.map((actor, index) => (
            <tr key={actor.id}>
              <td>{actor.name}</td>
              <td>{actor.surname}</td>
              <td>{actor.biography}</td>
              <td>
                <button onClick={() => startEditing(actor, index)}>Edit</button>
                <button onClick={() => onDeleteActor(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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