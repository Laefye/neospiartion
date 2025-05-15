import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import apiClient from '../../api/client';
import { generateCodeVerifier, generateState } from '../../utils/authUtils';
import VKIcon from '../assets/vk-icon.svg';

export const VKAuthButton = () => {
    const [loading, setLoading] = useState(false);

    const handleVKAuth = async () => {
        try {
            setLoading(true);
      
            const codeVerifier = generateCodeVerifier();
            const state = generateState();
      
            const { data: authUrl } = await apiClient.get('/Vk/authorizationUrl', {
                params: { codeVerifier, state }
            });

            sessionStorage.setItem('vk_code_verifier', codeVerifier);
            sessionStorage.setItem('vk_state', state);
            window.location.href = authUrl;
        } 
        catch (error) 
        {
            console.error('Ошибка авторизации:', error);
        } 
        finally 
        {
            setLoading(false);
        }
    };

  return (
        <Button
        variant="contained"
        color="primary"
        onClick={handleVKAuth}
        disabled={loading}
        startIcon={
            loading ? <CircularProgress size={20} /> : <img src={VKIcon} alt="VK" style={{ height: 24 }} />
        }
        >
        {loading ? 'Авторизация...' : 'Войти через ВКонтакте'}
        </Button>
    );
};