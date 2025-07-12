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

  const [users, setUsers] = useState<AppUser[]>([]);
  const [contentList, setContentList] = useState<Content[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [actors, setActors] = useState<Actor[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const API_BASE = 'http://cinemate.ddns.net:8081';

  useEffect(() => {
    const fetchRoles = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch(`${API_BASE}/api/v1/roles`, {
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
        const response = await fetch(`${API_BASE}/api/v1/users`, {
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
        const response = await fetch(`${API_BASE}/api/v1/actors/all`, {
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

  useEffect(() => {
    const fetchWarnings = async () => {

      try {
        const response = await fetch(`${API_BASE}/api/v1/warnings/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: Warning[] = await response.json();
          setWarnings(data);
        } else {
          console.error('Failed to fetch warnings. Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching warnings:', error);
      }
    };

    fetchWarnings();
  }, [accessToken]);

  useEffect(() => {
    const fetchGenres = async () => {

      try {
        const response = await fetch(`${API_BASE}/api/v1/genres/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: Genre[] = await response.json();
          setGenres(data);
        } else {
          console.error('Failed to fetch genres. Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [accessToken]);

  useEffect(() => {
    const fetchContentTypes = async () => {

      try {
        const response = await fetch(`${API_BASE}/api/v1/content-types/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data: ContentType[] = await response.json();
          setContentTypes(data);
        } else {
          console.error('Failed to fetch content types. Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching content types:', error);
      }
    };

    fetchContentTypes();
  }, [accessToken]);

  useEffect(() => {
    const fetchContents = async () => {
      if (!accessToken) return;

      const searchParams = {
        page: 1,
        size: 20,
        sortBy: 'id',
        isAsc: true,
      };

      const queryString = new URLSearchParams(
        Object.entries(searchParams).reduce((acc, [key, val]) => {
          if (val !== undefined && val !== null) acc[key] = String(val);
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      try {
        const response = await fetch(`${API_BASE}/api/v1/admin/contents?${queryString}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          const mappedContents: Content[] = data.data.map((item: Content) => ({
            id: item.id,
            name: item.name,
            contentTypeId: item.contentTypeId,
            posterUrl: item.posterUrl,
            trailerUrl: item.trailerUrl,
            videoUrl: item.videoUrl,
            description: item.description,
            durationMin: item.durationMin,
            ageRating: item.ageRating,
            releaseDate: item.releaseDate,
            isActive: item.isActive,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            genreIds: item.genreIds,
            actorIds: item.actorIds,
            warningIds: item.warningIds,
          }));

          setContentList(mappedContents);
        } else {
          console.error('Failed to fetch contents. Status:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error while fetching contents:', error);
      }
    };
    fetchContents();
  });

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch(`${API_BASE}/episodes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const loadedEpisodes: Episode[] = data._embedded.episodes.map((ep: {
          id: number;
          name: string;
          contentId: number;
          seasonNumber: number;
          episodeNumber: number;
          durationMin: number;
          description: string;
          trailerUrl: string;
          videoUrl: string;
          releaseDate: string;
          createdAt: string;
        }) => ({
          id: ep.id,
          name: ep.name,
          contentId: ep.contentId,
          seasonNumber: ep.seasonNumber,
          episodeNumber: ep.episodeNumber,
          durationMin: ep.durationMin,
          description: ep.description,
          trailerUrl: ep.trailerUrl,
          videoUrl: ep.videoUrl,
          releaseDate: ep.releaseDate,
          createdAt: ep.createdAt,
        }));

        setEpisodes(loadedEpisodes);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    };

    fetchEpisodes();
  });

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/auth/logout`, {
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

  const handleAddUser = async (user: AppUser) => {
    try {
      const formData = new FormData();
      const userDto = {
        username: user.username,
        firstname: user.firstname,
        surname: user.surname,
        email: user.email,
        password: user.encPassword,
        phoneNum: user.phoneNum,
        roles: user.roles?.map(role => role.name) || [],
        isActive: user.isActive,
      };

      formData.append('metadata', JSON.stringify(userDto));

      if (typeof user.avatar === 'string' && user.avatar.startsWith('data:image')) {
        const response = await fetch(user.avatar);
        const blob = await response.blob();
        const file = new File([blob], 'avatar.png', { type: blob.type });
        formData.append('avatar', file);
      } else {
        console.warn('Avatar is not a valid base64 image string. Skipping avatar upload.');
      }

      const response = await fetch(`${API_BASE}/api/v1/users/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to add user:', response.statusText);
        return;
      }

      setUsers(prev => [...prev, user]);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleEditUser = async (user: AppUser, index: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          username: user.username,
          firstname: user.firstname,
          surname: user.surname,
          email: user.email,
          phoneNum: user.phoneNum,
          password: user.encPassword,
          roles: user.roles?.map(role => role.name || role),
          isActive: user.isActive,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to update user ${user.id}:`, response.statusText);
        return;
      }

      const updatedUsers = [...users];
      updatedUsers[index] = user;
      setUsers(updatedUsers);
    } catch (error) {
      console.error(`Error updating user ${user.id}:`, error);
    }
  };

  const handleDeleteUser = async (index: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/users/${index}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Failed to delete user ${index}:`, response.statusText);
        return;
      }

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === index ? { ...user, isActive: false } : user
        )
      );
    } catch (error) {
      console.error(`Error deleting user ${index}:`, error);
    }
  };

  const handleAddContent = async (content: Content & { posterFile?: File; trailerFile?: File; videoFile?: File }) => {
    setContentList([...contentList, content]);
    try {
      const formData = new FormData();

      const metadata = {
        name: content.name,
        contentType: contentTypes.find(ct => ct.id === content.contentTypeId)?.name || '',
        description: content.description,
        durationMin: content.durationMin,
        ageRating: content.ageRating,
        releaseDate: content.releaseDate,
        actors: content.actorIds,
        genres: content.genreIds,
        warnings: content.warningIds,
        isActive: content.isActive ?? true,
      };

      formData.append("metadata", JSON.stringify(metadata));

      if (content.posterFile) {
        formData.append('poster', content.posterFile);
      }
      if (content.trailerFile) {
        formData.append('trailer', content.trailerFile);
      }
      if (content.videoFile) {
        formData.append('video', content.videoFile);
      }

      const response = await fetch(`${API_BASE}/api/v1/admin/contents`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to add content:', await response.text());
        return;
      }

      setContentList(prev => [...prev, content]);
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const handleEditContent = async (content: Content, index: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/contents/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error(`Error while updating content: ${response.status}`);
      }

      const updatedList = [...contentList];
      updatedList[index] = content;
      setContentList(updatedList);
    } catch (error) {
      console.error('Error editing content:', error);
    }
  };

  const handleDeleteContent = async (index: number, id: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/contents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error while deliting content: ${response.status}`);
      }

      const updatedContent = contentList.filter((_, i) => i !== index);
      setContentList(updatedContent);
    } catch (error) {
      console.error('Cannot delete content:', error);
    }
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

  const handleAddGenre = async (genre: Genre & { file?: File }) => {
    const formData = new FormData();

    const genreMetadata = {
      name: genre.name,
      description: genre.description,
      tags: genre.tags
    };

    formData.append('metadata', JSON.stringify(genreMetadata));

    if (genre.file) {
      formData.append('image', genre.file);
    } else {
      console.error('Image file is required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/v1/genres`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error('Failed to add genre:', await response.text());
        return;
      }

      setGenres(prev => [...prev, genre]);
    } catch (error) {
      console.error('Error during addGenre:', error);
    }
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

  const handleAddContentType = async (contentType: ContentType) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/content-types`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: contentType.name,
          description: contentType.description,
          tags: contentType.tags || ''
        }),
      });

      if (response.ok) {
        const fetchResponse = await fetch(`${API_BASE}/api/v1/content-types/all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (fetchResponse.ok) {
          const data: ContentType[] = await fetchResponse.json();
          setContentTypes(data);
        }
      } else {
        console.error('Failed to add content type. Status:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error adding content type:', error);
    }
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
      const response = await fetch(`${API_BASE}/api/v1/actors`, {
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
        const fetchResponse = await fetch(`${API_BASE}/api/v1/actors/all`, {
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

  const handleAddEpisode = async (episode: Episode) => {
    const formData = new FormData();
    const metadata = {
      name: episode.name,
      contentId: episode.contentId,
      seasonNumber: episode.seasonNumber,
      episodeNumber: episode.episodeNumber,
      durationMin: episode.durationMin,
      description: episode.description,
      releaseDate: episode.releaseDate,
    };
    formData.append('metadata', JSON.stringify(metadata));

    if (episode.trailerUrl instanceof File) {
      formData.append('trailer', episode.trailerUrl);
    }

    if (episode.videoUrl instanceof File) {
      formData.append('video', episode.videoUrl);
    }

    try{
      const response = await fetch(`${API_BASE}/api/v1/admin/episodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to add episode: ${response.statusText}`);
      }

      const savedEpisode = await response.json();
      setEpisodes((prev) => [...prev, savedEpisode]);
    } catch (error) {
      console.error('Error adding episode:', error);
    }
  };

  const handleEditEpisode = async (episode: Episode, index: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/episodes/${episode.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: episode.name,
          contentId: episode.contentId,
          seasonNumber: episode.seasonNumber,
          episodeNumber: episode.episodeNumber,
          durationMin: episode.durationMin,
          description: episode.description,
          trailerUrl: typeof episode.trailerUrl === 'string' ? episode.trailerUrl : '',
          videoUrl: typeof episode.videoUrl === 'string' ? episode.videoUrl : '',
          releaseDate: episode.releaseDate,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update episode: ${response.statusText}`);
      }

      const updatedEpisode = [...episodes];
      updatedEpisode[index] = episode;
      setEpisodes(updatedEpisode);
    } catch (error) {
      console.error('Error editing episode:', error);
    }
  };

  const handleDeleteEpisode = async (index: number, id: number) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/admin/episodes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete episode: ${response.statusText}`);
      }

      const updatedEpisode = episodes.filter((_, i) => i !== index);
      setEpisodes(updatedEpisode);
    } catch (error) {
      console.error('Error deleting episode:', error);
    }
  };

  const handleAddWarning = async (warning: Warning) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/warnings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: warning.name }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to add warning:', errorText);
        return;
      }

      setWarnings([...warnings, warning]);
    } catch (error) {
      console.error('Error adding warning:', error);
    }
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