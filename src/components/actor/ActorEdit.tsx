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
  const [errors, setErrors] = useState<{ name?: string; surname?: string }>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'name' && value.trim()) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
    if (name === 'surname' && value.trim()) {
      setErrors((prev) => ({ ...prev, surname: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    const newErrors: { name?: string; surname?: string } = {};
  
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be 50 characters or fewer';
    }
  
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required';
    } else if (formData.surname.length > 50) {
      newErrors.surname = 'Surname must be 50 characters or fewer';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
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
          {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
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
          {errors.surname && <div style={{ color: 'red' }}>{errors.surname}</div>}
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