import { Routes, Route } from 'react-router';
import LoginPage from '../pages/LoginPage';
import VKCallback from '../pages/VKCallback';
import RegisterPage from '../pages/RegisterPage';
import FeedPage from '../pages/FeedPage';
import { AuthProvider } from '../contexts/AuthContext';
import ProfilePage from '../pages/ProfilePage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/vk-callback" element={<VKCallback />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/feed" element={<AuthProvider requirement='auth'><FeedPage /></AuthProvider>} />
      <Route path="/profile/:id" element={<AuthProvider requirement='auth'><ProfilePage /></AuthProvider>} />
      {/* Add your other routes here */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}