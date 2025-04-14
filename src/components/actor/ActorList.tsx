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

  return (
    <div className="actor-list">
      <button onClick={startAdding}>Add New Actor</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Biography</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {actors.map((actor, index) => (
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
