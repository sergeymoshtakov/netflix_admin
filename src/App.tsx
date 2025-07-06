import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import UserList from './components/user/UserList';
import ContentList from './components/content/ContentList';
import RoleList from './components/role/RoleList';
import GenreList from './components/genre/GenreList';
import ContentTypeList from './components/contentType/ContentTypeList';
import ActorList from './components/actor/ActorList';
import EpisodeList from './components/episode/EpisodeList';
import WarningList from './components/warning/WarningList';
import NavBar from './components/NavBar';
import { AppUser, IRawUser, Role } from './models/AppUser';
import { Content, ContentType, Genre, Actor, Episode, Warning } from './models/Series';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  const initialContentTypes: ContentType[] = [
    {
      id: 1,
      name: 'TV Series',
      description: 'A multi-episode audiovisual production released in parts.',
      tags: 'series,episodes,show,tv'
    },
    {
      id: 2,
      name: 'Movie',
      description: 'A feature-length audiovisual production with a complete storyline.',
      tags: 'movie,film,cinema,feature'
    }
  ];

  const [users, setUsers] = useState<AppUser[]>([]);
  const [contentList, setContentList] = useState<Content[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>(initialContentTypes);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch('/api/v1/roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data: { role: string }[] = await response.json();

          const roles = data.map((item, index) => ({
            id: index + 1,
            name: item.role
          }));
          setRoles(roles);
        } else {
          console.error('Failed to fetch roles. Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, [accessToken]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!accessToken || roles.length === 0) return;

      try {
        const response = await fetch('/api/v1/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const mappedUsers = data.data.map((user: IRawUser) => ({
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            phoneNum: user.phoneNum,
            encPassword: '',
            avatar: user.avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isActive: user.active,
            roles: user.roles.map((roleName: string) => {
              const foundRole = roles.find(r => r.name === roleName);
              return foundRole ? { id: foundRole.id, name: foundRole.name } : { id: 0, name: roleName };
            }),
          }));

          setUsers(mappedUsers);
        } else {
          console.error('Failed to fetch users. Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [accessToken, roles]);

  useEffect(() => {
    const fetchActors = async () => {

      try {
        const response = await fetch('/api/v1/actors/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: Actor[] = await response.json();
          setActors(data);
        } else {
          console.error('Failed to fetch actors. Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching actors:', error);
      }
    };

    fetchActors();
  }, [accessToken]);

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (response.ok) {
        console.log('Successfully logged out from the backend.');
      } else {
        console.error('Backend logout failed. Status:', response.status, response.statusText);
        const errorText = await response.text(); 
        console.error('Backend logout error response body:', errorText);
      }
    } catch (error) {
      console.error('Network error during backend logout attempt:', error);
    } finally {
      setCurrentUser(null);
    }
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

  const handleAddContentType = (contentType: ContentType) => {
    setContentTypes([...contentTypes, contentType]);
  };

  const handleEditContentType = (contentType: ContentType, index: number) => {
    const updatedContentTypes = [...contentTypes];
    updatedContentTypes[index] = contentType;
    setContentTypes(updatedContentTypes);
  };

  const handleDeleteContentType = (index: number) => {
    const updatedContentTypes = contentTypes.filter((_, i) => i !== index);
    setContentTypes(updatedContentTypes);
  };

const handleAddActor = async (actor: Actor) => {
    try {
      const response = await fetch('/api/v1/actors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: actor.name,
          surname: actor.surname,
          biography: actor.biography || ''
        }),
      });

      if (response.ok) {
        const fetchResponse = await fetch('/api/v1/actors/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (fetchResponse.ok) {
          const data: Actor[] = await fetchResponse.json();
          setActors(data);
        }
      } else {
        console.error('Failed to add actor. Status:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding actor:', error);
    }
  };

  const handleEditActor = (actor: Actor, index: number) => {
    const updatedActor = [...actors];
    updatedActor[index] = actor;
    setActors(updatedActor);
  };

  const handleDeleteActor = (index: number) => {
    const updatedActor = actors.filter((_, i) => i !== index);
    setActors(updatedActor);
  };

  const handleAddEpisode = (episode: Episode) => {
    setEpisodes([...episodes, episode]);
  };

  const handleEditEpisode = (episode: Episode, index: number) => {
    const updatedEpisode = [...episodes];
    updatedEpisode[index] = episode;
    setEpisodes(updatedEpisode);
  };

  const handleDeleteEpisode = (index: number) => {
    const updatedEpisode = episodes.filter((_, i) => i !== index);
    setEpisodes(updatedEpisode);
  };

  const handleAddWarning = (warning: Warning) => {
    setWarnings([...warnings, warning]);
  };

  const handleEditWarning = (warning: Warning, index: number) => {
    const updatedWarning = [...warnings];
    updatedWarning[index] = warning;
    setWarnings(updatedWarning);
  };

  const handleDeleteWarning = (index: number) => {
    const updatedWarning = warnings.filter((_, i) => i !== index);
    setWarnings(updatedWarning);
  };

  return (
    <Router>
      <div>
        {!currentUser ? (
          <Login onLogin={handleLogin} setRefreshToken={setRefreshToken} setAccessToken={setAccessToken} />
        ) : (
          <div className='body'>
            <h1 className="page-title">Cinemate: Admin Panel</h1>
            <NavBar onLogout={handleLogout} currentUser={currentUser} />
            <main>
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
                    contentTypes={contentTypes}
                    actors={actors}
                    warnings={warnings}
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
              <Route
                path="/contentTypes"
                element={
                  <ContentTypeList
                    contentTypes={contentTypes}
                    onAddContentType={handleAddContentType}
                    onEditContentType={handleEditContentType}
                    onDeleteContentType={handleDeleteContentType}
                  />
                }
              />
              <Route
                path="/actors"
                element={
                  <ActorList
                    actors={actors}
                    onAddActor={handleAddActor}
                    onEditActor={handleEditActor}
                    onDeleteActor={handleDeleteActor}
                  />
                }
              />
              <Route
                path="/episodes"
                element={
                  <EpisodeList
                    episodes={episodes}
                    onAddEpisode={handleAddEpisode}
                    onEditEpisode={handleEditEpisode}
                    onDeleteEpisode={handleDeleteEpisode}
                    contentList={contentList}
                    contentTypes={contentTypes}
                  />
                }
              />
              <Route
                path="/warnings"
                element={
                  <WarningList
                    warnings={warnings}
                    onAddWarning={handleAddWarning}
                    onEditWarning={handleEditWarning}
                    onDeleteWarning={handleDeleteWarning}
                  />
                }
              />
            </Routes>
            </main>
            <hr />
            <Footer/>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;