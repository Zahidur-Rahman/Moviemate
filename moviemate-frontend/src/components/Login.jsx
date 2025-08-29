import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { authAPI } from '../services/api';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const { login, setUser } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials.username, credentials.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (signupData.password !== signupData.password2) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const registerResponse = await authAPI.register(signupData);
      
      if (registerResponse.success && registerResponse.response === 'Registration Successful') {
        // Registration successful - auto-login using the provided user data
        if (registerResponse.user) {
          // Set user directly from registration response (no need to call login API again)
          setUser(registerResponse.user);
          // Clear form and redirect will happen via useEffect in App.jsx
        } else {
          // Fallback: try traditional login
          try {
            await login(signupData.username, signupData.password);
          } catch (loginErr) {
            setError('Registration successful, but auto-login failed. Please login manually.');
          }
        }
      } else if (registerResponse.username || registerResponse.email || registerResponse.password) {
        // Handle validation errors
        const errorMessages = [];
        if (registerResponse.username) errorMessages.push(`Username: ${Array.isArray(registerResponse.username) ? registerResponse.username.join(', ') : registerResponse.username}`);
        if (registerResponse.email) errorMessages.push(`Email: ${Array.isArray(registerResponse.email) ? registerResponse.email.join(', ') : registerResponse.email}`);
        if (registerResponse.password) errorMessages.push(`Password: ${Array.isArray(registerResponse.password) ? registerResponse.password.join(', ') : registerResponse.password}`);
        setError(errorMessages.join('; '));
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignupChange = (e) => {
    setSignupData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎬 MovieMate</h1>
          <p>{isSignup ? 'Create your account to get started!' : 'Welcome back! Please sign in to your account.'}</p>
        </div>
        
        {!isSignup ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleLoginChange}
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleLoginChange}
                autoComplete="off"
                required
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <p className="switch-form">
              Don't have an account? 
              <button type="button" onClick={() => setIsSignup(true)} className="link-btn">
                Sign Up
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="signup-username">Username</label>
              <input
                type="text"
                id="signup-username"
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input
                type="email"
                id="signup-email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="signup-password2">Confirm Password</label>
              <input
                type="password"
                id="signup-password2"
                name="password2"
                value={signupData.password2}
                onChange={handleSignupChange}
                autoComplete="off"
                required
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <p className="switch-form">
              Already have an account? 
              <button type="button" onClick={() => setIsSignup(false)} className="link-btn">
                Sign In
              </button>
            </p>
          </form>
        )}
        
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default Login;
