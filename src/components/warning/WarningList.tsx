import React, { useState } from 'react';
import WarningEdit from './WarningEdit';
import { Warning } from '../../models/Series';

interface WarningListProps {
  warnings: Warning[];
  onAddWarning: (warning: Warning) => void;
  onEditWarning: (warning: Warning, index: number) => void;
  onDeleteWarning: (index: number) => void;
}

const WarningList: React.FC<WarningListProps> = ({
  warnings,
  onAddWarning,
  onEditWarning,
  onDeleteWarning,
}) => {
  const [currentWarning, setCurrentWarning] = useState<Warning>({
    id: 0,
    name: '',
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentWarning({
      id: Date.now(),
      name: '',
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (warning: Warning, index: number) => {
    setCurrentWarning({ ...warning });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveGenre = (warning: Warning) => {
    if (isEditMode && editingIndex !== null) {
      onEditWarning(warning, editingIndex);
    } else {
      onAddWarning(warning);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  return (
    <div className="genre-list">
      <button onClick={startAdding}>Add New Warning</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {warnings.map((warning, index) => (
            <tr key={warning.id}>
              <td>{warning.name}</td>
              <td>
                <button onClick={() => startEditing(warning, index)}>Edit</button>
                <button onClick={() => onDeleteWarning(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditorVisible && (
        <WarningEdit
          warning={currentWarning}
          isEditMode={isEditMode}
          onSave={saveGenre}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default WarningList;
