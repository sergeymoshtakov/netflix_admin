import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/UserList';
import SeriesList from './components/SeriesList';
import { User } from './models/User';
import { Series } from './models/Series';
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
  const [seriesList, setSeriesList] = useState<Series[]>([]);
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

  return (
    <Router>
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
            <nav>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
                <li>
                  <Link to="/">User List</Link>
                </li>
                <li>
                  <Link to="/series">Series List</Link>
                </li>
              </ul>
            </nav>
            <Routes>
              <Route
                path="/"
                element={
                  <UserList
                    users={users}
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
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;