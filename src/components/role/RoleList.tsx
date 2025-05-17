import React, { useState } from 'react';
import RoleEdit from './RoleEdit';
import { Role } from '../../models/AppUser';

interface RoleListProps {
  roles: Role[];
  onAddRole: (role: Role) => void;
  onEditRole: (role: Role, index: number) => void;
  onDeleteRole: (index: number) => void;
}

const RoleList: React.FC<RoleListProps> = ({
  roles,
  onAddRole,
  onEditRole,
  onDeleteRole,
}) => {
  const [currentRole, setCurrentRole] = useState<Role>({ id: 0, name: '' });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const startAdding = () => {
    setCurrentRole({ id: Date.now(), name: '' });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (role: Role, index: number) => {
    setCurrentRole({ ...role });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveRole = (role: Role) => {
    if (isEditMode && editingIndex !== null) {
      onEditRole(role, editingIndex);
    } else {
      onAddRole(role);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortIcon = sortOrder === 'asc' ? '▲' : '▼';

  const filteredRoles = roles
    .filter((role) => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="role-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Role</button>
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
        <div className="pagination-control">
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
          {paginatedRoles.map((role, index) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                <button onClick={() => startEditing(role, index + startIndex)}>Edit</button>
                <button onClick={() => onDeleteRole(index + startIndex)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '10px' }}>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {isEditorVisible && (
        <RoleEdit
          role={currentRole}
          isEditMode={isEditMode}
          onSave={saveRole}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default RoleList;
