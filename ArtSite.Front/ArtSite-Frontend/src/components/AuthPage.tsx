// src/components/AuthPage.tsx
import { useState } from 'react';
import { VKAuthButton } from '../components/VK/VKAuthButton';
import apiClient from '../api/client';

export const AuthPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try 
        {
            const response = await apiClient.post('/api/user/authentication', { email, password });
            localStorage.setItem('token', response.data.token);
        }
        catch 
        {
            setError('Неверные учетные данные');
        }
    };

    return (
        <div className="auth-container">
        <div className="auth-form">
            <VKAuthButton 
                onClick={handleVKAuth}
                loading={vkLoading}
                icon={<VKLogo1 />}
                text="Войти через ВКонтакте"
                />
            <VKAuthButton />

            <div className="separator">или</div>

            <form onSubmit={handleSubmit}>
            <InputField
                type="email"
                icon={<EmailFieldSVG />}
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                validate={validateEmail}
            />

            <InputField
                type="password"
                icon={<PasswordFieldSVG />}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                validate={validatePassword}
            />

            <SubmitButton
                icon={<ButtonSVG />}
                text="Войти"
                loading={formLoading}
                disabled={!isFormValid}
            />

            {error && (
                <ErrorBox type="form"><AlertIcon />{error}</ErrorBox>
            )}
            </form>
            <form onSubmit={handleSubmit}>
            <div className="input-field">
                <img src="/email-field.svg" alt="Email" />
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="input-field">
                <img src="/password-field.svg" alt="Пароль" />
                <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="main-button">
                <img src="/button.svg" alt="Войти" />
            </button>
            </form>
        </div>
        </div>
    );
};

const validateEmail = (value: string) =>  /^\S+@\S+\.\S+$/.test(value) ? null : "Некорректный email";

const validatePassword = (value: string) => value.length >= 8 ? null : "Минимум 8 символов";

// const InputField = ({ icon, ...props }) => (
//   <div className="input-field">
//     <div className="icon-container">
//       {React.cloneElement(icon, {
//         className: "input-icon",
//         "aria-hidden": true
//       })}
//     </div>
//     <input {...props} />
//     {props.error && (
//       <span className="error-icon">
//         <AlertIcon />
//       </span>
//     )}
//   </div>
// );