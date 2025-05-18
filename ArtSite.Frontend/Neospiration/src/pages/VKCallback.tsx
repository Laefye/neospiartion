import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router';
import api from '../services/api';
import tokenService from '../services/token/TokenStorage';
import { OldErrorMessage } from '../components/ui/ErrorMessage'
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export default function VKCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleVkCallback = async () => {
      try {
        const code = searchParams.get('code');
        if (!code) {
          throw new Error('Код авторизации не найден');
        }
        
        const response = await api.get('/Vk/authenticate', {
          params: { code }
        });

        tokenService.setToken(response.data.accessToken);
        window.location.href = '/';
      } 
      catch (err: any) {
        console.error('VK auth error:', err);
        setError(err.message || 'Произошла ошибка при авторизации через ВКонтакте');
      } 
      finally {
        setLoading(false);
      }
    };
    
    handleVkCallback();
  }, [searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <OldErrorMessage message={error} redirectTo="/login" buttonText="Вернуться на страницу входа" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="mt-4 text-white">Завершение авторизации...</p>
      </div>
    );
  }
  return <Navigate to="/" />;
}