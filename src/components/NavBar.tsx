import React from 'react';
import { Link } from 'react-router-dom';

interface NavBarProps {
  onLogout: () => void;
  currentUser: { firstName: string; role: string } | null;
}

const NavBar: React.FC<NavBarProps> = ({ onLogout, currentUser }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        {currentUser && (
          <p>Welcome, {currentUser.firstName} ({currentUser.role})</p>
        )}
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>
      <nav>
        <ul style={{ listStyle: 'none', padding: '10px', display: 'flex', gap: '20px' }}>
          <li>
            <Link to="/">User List</Link>
          </li>
          <li>
            <Link to="/series">Series List</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;