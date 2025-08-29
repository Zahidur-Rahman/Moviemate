import { useState, useEffect } from 'react';

const EditMovieModal = ({ movie, platforms, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform_id: '',
    active: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({
        title: movie.title || '',
        description: movie.description || '',
        platform_id: movie.platform_id || '',
        active: movie.active !== undefined ? movie.active : true
      });
    }
  }, [movie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(movie.id, formData);
    } catch (error) {
      alert('Failed to update movie: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!movie) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Movie</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              maxLength={500}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="platform_id">Platform *</label>
            <select
              id="platform_id"
              name="platform_id"
              value={formData.platform_id}
              onChange={handleChange}
              required
            >
              <option value="">Select a platform</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="create-btn"
              style={{ background: '#6b7280' }}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="create-btn">
              {loading ? 'Updating...' : 'Update Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieModal;
