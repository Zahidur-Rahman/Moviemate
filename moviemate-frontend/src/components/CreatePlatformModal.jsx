import { useState } from 'react';

const CreatePlatformModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    website: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.about.trim() || !formData.website.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    // Ensure URL has proper protocol
    let website = formData.website.trim();
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
      website = 'https://' + website;
    }
    
    onCreate({
      ...formData,
      website: website
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add New Platform</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Platform Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Netflix, Amazon Prime"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label>About:</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the platform"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label>Website URL:</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="example.com or https://example.com"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Platform
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlatformModal;
