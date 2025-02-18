import React, { useState } from 'react';
import { AppUser } from '../models/AppUser';
import '../styles/Login.css';

interface LoginProps {
  users: AppUser[];
  onLogin: (user: AppUser) => void;
}

const Login: React.FC<LoginProps> = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Состояние для показа/скрытия пароля

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email && u.enc_password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Wrong e-mail or password. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Переключаем видимость пароля
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Log in</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className={`input-group ${error ? 'input-error' : ''}`}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={`input-group ${error ? 'input-error' : ''}`}>
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
          </div>
          <button type="submit" className="login-button">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;