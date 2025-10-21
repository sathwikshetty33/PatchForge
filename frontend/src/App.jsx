import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import IntroPage from './pages/IntroPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import RepositoriesPage from './pages/RepositoriesPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import GitHubCallback from './pages/GithubCallback';
import './index.css'
function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" /> : <IntroPage />} />
      <Route path="/auth" element={user ? <Navigate to="/home" /> : <AuthPage />} />
      <Route path="/auth/github/callback" element={<GitHubCallback />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      
      <Route path="/repositories" element={
        <ProtectedRoute>
          <RepositoriesPage />
        </ProtectedRoute>
      } />
      
      <Route path="/about" element={
        <ProtectedRoute>
          <AboutPage />
        </ProtectedRoute>
      } />
      
      {/* <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />
       */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;