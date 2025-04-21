import React from 'react';
import { Link } from 'react-router-dom';
import { AppUser } from '../models/AppUser';

interface NavBarProps {
  onLogout: () => void;
  currentUser: AppUser | null;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, currentUser }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {currentUser && (
          <p>
            Welcome, {currentUser.firstname} (
            {currentUser.roles ? currentUser.roles.map((role) => role.name).join(', ') : 'No roles'})
          </p>
        )}
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
          <li>
            <Link to="/">User List</Link>
          </li>
          <li>
            <Link to="/series">Content</Link>
          </li>
          <li>
            <Link to="/roles">Roles</Link>
          </li>
          <li>
            <Link to="/categories">Genres</Link>
          </li>
          <li>
            <Link to="/contentTypes">Content Types</Link>
          </li>
          <li>
            <Link to="/Actors">Actors</Link>
          </li>
          <li>
            <Link to="/episodes">Episodes</Link>
          </li>
          <li>
            <Link to="/warnings">Warnings</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;