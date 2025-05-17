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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const totalPages = Math.ceil(filteredWarnings.length / itemsPerPage);
  const paginatedWarnings = filteredWarnings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const sortIcon = sortOrder === 'asc' ? '▲' : '▼';

  return (
    <div className="warning-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Warning</button>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-field"
        />
        <div className="pagination-control" style={{ marginTop: '10px' }}>
          <label htmlFor="itemsPerPage">Items per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 20, 50].map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </div>
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
          {paginatedWarnings.map((warning, index) => {
            const globalIndex = (currentPage - 1) * itemsPerPage + index;
            return (
              <tr key={warning.id}>
                <td>{warning.name}</td>
                <td>
                  <button onClick={() => startEditing(warning, globalIndex)}>Edit</button>
                  <button onClick={() => onDeleteWarning(globalIndex)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination-control" style={{ marginTop: '10px' }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

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
