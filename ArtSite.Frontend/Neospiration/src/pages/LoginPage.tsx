import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { Divider } from '../components/ui/Divider';
import api from '../services/api';
import { UserController } from '../services/UserController';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setLoading(true);
    let userController = new UserController(api);
    try {
      let token = await userController.authenticate({ email, password });
      api.tokenStorage.setToken(token.accessToken);
      let me = await userController.me();
      navigate('/profile/' + me.profileId);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Неизвестная ошибка');
      }
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-6 sm:py-12">
    <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
      <h1 className="text-center text-3xl font-bold text-art-text-primary">
        Войдите или зарегистрируйтесь
      </h1>
      
      {error && <ErrorMessage message={error} />}
      <div className="space-y-6">
        <Button
        variant="white" 
        className='w-full'
        disabled={loading}>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">\
          <path d="M0 23.04C0 12.1788 0 6.74826 3.37413 3.37413C6.74826 0 12.1788 0 23.04 0H24.96C35.8212 0 41.2517 0 44.6259 3.37413C48 6.74826 48 12.1788 48 23.04V24.96C48 35.8212 48 41.2517 44.6259 44.6259C41.2517 48 35.8212 48 24.96 48H23.04C12.1788 48 6.74826 48 3.37413 44.6259C0 41.2517 0 35.8212 0 24.96V23.04Z" fill="#0077FF"/>
          <path d="M25.54 34.5801C14.6 34.5801 8.3601 27.0801 8.1001 14.6001H13.5801C13.7601 23.7601 17.8 27.6401 21 28.4401V14.6001H26.1602V22.5001C29.3202 22.1601 32.6398 18.5601 33.7598 14.6001H38.9199C38.0599 19.4801 34.4599 23.0801 31.8999 24.5601C34.4599 25.7601 38.5601 28.9001 40.1201 34.5801H34.4399C33.2199 30.7801 30.1802 27.8401 26.1602 27.4401V34.5801H25.54Z" fill="white"/>
          </svg>
          Вход через аккаунт VK
        </Button>
        <Divider text="или"/>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E-Mail"
            variant='white'
          />
          <FormInput
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            variant='white'
          />
          
          <Button
          type="submit"
          isLoading={loading}
          className="w-full">
            {loading ? 'Загрузка...' : 'Продолжить'}
          </Button>
          
          <div className="flex justify-center text-sm text-gray-300">
            <span>Нет аккаунта? </span>
            <Link to="/register" className="ml-1 text-purple-300 hover:text-purple-200">
              Создайте новый аккаунта
            </Link>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
}