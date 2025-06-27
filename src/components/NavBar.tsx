import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppUser } from '../models/AppUser';

interface NavBarProps {
  onLogout: () => void;
  currentUser: AppUser | null;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, currentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='menu-line'>
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
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>
      <nav>
        <ul className={menuOpen ? 'open' : ''}>
          <li><Link to="/">Users</Link></li>
          <li><Link to="/roles">Roles</Link></li>
          <li><Link to="/series">Content</Link></li>
          <li><Link to="/categories">Genres</Link></li>
          <li><Link to="/contentTypes">Content Types</Link></li>
          <li><Link to="/actors">Actors</Link></li>
          <li><Link to="/episodes">Episodes</Link></li>
          <li><Link to="/warnings">Warnings</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;