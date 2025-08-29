import { useState, useEffect } from 'react';
import { moviesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';
import MovieCard from './MovieCard';
import MovieModal from './MovieModal';
import CreateMovieModal from './CreateMovieModal';
import CreatePlatformModal from './CreatePlatformModal';
import EditMovieModal from './EditMovieModal';
import EditPlatformModal from './EditPlatformModal';

const Dashboard = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showCreateMovie, setShowCreateMovie] = useState(false);
  const [showCreatePlatform, setShowCreatePlatform] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [editingPlatform, setEditingPlatform] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadMovies();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  const loadData = async () => {
    await Promise.all([loadMovies(), loadPlatforms()]);
  };

  const loadMovies = async () => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const data = await moviesAPI.getMovies(params);
      setMovies(data.results || data);
      setError('');
    } catch (err) {
      setError('Failed to load movies: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPlatforms = async () => {
    try {
      const data = await moviesAPI.getPlatforms();
      setPlatforms(data.results || data);
    } catch (err) {
      // Silently handle platform loading errors
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleCreateMovie = async (movieData) => {
    try {
      await moviesAPI.createMovie(movieData);
      setShowCreateMovie(false);
      loadMovies();
    } catch (err) {
      alert('Failed to create movie: ' + err.message);
    }
  };

  const handleCreatePlatform = async (platformData) => {
    try {
      await moviesAPI.createPlatform(platformData);
      setShowCreatePlatform(false);
      loadPlatforms();
    } catch (err) {
      alert('Failed to create platform: ' + err.message);
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
  };

  const handleUpdateMovie = async (movieId, movieData) => {
    try {
      await moviesAPI.updateMovie(movieId, movieData);
      setEditingMovie(null);
      loadMovies();
    } catch (err) {
      throw err;
    }
  };

  const handleEditPlatform = (platform) => {
    setEditingPlatform(platform);
  };

  const handleUpdatePlatform = async (platformId, platformData) => {
    try {
      await moviesAPI.updatePlatform(platformId, platformData);
      setEditingPlatform(null);
      loadPlatforms();
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteMovie = async (movieId) => {
    // Prevent double-clicks by checking if movie still exists
    const movieExists = movies.find(movie => movie.id === movieId);
    if (!movieExists) {
      return; // Movie already deleted
    }

    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        // Optimistically remove from local state immediately
        setMovies(prevMovies => prevMovies.filter(movie => movie.id !== movieId));
        await moviesAPI.deleteMovie(movieId);
      } catch (err) {
        // Restore movie to list if delete failed
        loadMovies();
        alert('Failed to delete movie: ' + err.message);
      }
    }
  };

  const handleDeletePlatform = async (platformId) => {
    // Prevent double-clicks by checking if platform still exists
    const platformExists = platforms.find(platform => platform.id === platformId);
    if (!platformExists) {
      return; // Platform already deleted
    }

    if (window.confirm('Are you sure you want to delete this platform?')) {
      try {
        // Optimistically remove from local state immediately
        setPlatforms(prevPlatforms => prevPlatforms.filter(platform => platform.id !== platformId));
        await moviesAPI.deletePlatform(platformId);
        // Reload movies as they might reference deleted platform
        loadMovies();
      } catch (err) {
        // Restore platform to list if delete failed
        loadPlatforms();
        alert('Failed to delete platform: ' + err.message);
      }
    }
  };

  const isAdmin = user && user.is_staff;

  return (
    <main className="main-content">
      <div className="container">
        <div className="dashboard-header">
          <h2>Movie Collection</h2>
          <div className="dashboard-actions">
            <input
              type="text"
              placeholder="Search movies..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {isAdmin && (
              <div className="admin-buttons">
                <button 
                  onClick={() => setShowCreateMovie(true)}
                  className="create-btn"
                >
                  Add Movie
                </button>
                <button 
                  onClick={() => setShowCreatePlatform(true)}
                  className="create-btn"
                >
                  Add Platform
                </button>
              </div>
            )}
          </div>
        </div>

        {platforms.length > 0 && (
          <div className="platforms-section">
            <h3>Platforms ({platforms.length})</h3>
            <div className="platforms-list">
              {platforms.map(platform => (
                <div key={platform.id} className="platform-chip">
                  <span>{platform.name}</span>
                  {isAdmin && (
                    <>
                      <button 
                        onClick={() => handleEditPlatform(platform)}
                        className="edit-platform-btn"
                        title="Edit Platform"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeletePlatform(platform.id)}
                        className="delete-platform-btn"
                        title="Delete Platform"
                      >
                        ❌
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading movies...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={loadMovies} className="retry-btn">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div className="movies-grid">
            {movies.length > 0 ? (
              movies.map(movie => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie} 
                  onClick={handleMovieClick}
                  onDelete={isAdmin ? handleDeleteMovie : null}
                  onEdit={isAdmin ? handleEditMovie : null}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <div className="no-movies">
                <h3>No movies found</h3>
                <p>Found {movies.length} movies. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}

        <MovieModal 
          movie={selectedMovie} 
          onClose={closeModal}
        />

        {/* Create Movie Modal */}
        {showCreateMovie && (
          <CreateMovieModal 
            platforms={platforms}
            onClose={() => setShowCreateMovie(false)}
            onCreate={handleCreateMovie}
          />
        )}

        {/* Create Platform Modal */}
        {showCreatePlatform && (
          <CreatePlatformModal 
            onClose={() => setShowCreatePlatform(false)}
            onCreate={handleCreatePlatform}
          />
        )}

        {/* Edit Movie Modal */}
        {editingMovie && (
          <EditMovieModal 
            movie={editingMovie}
            platforms={platforms}
            onClose={() => setEditingMovie(null)}
            onUpdate={handleUpdateMovie}
          />
        )}

        {/* Edit Platform Modal */}
        {editingPlatform && (
          <EditPlatformModal 
            platform={editingPlatform}
            onClose={() => setEditingPlatform(null)}
            onUpdate={handleUpdatePlatform}
          />
        )}
      </div>
    </main>
  );
};

export default Dashboard;
