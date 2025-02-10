import React, { useState } from 'react';
import UserEdit from './UserEdit';
import { User } from '../models/User';

interface UserListProps {
  users: User[];
  onAddUser: (user: User) => void;
  onEditUser: (user: User, index: number) => void;
  onDeleteUser: (index: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onAddUser, onEditUser, onDeleteUser }) => {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    registrationDate: new Date().toISOString().split('T')[0],
    role: 'user',
  });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentUser({
      id: Date.now(),
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      registrationDate: new Date().toISOString().split('T')[0],
      role: 'user',
    });
    setIsEditMode(false);
    setIsEditorVisible(true);
  };

  const startEditing = (user: User, index: number) => {
    setCurrentUser({ ...user });
    setIsEditMode(true);
    setEditingIndex(index);
    setIsEditorVisible(true);
  };

  const saveUser = (user: User) => {
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
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Registration Date</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
              <td>{user.registrationDate}</td>
              <td>{user.role}</td>
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