import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import ErrorMessage from '../components/ui/ErrorMessage';
import api from '../services/api';
import { UserController } from '../services/controllers/UserController';
import ButtonLink from '../components/ui/ButtonLink';
import { InvalidRegistrationDataException } from '../services/interfaces/IUserController';
import Header from '../components/ui/Header';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorList, setErrorList] = useState<string[] | null>(null);
  const [isCreated, setIsCreated] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorList(null);
    if (!email || !password || !username || !displayName) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    const userController = new UserController(api);
    try {
      await userController.register({
        email,
        password,
        userName: username,
        displayName,
      });
    } catch (error) {
      if (error instanceof InvalidRegistrationDataException) {
        setErrorList(error.errors);
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Неизвестная ошибка');
      }
      setLoading(false);
      return;
    }
    setLoading(false);
    setIsCreated(true);
  };

  if (isCreated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-6 sm:py-12 bg-gradient-to-b from-[#320425] to-[#25022A]">
        <div className="w-full max-w-md space-y-8 px-4 sm:px-0 bg-white/10 p-6 rounded-lg">
          <h1 className="text-center text-3xl font-bold text-white">
            Аккаунт успешно создан
          </h1>
          <p className="text-center text-gray-300">
            Теперь вы можете войти в свой аккаунт.
          </p>
          <ButtonLink href='/login' className="w-full">Войти</ButtonLink>
        </div>
      </div>
    );
  }

  return (
  <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-6 sm:py-12 bg-gradient-to-b from-[#320425] to-[#25022A]">
    <div className="w-full max-w-md space-y-8 px-4 sm:px-0">
      <Header
        title="Создание аккаунта"
        className="text-center"
      />
        
        {error && <ErrorMessage><p>{error}</p>{errorList && <ul className='list-disc ps-3'>{errorList.map((x, i) => <li key={i}>{x}</li>)}</ul>}</ErrorMessage>}
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
              className="w-full p-3 border-transparent focus:border-purple-500 focus:ring-0 rounded-md"
            />
            <FormInput
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-transparent focus:border-purple-500 focus:ring-0 rounded-md"
              placeholder="Пароль"
            />
            <FormInput
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 border-transparent focus:border-purple-500 focus:ring-0 rounded-md"
              placeholder="Подтверждение пароля"/>
            <FormInput
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 border-transparent focus:border-purple-500 focus:ring-0 rounded-md"
              placeholder="Никнейм"
            />
            <FormInput
              type="text"
              id="displayName"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full p-3 border-transparent focus:border-purple-500 focus:ring-0 rounded-md"
              placeholder="Отображаемое имя"
            />

            <Button
              type="submit"
              isLoading={loading}
              className="w-full bg-purple-800 hover:bg-purple-700 text-white py-3">
              {loading ? 'Загрузка...' : 'Продолжить'}
            </Button>
            
            <div className="flex justify-center text-sm text-gray-300">
              <span>Уже есть аккаунт? </span>
              <Link to="/login" className="ml-1 text-purple-300 hover:text-purple-200">
                Войти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}