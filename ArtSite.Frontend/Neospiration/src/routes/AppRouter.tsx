import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import VKCallback from '../pages/VKCallback';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/vk-callback" element={<VKCallback />} />
      {/* Add your other routes here */}
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}