import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ArtGalleryPage from './pages/ArtGalleryPage';
import ProfileEditPage from './pages/ProfileEditPage';
import MessagesPage from './pages/MessagesPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AuthRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  
  if (auth.loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (!auth.me) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function UnauthRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  
  if (auth.loading) {
    return <div className="loading-spinner">Loading...</div>;
  }
  
  if (auth.me) {
    return <Navigate to="/gallery" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<UnauthRoute><LoginPage /></UnauthRoute>} />
          <Route path="/register" element={<UnauthRoute><RegisterPage /></UnauthRoute>} />
          
          <Route path="/gallery" element={<ArtGalleryPage />} />
          
          <Route path="/profile/:id" element={<AuthRoute><ProfilePage /></AuthRoute>} />
          <Route path="/profile/:id/edit" element={<AuthRoute><ProfileEditPage /></AuthRoute>} />
          <Route path="/messages" element={<AuthRoute><MessagesPage /></AuthRoute>} />
          <Route path="/messages/:conversationId" element={<AuthRoute><MessagesPage /></AuthRoute>} />
          
          <Route path="/" element={<Navigate to="/gallery" replace />} />
          <Route path="*" element={<Navigate to="/gallery" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
