import { useState } from 'react';

const CreateMovieModal = ({ platforms, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform_id: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.platform_id) {
      alert('Please fill in all fields');
      return;
    }
    onCreate(formData);
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
        <h2>Add New Movie</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label>Platform:</label>
            <select
              name="platform_id"
              value={formData.platform_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Platform</option>
              {platforms.map(platform => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMovieModal;
