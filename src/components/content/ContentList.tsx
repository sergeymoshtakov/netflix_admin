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

  return (
    <div className="content-list">
      <button onClick={startAdding}>Add New Content</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Content type</th>
            <th>Poster URL</th>
            <th>Age rating</th>
            <th>Is active</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {contentList.map((content, index) => {
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
