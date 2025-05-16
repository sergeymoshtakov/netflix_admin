import React, { useState } from 'react';
import ContentEdit from "./ContentEdit";
import { Content, Genre, ContentType, Actor, Warning } from '../../models/Series';

interface ContentListProps {
  contentList: Content[];
  onAddContent: (content: Content) => void;
  onEditContent: (content: Content, index: number) => void;
  onDeleteContent: (index: number) => void;
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
        aValue = contentTypes.find(type => type.id === a.contentTypeId)?.name || 'zzz'; // default to bottom
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

  return (
    <div className="content-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New Content</button>
        <input
          type="text"
          placeholder="Search by name, content type, age rating, date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='search-field'
        />
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
          {filteredAndSortedContent.map((content, index) => {
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
                  <button onClick={() => startEditing(content, index)}>Edit</button>
                  <button onClick={() => onDeleteContent(index)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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