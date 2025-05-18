import { use, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import api from '../services/api';
import { UserController } from '../services/UserController';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    let userController = new UserController(api);
    try {
      await userController.register({
        email,
        password,
        userName: username,
        displayName,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Неизвестная ошибка');
      }
      setLoading(false);
      return;
    }
    alert('Вы успешно зарегистрировались! Теперь вы можете войти в свой аккаунт.');
    setLoading(false);
    navigate('/login');
  };

  return (
  <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-6 sm:py-12">
    <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
      <h1 className="text-center text-3xl font-bold text-art-text-primary">
        Создание аккаунта
      </h1>
      
      {error && <ErrorMessage message={error} />}
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="E-Mail"
          />
          <FormInput
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Пароль"
          />
          <FormInput
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Подтверждение пароля"/>
          <FormInput
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Никнейм"
          />
          <FormInput
            type="text"
            id="displayName"
            name="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="Отображаемое имя"
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