import React, { useState } from 'react';
import Login from './components/Login';
import UserList from './components/UserList';
import { User } from './models/User';
import './App.css';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'admin123',
      registrationDate: new Date().toISOString().split('T')[0],
      role: 'admin',
    },
  ]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddUser = (user: User) => {
    setUsers([...users, user]);
  };

  const handleEditUser = (user: User, index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index] = user;
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  return (
    <div>
      <h1 className="page-title">Cinemate: Admin Panel</h1>
      {!currentUser ? (
        <Login users={users} onLogin={handleLogin} />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p>Welcome, {currentUser.firstName} ({currentUser.role})</p>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
          <UserList
            users={users}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      )}
    </div>
  );
};

export default App;