import { useAuth } from '../hooks/useAuth';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>🎬 MovieMate</h1>
        </div>
        <div className="nav-menu">
          {user ? (
            <div className="user-info">
              <span>Welcome, {user.username}!</span>
              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <span>Please login to continue</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
