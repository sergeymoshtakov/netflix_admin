import React, { useState } from 'react';
import UserEdit from './UserEdit';
import { AppUser, Role } from '../../models/AppUser';

interface UserListProps {
  users: AppUser[];
  roles: Role[];
  onAddUser: (user: AppUser) => void;
  onEditUser: (user: AppUser, index: number) => void;
  onDeleteUser: (index: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, roles, onAddUser, onEditUser, onDeleteUser }) => {
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
    roles: [],
    isBanned: false,
  });

  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof AppUser | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
      roles: [],
      isBanned: false,
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

  const toggleBanUser = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index].isBanned = !updatedUsers[index].isBanned;
    onEditUser(updatedUsers[index], index);
  };

  const handleSort = (field: keyof AppUser) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedUsers = [...users]
    .filter((user) =>
      [user.username, user.firstname, user.surname, user.email, user.phone_num]
        .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valueA = (a[sortField] || '').toString().toLowerCase();
      const valueB = (b[sortField] || '').toString().toLowerCase();
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="user-list">
      <div style={{ marginBottom: '10px' }}>
        <button onClick={startAdding}>Add New User</button>
        <input
          type="text"
          placeholder="Search by username, name, email, phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-field"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('username')} style={{ cursor: 'pointer' }}>
              Username {sortField === 'username' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('firstname')} style={{ cursor: 'pointer' }}>
              First Name {sortField === 'firstname' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('surname')} style={{ cursor: 'pointer' }}>
              Surname {sortField === 'surname' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
              Email {sortField === 'email' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th onClick={() => handleSort('phone_num')} style={{ cursor: 'pointer' }}>
              Phone {sortField === 'phone_num' && (sortDirection === 'asc' ? '▲' : '▼')}
            </th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedUsers.map((user, index) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.firstname}</td>
              <td>{user.surname}</td>
              <td>{user.email}</td>
              <td>{user.phone_num}</td>
              <td data-status={user.isBanned ? 'banned' : 'active'}>
                {user.isBanned ? 'Banned' : 'Active'}
              </td>
              <td>
                <button onClick={() => startEditing(user, index)}>Edit</button>
                <button onClick={() => toggleBanUser(index)}>
                  {user.isBanned ? 'Unban' : 'Ban'}
                </button>
                <button onClick={() => onDeleteUser(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isEditorVisible && (
        <UserEdit
          user={currentUser}
          roles={roles}
          isEditMode={isEditMode}
          onSave={saveUser}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
};

export default UserList;