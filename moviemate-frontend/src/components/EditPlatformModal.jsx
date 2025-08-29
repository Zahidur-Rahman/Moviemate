import { useState, useEffect } from 'react';

const EditPlatformModal = ({ platform, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    website: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (platform) {
      setFormData({
        name: platform.name || '',
        about: platform.about || '',
        website: platform.website || ''
      });
    }
  }, [platform]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onUpdate(platform.id, formData);
    } catch (error) {
      alert('Failed to update platform: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!platform) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Edit Platform</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Platform Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={30}
              placeholder="e.g., Netflix, Amazon Prime"
            />
          </div>

          <div className="form-group">
            <label htmlFor="about">About *</label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              required
              maxLength={150}
              rows={3}
              placeholder="Brief description of the platform..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Website *</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              required
              placeholder="https://example.com"
            />
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
              {loading ? 'Updating...' : 'Update Platform'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlatformModal;
