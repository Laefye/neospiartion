import { Routes, Route } from 'react-router';
import LoginPage from '../pages/LoginPage';
import VKCallback from '../pages/VKCallback';
import RegisterPage from '../pages/RegisterPage';
import FeedPage from '../pages/FeedPage';
import { AuthProvider } from '../contexts/AuthContext';
import ProfilePage from '../pages/ProfilePage';
import ProfileEditPage from '../pages/ProfileEditPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/vk-callback" element={<VKCallback />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/feed" element={<AuthProvider requirement='auth'><FeedPage /></AuthProvider>} />
      <Route path="/profile/:id" element={<AuthProvider requirement='any'><ProfilePage /></AuthProvider>} />
      <Route path="/profile/:id/edit" element={<AuthProvider requirement='auth'><ProfileEditPage /></AuthProvider>} />
      {/* Add your other routes here */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}