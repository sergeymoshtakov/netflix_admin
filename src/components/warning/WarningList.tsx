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
  const [currentWarning, setCurrentWarning] = useState<Warning>({ id: 0, name: '' });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const startAdding = () => {
    setCurrentWarning({ id: Date.now(), name: '' });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (warning: Warning, index: number) => {
    setCurrentWarning({ ...warning });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveWarning = (warning: Warning) => {
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

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const filteredWarnings = warnings
    .filter((w) => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const sortIcon = sortOrder === 'asc' ? '▲' : '▼';

  return (
    <div className="warning-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Warning</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-field'
        />
      </div>

      <table>
        <thead>
          <tr>
            <th style={{ cursor: 'pointer' }} onClick={toggleSortOrder}>
              Name {sortIcon}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredWarnings.map((warning, index) => (
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
          onSave={saveWarning}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default WarningList;
