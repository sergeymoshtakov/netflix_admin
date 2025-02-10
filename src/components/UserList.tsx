import React, { useState } from 'react';
import UserEdit from './UserEdit';

interface User {
  firstName: string;
  lastName: string;
  registrationDate: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { firstName: 'Andrew', lastName: 'Stone', registrationDate: new Date().toISOString().split('T')[0] },
    { firstName: 'Marry', lastName: 'Smith', registrationDate: new Date().toISOString().split('T')[0] },
  ]);

  const [currentUser, setCurrentUser] = useState<User>({ firstName: '', lastName: '', registrationDate: '' });
  const [isEditorVisible, setIsEditorVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startAdding = () => {
    setCurrentUser({ firstName: '', lastName: '', registrationDate: new Date().toISOString().split('T')[0] });
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
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = user;
      setUsers(updatedUsers);
    } else {
      setUsers([...users, user]);
    }
    cancelEdit();
  };

  const deleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const cancelEdit = () => {
    setIsEditorVisible(false);
    setCurrentUser({ firstName: '', lastName: '', registrationDate: '' });
    setEditingIndex(null);
  };

  return (
    <div className="user-list">
      <button onClick={startAdding}>Add New User</button>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.registrationDate}</td>
              <td>
                <button onClick={() => startEditing(user, index)}>Edit</button>
                <p></p>
                <button onClick={() => deleteUser(index)}>Delete</button>
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