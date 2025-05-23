import { BrowserRouter, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';
import MessagesPage from './pages/MessagesPage';
import ArtGalleryPage from './pages/ArtGalleryPage';
import { AuthRoute, UnauthRoute } from './routes/AutoRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<UnauthRoute><LoginPage /></UnauthRoute>} />
          <Route path="/register" element={<UnauthRoute><RegisterPage /></UnauthRoute>} />
          
          <Route path="/gallery" element={<ArtGalleryPage />} />
          
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/:id/edit" element={<AuthRoute><ProfileEditPage /></AuthRoute>} />
          <Route path="/messages" element={<AuthRoute><MessagesPage /></AuthRoute>} />
          <Route path="/messages/:conversationId" element={<AuthRoute><MessagesPage /></AuthRoute>} />
          
          <Route path="/" element={<Route path="/" element={<ArtGalleryPage />} />} />
          <Route path="*" element={<ArtGalleryPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
