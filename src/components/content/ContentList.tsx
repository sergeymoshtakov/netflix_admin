import React, { useState } from 'react';
import ContentEdit from "./ContentEdit";
import { Content, Genre } from '../../models/Series';

interface ContentListProps {
  contentList: Content[];
  onAddContent: (content: Content) => void;
  onEditContent: (content: Content, index: number) => void;
  onDeleteContent: (index: number) => void;
  genres: Genre[];
}

const ContentList: React.FC<ContentListProps> = ({
  contentList,
  onAddContent,
  onEditContent,
  onDeleteContent,
  genres,
}) => {
  const [currentContent, setCurrentContent] = useState<Content>({
    id: 0,
    name: '',
    contentTypeId: 0,
    description: '',
    releaseDate: '',
    durationMin: 0,
    ageRating: '',
    genres: [],
    episodes: [],
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
      genres: [],
      episodes: [],
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
            <th>Description</th>
            <th>Release Date</th>
            <th>Duration</th>
            <th>Age Rating</th>
            <th>Genres</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contentList.map((content, index) => (
            <tr key={content.id}>
              <td>{content.name}</td>
              <td>{content.description}</td>
              <td>{content.releaseDate}</td>
              <td>{content.durationMin} min</td>
              <td>{content.ageRating}</td>
              <td>
                <ul>
                  {content.genres?.map((genre) => (
                    <li key={genre.id}>{genre.name}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => startEditing(content, index)}>Edit</button>
                <button onClick={() => onDeleteContent(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditorVisible && (
        <ContentEdit
          content={currentContent}
          isEditMode={isEditMode}
          onSave={saveContent}
          onCancel={cancelEdit}
          genres={genres}
        />
      )}
    </div>
  );
};

export default ContentList;
