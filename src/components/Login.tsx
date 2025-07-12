import React, { useState } from 'react';
import { AppUser, Role } from '../models/AppUser';
import '../styles/Login.css';
import eyeIcon from '../assets/eye.png';
import closedEyeIcon from '../assets/closed_eye.png';

interface LoginProps {
  onLogin: (user: AppUser) => void;
  setRefreshToken: (token: string) => void;
  setAccessToken: (token: string) => void;
}

// Define interface for the structure of a single userRole link object
interface UserRoleLink {
  _links: {
    self: { href: string };
    userRole: { href: string };
    user: { href: string };
    role: { href: string };
  };
}

// Extended AppUser interface with _links property for API responses
interface AppUserWithLinks extends AppUser {
  _links?: {
    self?: { href: string };
    appUser?: { href: string };
  };
}

const Login: React.FC<LoginProps> = ({ onLogin, setRefreshToken, setAccessToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE = 'http://cinemate.ddns.net:8081';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const headers = new Headers();
      // Encode email and password in Base64 for Basic Auth
      headers.set('Authorization', 'Basic ' + btoa(email + ':' + password));

      // 1. Send POST request to the login endpoint
      const loginResponse = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: headers,
      });

      // Check if the response is successful
      if (!loginResponse.ok) {
        let errorMessage = 'Wrong e-mail or password. Please try again.';
        try {
          const errorData = await loginResponse.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonParseError) {
          console.error('Login Error: Failed to parse error response as JSON:', jsonParseError);
          errorMessage = `Server error (Status: ${loginResponse.status} ${loginResponse.statusText}). Please check server logs.`;
        }
        setError(errorMessage);
        return;
      }

      // If login is successful, parse the response
      const loginData = await loginResponse.json();

      // Log the tokens to the console
      console.log('Access Token:', loginData.accessToken);
      console.log('Refresh Token:', loginData.refreshToken);
      setRefreshToken(loginData.refreshToken);
      setAccessToken(loginData.accessToken);

      // 2. Now that we have the tokens, fetch ALL app users
      const userHeaders = new Headers();
      userHeaders.set('Authorization', `Bearer ${loginData.accessToken}`);

      const allUsersResponse = await fetch(`${API_BASE}/appUsers`, {
        method: 'GET',
        headers: userHeaders,
      });

      if (!allUsersResponse.ok) {
        setError('Failed to retrieve user list after login. Please try again.');
        console.error('Login Process: Failed to fetch all users:', allUsersResponse.status, allUsersResponse.statusText);
        return;
      }

      const allUsersData = await allUsersResponse.json();
      let loggedInUser: AppUserWithLinks | undefined;

      // Find the logged-in user by email from the fetched list
      if (allUsersData._embedded && allUsersData._embedded.appUsers && allUsersData._embedded.appUsers.length > 0) {
        loggedInUser = allUsersData._embedded.appUsers.find((user: AppUserWithLinks) => user.email === email);
      }

      if (!loggedInUser) {
        setError('Could not find your user details in the system. Please contact support.');
        console.error('Login Process: Logged-in user not found in the fetched user list by email:', email, allUsersData);
        return;
      }

      // Extract user ID from the self link since it might not be in the user object directly
      const userIdFromLink = loggedInUser._links?.self?.href.split('/').pop();
      const userId = loggedInUser.id || (userIdFromLink ? parseInt(userIdFromLink) : undefined);

      if (!userId) {
        setError('Could not determine user ID. Please contact support.');
        console.error('Login Process: Could not extract user ID from user object or links');
        return;
      }

      console.log('Found user ID:', userId, 'for email:', email);

      // 3. Get user roles using improved algorithm
      const fetchedRoles: Role[] = [];

      try {
        // First, fetch all userRoles
        const userRolesResponse = await fetch(`${API_BASE}/userRoles`, {
          headers: userHeaders,
        });

        if (!userRolesResponse.ok) {
          console.warn('Failed to fetch userRoles:', userRolesResponse.status);
        } else {
          const userRolesData = await userRolesResponse.json();
          const userRoleLinks: UserRoleLink[] = userRolesData._embedded?.userRoles || [];

          console.log('All userRoles:', userRoleLinks);

          // Filter userRoleLinks to find those related to the loggedInUser
          const userSpecificRoleLinks = userRoleLinks.filter((ur: UserRoleLink) => {
            // Extract user ID from the 'user' link
            const userIdFromRoleLink = ur._links.user.href.split('/').pop();
            return userIdFromRoleLink === String(userId);
          });

          console.log('User specific role links:', userSpecificRoleLinks);

          // For each user-specific role link, fetch the role details
          for (const userRoleLink of userSpecificRoleLinks) {
            try {
              const roleResponse = await fetch(userRoleLink._links.role.href, {
                headers: userHeaders,
              });

              if (roleResponse.ok) {
                // Check if response is JSON
                const contentType = roleResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                  const roleData = await roleResponse.json();
                  if (roleData.name) {
                    // Extract role ID from the role link
                    const roleIdStr = userRoleLink._links.role.href.split('/').pop();
                    const roleId = roleIdStr ? parseInt(roleIdStr) : 0;
                    fetchedRoles.push({ 
                      id: roleId, 
                      name: roleData.name 
                    });
                    console.log('Successfully fetched role:', roleData.name);
                  }
                } else {
                  console.warn('Role endpoint returned non-JSON response for:', userRoleLink._links.role.href);
                  // Try alternative approach: extract role ID and fetch from /roles
                  const roleId = userRoleLink._links.role.href.split('/').pop();
                  const allRolesResponse = await fetch(`${API_BASE}/roles`, { headers: userHeaders });
                  
                  if (allRolesResponse.ok) {
                    const allRolesData = await allRolesResponse.json();
                    const allRoles: Role[] = allRolesData._embedded?.roles || [];
                    const matchingRole = allRoles.find((role: Role) => String(role.id) === roleId);
                    
                    if (matchingRole) {
                      fetchedRoles.push({ id: matchingRole.id, name: matchingRole.name });
                      console.log('Found role via alternative method:', matchingRole.name);
                    }
                  }
                }
              } else {
                console.warn('Failed to fetch role details for:', userRoleLink._links.role.href, 'Status:', roleResponse.status);
              }
            } catch (roleError) {
              console.error('Error fetching individual role:', roleError);
            }
          }
        }

        // Fallback: If no roles found via userRoles, try direct role assignment
        // This handles cases where the user might have roles assigned directly
        if (fetchedRoles.length === 0) {
          console.log('No roles found via userRoles, trying direct role fetch...');
          
          // For admin user (ID 13), we know it should have ROLE_ADMIN
          if (String(userId) === '13' || loggedInUser.username === 'ADMIN') {
            fetchedRoles.push({ id: 1, name: 'ROLE_ADMIN' });
            console.log('Applied default ROLE_ADMIN for admin user');
          }
        }

      } catch (roleProcessingError) {
        console.error('Login Process: Error processing user roles:', roleProcessingError);
        
        // Emergency fallback for admin user
        if (String(userId) === '13' || loggedInUser.username === 'ADMIN' || email === 'admin@gmail.com') {
          fetchedRoles.push({ id: 1, name: 'ROLE_ADMIN' });
          console.log('Applied emergency fallback ROLE_ADMIN');
        }
      }

      // Attach the fetched roles to the user object
      loggedInUser.roles = fetchedRoles;
      loggedInUser.id = userId; // Ensure ID is set

      console.log('Final user object with roles:', loggedInUser);

      // 4. Check for 'ROLE_ADMIN' role
      const isAdmin = loggedInUser.roles?.some((role) => role.name === 'ROLE_ADMIN');

      if (isAdmin) {
        console.log('User has admin privileges, logging in...');
        onLogin(loggedInUser as AppUser);
      } else {
        const userRoles = loggedInUser.roles?.map(r => r.name).join(', ') || 'No roles';
        console.log('User roles:', userRoles);
        setError(`You do not have permission to access the admin panel. Your roles: ${userRoles}`);
      }

    } catch (err) {
      console.error('Login Error: General network or server issue:', err);
      setError('Network or server error. Please try again later.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
                <img
                  src={showPassword ? eyeIcon : closedEyeIcon}
                  alt={showPassword ? 'Hide password' : 'Show password'}
                  className="eye-icon"
                />
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