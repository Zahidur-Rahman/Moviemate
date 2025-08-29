const MovieCard = ({ movie, onClick, onDelete, onEdit, isAdmin }) => {
  const rating = movie.avg_rating || 0;
  const stars = '⭐'.repeat(Math.round(rating));

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();
    // Disable the button temporarily to prevent double-clicks
    e.target.disabled = true;
    onDelete(movie.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(movie);
  };

  return (
    <div className="movie-card" onClick={() => onClick(movie)}>
      {isAdmin && onEdit && (
        <button className="edit-btn" onClick={handleEdit} title="Edit Movie">
          ✏️
        </button>
      )}
      {isAdmin && onDelete && (
        <button className="delete-btn" onClick={handleDelete} title="Delete Movie">
          ×
        </button>
      )}
      <div className="movie-title">{movie.title}</div>
      <div className="movie-platform">{movie.platform || 'Unknown'}</div>
      <div className="movie-description">{movie.description}</div>
      <div className="movie-rating">
        <span className="rating-stars">{stars || 'No rating'}</span>
        <span className="rating-count">({movie.number_rating || 0} reviews)</span>
      </div>
    </div>
  );
};

export default MovieCard;
