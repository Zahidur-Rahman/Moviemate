import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navigation />
      {user ? <Dashboard /> : <Login />}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
