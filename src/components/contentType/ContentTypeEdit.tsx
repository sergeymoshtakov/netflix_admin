import React, { useState } from 'react';
import { ContentType } from '../../models/Series';

interface ContentTypeEditProps {
  contentType: ContentType;
  isEditMode: boolean;
  onSave: (contentType: ContentType) => void;
  onCancel: () => void;
}

const ContentTypeEdit: React.FC<ContentTypeEditProps> = ({
  contentType,
  isEditMode,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ContentType>(contentType);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'name' && value.trim()) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
    if (name === 'description' && value.trim()) {
      setErrors((prev) => ({ ...prev, surname: undefined }));
    }
    
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; description?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50){
      newErrors.name = 'Name must not be longer than 50 characters.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit Content Type' : 'Add Content Type'}</h3>
      <form className="content-type-form" onSubmit={handleSubmit}>
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
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && <div style={{ color: 'red' }}>{errors.description}</div>}
        </div>
        <div>
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Content Type'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ContentTypeEdit;
