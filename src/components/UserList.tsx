import React, { useState } from 'react';
import UserEdit from './UserEdit';
import { AppUser } from '../models/AppUser';

interface UserListProps {
  users: AppUser[];
  onAddUser: (user: AppUser) => void;
  onEditUser: (user: AppUser, index: number) => void;
  onDeleteUser: (index: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onAddUser, onEditUser, onDeleteUser }) => {
  const [currentUser, setCurrentUser] = useState<AppUser>({
    id: 0,
    username: '',
    firstname: '',
    surname: '',
    email: '',
    phone_num: '',
    enc_password: '',
    avatar: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentUser({
      id: Date.now(),
      username: '',
      firstname: '',
      surname: '',
      email: '',
      phone_num: '',
      enc_password: '',
      avatar: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (user: AppUser, index: number) => {
    setCurrentUser({ ...user });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveUser = (user: AppUser) => {
    if (isEditMode && editingIndex !== null) {
      onEditUser(user, editingIndex);
    } else {
      onAddUser(user);
    }
    setIsEditorVisible(false);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
  };

  return (
    <div className="user-list">
      <button onClick={startAdding}>Add New User</button>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Surname</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.firstname}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.phone_num}</td>
              <td>
                <button onClick={() => startEditing(user, index)}>Edit</button>
                <button onClick={() => onDeleteUser(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isEditorVisible && (
        <UserEdit
          user={currentUser}
          isEditMode={isEditMode}
          onSave={saveUser}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default UserList;