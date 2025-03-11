import React, { useState } from 'react';
import CategoryEdit from './CategoryEdit';
import { Category } from '../models/Series';

interface CategoryListProps {
  categories: Category[];
  onAddCategory: (category: Category) => void;
  onEditCategory: (category: Category, index: number) => void;
  onDeleteCategory: (index: number) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const [currentCategory, setCurrentCategory] = useState<Category>({
    id: 0,
    title: '',
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentCategory({
      id: Date.now(),
      title: '',
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (category: Category, index: number) => {
    setCurrentCategory({ ...category });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveCategory = (category: Category) => {
    if (isEditMode && editingIndex !== null) {
      onEditCategory(category, editingIndex);
    } else {
      onAddCategory(category);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  return (
    <div className="category-list">
      <button onClick={startAdding}>Add New Category</button>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{category.title}</td>
              <td>
                <button onClick={() => startEditing(category, index)}>Edit</button>
                <button onClick={() => onDeleteCategory(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditorVisible && (
        <CategoryEdit
          category={currentCategory}
          isEditMode={isEditMode}
          onSave={saveCategory}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default CategoryList;