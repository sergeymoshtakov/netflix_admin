import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';
import SeriesList from './components/SeriesList';
import RoleList from './components/RoleList';
import NavBar from './components/NavBar';
import { AppUser, Role } from './models/AppUser';
import { Series } from './models/Series';
import './App.css';

const App: React.FC = () => {
  const initialRoles: Role[] = [
    { id: 1, name: 'admin' },
    { id: 2, name: 'user' },
  ];

  const [users, setUsers] = useState<AppUser[]>([
    {
      id: 1,
      username: 'admin',
      firstname: 'Admin',
      surname: 'User',
      email: 'admin@example.com',
      phone_num: '1234567890',
      enc_password: 'admin123',
      avatar: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      roles: [initialRoles[0]],
    },
  ]);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleAddUser = (user: AppUser) => {
    setUsers([...users, user]);
  };

  const handleEditUser = (user: AppUser, index: number) => {
    const updatedUsers = [...users];
    updatedUsers[index] = user;
    setUsers(updatedUsers);
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  const handleAddSeries = (series: Series) => {
    setSeriesList([...seriesList, series]);
  };

  const handleEditSeries = (series: Series, index: number) => {
    const updatedSeries = [...seriesList];
    updatedSeries[index] = series;
    setSeriesList(updatedSeries);
  };

  const handleDeleteSeries = (index: number) => {
    const updatedSeries = seriesList.filter((_, i) => i !== index);
    setSeriesList(updatedSeries);
  };

  const handleEditRole = (role: Role, index: number) => {
    const updatedRoles = [...roles];
    updatedRoles[index] = role;
    setRoles(updatedRoles);
  };

  const handleDeleteRole = (index: number) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  return (
    <Router>
      <div>
        <h1 className="page-title">Cinemate: Admin Panel</h1>
        {!currentUser ? (
          <Login users={users} onLogin={handleLogin} />
        ) : (
          <div>
            <NavBar onLogout={handleLogout} currentUser={currentUser} />
            <Routes>
              <Route
                path="/"
                element={
                  <UserList
                    users={users}
                    roles={roles}
                    onAddUser={handleAddUser}
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                  />
                }
              />
              <Route
                path="/series"
                element={
                  <SeriesList
                    seriesList={seriesList}
                    onAddSeries={handleAddSeries}
                    onEditSeries={handleEditSeries}
                    onDeleteSeries={handleDeleteSeries}
                  />
                }
              />
              <Route
                path="/roles"
                element={
                  <RoleList
                    roles={roles}
                    onEditRole={handleEditRole}
                    onDeleteRole={handleDeleteRole}
                  />
                }
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;