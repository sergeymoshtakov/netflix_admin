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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const filteredContentTypes = [...contentTypes]
    .filter((ct) => ct.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortDirection === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredContentTypes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContentTypes = filteredContentTypes.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="content-type-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Content Type</button>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // сбрасываем на первую страницу при поиске
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
            <th onClick={toggleSortDirection} style={{ cursor: 'pointer' }}>
              Name {sortDirection === 'asc' ? '▲' : '▼'}
            </th>
            <th>Description</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedContentTypes.map((ct, index) => (
            <tr key={ct.id}>
              <td>{ct.name}</td>
              <td>{ct.description}</td>
              <td>{ct.tags}</td>
              <td>
                <button onClick={() => startEditing(ct, index + startIndex)}>Edit</button>
                <button onClick={() => onDeleteContentType(index + startIndex)}>Delete</button>
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
