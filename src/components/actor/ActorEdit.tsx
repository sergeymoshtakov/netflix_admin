import React, { useState } from 'react';
import { Actor } from '../../models/Series';

interface ActorEditProps {
  actor: Actor;
  isEditMode: boolean;
  onSave: (actor: Actor) => void;
  onCancel: () => void;
}

const ActorEdit: React.FC<ActorEditProps> = ({ actor, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Actor>(actor);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit Actor' : 'Add Actor'}</h3>
      <form className="actor-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="surname">Surname</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="biography">Biography</label>
          <textarea
            id="biography"
            name="biography"
            value={formData.biography || ''}
            onChange={handleChange}
          />
        </div>

        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Actor'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default ActorEdit;