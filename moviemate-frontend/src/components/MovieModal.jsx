import { useState, useEffect } from 'react';
import { moviesAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth.jsx';

const MovieModal = ({ movie, onClose }) => {
  const { user } = useAuth();
  const [movieDetails, setMovieDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, description: '' });

  useEffect(() => {
    if (movie) {
      loadMovieDetails();
    }
  }, [movie]);

  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      const [movieData, reviewsData] = await Promise.all([
        moviesAPI.getMovie(movie.id),
        moviesAPI.getReviews(movie.id)
      ]);
      setMovieDetails(movieData);
      setReviews(reviewsData || []);
      setError('');
    } catch (err) {
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await moviesAPI.createReview(movie.id, reviewData);
      setShowReviewForm(false);
      setReviewData({ rating: 5, description: '' });
      loadMovieDetails(); // Reload to show new review
    } catch (err) {
      setError('Failed to add review: ' + err.message);
    }
  };

  const handleReviewChange = (e) => {
    setReviewData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
        
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading movie details...</p>
          </div>
        )}
        
        {error && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}
        
        {movieDetails && !loading && (
          <div>
            <h2>{movieDetails.title}</h2>
            <p><strong>Platform:</strong> {movieDetails.platform || 'Unknown'}</p>
            <p><strong>Description:</strong> {movieDetails.description}</p>
            <p><strong>Rating:</strong> {movieDetails.avg_rating || 'No rating'} ({movieDetails.number_rating || 0} reviews)</p>
            <p><strong>Added:</strong> {new Date(movieDetails.created_at).toLocaleDateString()}</p>
            
            {/* Reviews Section */}
            <div className="reviews-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Reviews ({reviews.length})</h3>
                {user && !showReviewForm && (
                  <button 
                    onClick={() => setShowReviewForm(true)}
                    className="add-review-btn"
                  >
                    Add Review
                  </button>
                )}
              </div>
              
              {/* Add Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} style={{ marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="rating">Rating (1-5)</label>
                    <select
                      id="rating"
                      name="rating"
                      value={reviewData.rating}
                      onChange={handleReviewChange}
                      required
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="description">Review (optional)</label>
                    <textarea
                      id="description"
                      name="description"
                      value={reviewData.description}
                      onChange={handleReviewChange}
                      placeholder="Share your thoughts about this movie..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setShowReviewForm(false)}
                      className="create-btn"
                      style={{ background: '#6b7280' }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="create-btn">
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
              
              {/* Reviews List */}
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <span className="review-user">{review.review_user}</span>
                      <span className="review-rating">
                        {'⭐'.repeat(review.rating)} ({review.rating}/5)
                      </span>
                    </div>
                    {review.description && (
                      <p className="review-description">{review.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                  No reviews yet. Be the first to review this movie!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieModal;
