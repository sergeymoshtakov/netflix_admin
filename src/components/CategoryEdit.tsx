import React, { useState } from 'react';
import { Category } from '../models/Series';

interface CategoryEditProps {
  category: Category;
  isEditMode: boolean;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

const CategoryEdit: React.FC<CategoryEditProps> = ({ category, isEditMode, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Category>(category);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div>
      <h3>{isEditMode ? 'Edit Category' : 'Add Category'}</h3>
      <form className="category-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{isEditMode ? 'Save Changes' : 'Add Category'}</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CategoryEdit;