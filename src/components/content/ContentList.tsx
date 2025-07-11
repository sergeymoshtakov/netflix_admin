import React, { useState } from 'react';
import ContentEdit from "./ContentEdit";
import { Content, Genre, ContentType, Actor, Warning } from '../../models/Series';

interface ContentListProps {
  contentList: Content[];
  onAddContent: (content: Content) => void;
  onEditContent: (content: Content, index: number) => void;
  onDeleteContent: (index: number, id: number) => void;
  genres: Genre[];
  contentTypes: ContentType[];
  actors: Actor[];
  warnings: Warning[];
}

const ContentList: React.FC<ContentListProps> = ({
  contentList,
  onAddContent,
  onEditContent,
  onDeleteContent,
  genres,
  contentTypes,
  actors,
  warnings,
}) => {
  const [currentContent, setCurrentContent] = useState<Content>({
    id: 0,
    name: '',
    contentTypeId: 0,
    description: '',
    releaseDate: '',
    durationMin: 0,
    ageRating: '',
    genreIds: [],
    actorIds: [],
    warningIds: [],
  });

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'contentType' | 'ageRating' | 'createdAt' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const startAdding = () => {
    setCurrentContent({
      id: Date.now(),
      name: '',
      contentTypeId: 0,
      description: '',
      releaseDate: '',
      durationMin: 0,
      ageRating: '',
      genreIds: [],
      actorIds: [],
      warningIds: [],
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (content: Content, index: number) => {
    setCurrentContent({ ...content });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveContent = (content: Content) => {
    if (isEditMode && editingIndex !== null) {
      onEditContent(content, editingIndex);
    } else {
      onAddContent(content);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  const handleSort = (field: 'name' | 'contentType' | 'ageRating' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedContent = [...contentList]
    .filter((content) => {
      const contentType = contentTypes.find(type => type.id === content.contentTypeId)?.name || '';
      return (
        content.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (content.ageRating || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (content.createdAt || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      let aValue = '';
      let bValue = '';

      if (sortField === 'contentType') {
        aValue = contentTypes.find(type => type.id === a.contentTypeId)?.name || 'zzz';
        bValue = contentTypes.find(type => type.id === b.contentTypeId)?.name || 'zzz';
      } else if (sortField === 'createdAt') {
        aValue = a.createdAt || '';
        bValue = b.createdAt || '';
      } else {
        aValue = (a[sortField] || '').toString();
        bValue = (b[sortField] || '').toString();
      }

      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSortedContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContent = filteredAndSortedContent.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="content-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Content</button>
        <input
          type="text"
          placeholder="Search by name, content type, age rating, date..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className='search-field'
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
            {[5, 10, 20, 50].map(count => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
              Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('contentType')} style={{ cursor: 'pointer' }}>
              Content Type {sortField === 'contentType' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Poster URL</th>
            <th onClick={() => handleSort('ageRating')} style={{ cursor: 'pointer' }}>
              Age Rating {sortField === 'ageRating' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Is Active</th>
            <th onClick={() => handleSort('createdAt')} style={{ cursor: 'pointer' }}>
              Created At {sortField === 'createdAt' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedContent.map((content, index) => {
            const globalIndex = startIndex + index;
            const contentType = contentTypes.find(type => type.id === content.contentTypeId);
            return (
              <tr key={content.id}>
                <td>{content.name}</td>
                <td>{contentType ? contentType.name : 'Unknown'}</td>
                <td>
                  {content.posterUrl ? (
                    <a href={content.posterUrl} target="_blank" rel="noopener noreferrer">
                      View Poster
                    </a>
                  ) : (
                    'No poster'
                  )}
                </td>
                <td>{content.ageRating || '-'}</td>
                <td data-status={content.isActive ? "active" : "notactive"}>
                  {content.isActive ? 'Yes' : 'No'}
                </td>
                <td>{content.createdAt ? new Date(content.createdAt).toLocaleDateString('en-US') : '-'}</td>
                <td>
                  <button onClick={() => startEditing(content, globalIndex)}>Edit</button>
                  <button onClick={() => onDeleteContent(globalIndex, content.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
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
        <ContentEdit
          content={currentContent}
          isEditMode={isEditMode}
          onSave={saveContent}
          onCancel={cancelEdit}
          genres={genres}
          contentTypes={contentTypes}
          actors={actors}
          warnings={warnings}
        />
      )}
    </div>
  );
};

export default ContentList;