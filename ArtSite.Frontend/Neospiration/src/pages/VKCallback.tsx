// filepath: c:\Users\User\Desktop\Art's\BMSTU\4 term\IT\hudozhniki\ArtSite.Frontend\Neospiration\src\pages\VKCallback.tsx
import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

export default function VKCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleVkCallback = async () => {
      try {
        // Get the code from the URL
        const code = searchParams.get('code');
        
        if (!code) {
          throw new Error('Код авторизации не найден');
        }
        
        // Exchange the code for a token
        const response = await api.get('/Vk/authenticate', {
          params: { code }
        });
        
        // Store the token
        localStorage.setItem('token', response.data.accessToken);
        
        // Redirect to home page
        window.location.href = '/';
        
      } catch (err: any) {
        console.error('VK auth error:', err);
        setError(err.message || 'Произошла ошибка при авторизации через ВКонтакте');
      } finally {
        setLoading(false);
      }
    };

    handleVkCallback();
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-400/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg max-w-md">
          <p className="font-bold">Ошибка авторизации</p>
          <p>{error}</p>
          <div className="mt-4">
            <a 
              href="/login" 
              className="block w-full text-center py-2 px-4 bg-white hover:bg-gray-100 text-[#6c2769] border border-[#6c2769] rounded-lg"
            >
              Вернуться на страницу входа
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-white">Завершение авторизации...</p>
      </div>
    );
  }

  return <Navigate to="/" />;
}