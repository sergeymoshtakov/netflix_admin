import React, { useState } from 'react';
import ContentTypeEdit from './ContentTypeEdit';
import { ContentType } from '../../models/Series';

interface ContentTypeListProps {
  contentTypes: ContentType[];
  onAddContentType: (contentType: ContentType) => void;
  onEditContentType: (contentType: ContentType, index: number) => void;
  onDeleteContentType: (index: number) => void;
}

const ContentTypeList: React.FC<ContentTypeListProps> = ({
  contentTypes,
  onAddContentType,
  onEditContentType,
  onDeleteContentType,
}) => {
  const [currentContentType, setCurrentContentType] = useState<ContentType>({
    id: 0,
    name: '',
    description: '',
    tags: '',
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentContentType({
      id: Date.now(),
      name: '',
      description: '',
      tags: '',
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (contentType: ContentType, index: number) => {
    setCurrentContentType({ ...contentType });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveContentType = (contentType: ContentType) => {
    if (isEditMode && editingIndex !== null) {
      onEditContentType(contentType, editingIndex);
    } else {
      onAddContentType(contentType);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  return (
    <div className="content-type-list">
      <button onClick={startAdding}>Add New Content Type</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentTypes.map((ct, index) => (
            <tr key={ct.id}>
              <td>{ct.name}</td>
              <td>{ct.description}</td>
              <td>{ct.tags}</td>
              <td>
                <button onClick={() => startEditing(ct, index)}>Edit</button>
                <button onClick={() => onDeleteContentType(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditorVisible && (
        <ContentTypeEdit
          contentType={currentContentType}
          isEditMode={isEditMode}
          onSave={saveContentType}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default ContentTypeList;
