import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/user/UserList';
import ContentList from './components/content/ContentList';
import RoleList from './components/role/RoleList';
import GenreList from './components/genre/GenreList';
import NavBar from './components/NavBar';
import { AppUser, Role } from './models/AppUser';
import { Content, Genre } from './models/Series';
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
      roles: [initialRoles[0]], // Роль "admin"
      isBanned: false,
    },
  ]);
  const [contentList, setContentList] = useState<Content[]>([]);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [genres, setGenres] = useState<Genre[]>([]);
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

  const handleAddContent = (content: Content) => {
    setContentList([...contentList, content]);
  };

  const handleEditContent = (content: Content, index: number) => {
    const updatedSeries = [...contentList];
    updatedSeries[index] = content;
    setContentList(updatedSeries);
  };

  const handleDeleteContent = (index: number) => {
    const updatedContent = contentList.filter((_, i) => i !== index);
    setContentList(updatedContent);
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

  const handleAddRole = (role: Role) => {
    setRoles([...roles, role]);
  };

  const handleAddGenre = (genre: Genre) => {
    setGenres([...genres, genre]);
  };

  const handleEditGenre = (genre: Genre, index: number) => {
    const updatedGenres = [...genres];
    updatedGenres[index] = genre;
    setGenres(updatedGenres);
  };

  const handleDeleteGenre = (index: number) => {
    const updatedGenres = genres.filter((_, i) => i !== index);
    setGenres(updatedGenres);
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
                  <ContentList
                    contentList={contentList}
                    onAddContent={handleAddContent}
                    onEditContent={handleEditContent}
                    onDeleteContent={handleDeleteContent}
                    genres={genres}
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
                    onAddRole={handleAddRole}
                  />
                }
              />
              <Route
                path="/categories"
                element={
                  <GenreList
                    genres={genres}
                    onAddGenre={handleAddGenre}
                    onEditGenre={handleEditGenre}
                    onDeleteGenre={handleDeleteGenre}
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