import { useNavigate, useParams } from "react-router"; // Fix the import
import { useAuth } from "../contexts/AuthContext"
import { useCallback, useEffect, useRef, useState } from "react";
import Container from "../components/ui/Container";
import { FormInput } from "../components/ui/FormInput";
import { TextArea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import { ProfileController } from "../services/controllers/ProfileController";
import api from "../services/api";
import { OldErrorMessage } from "../components/ui/ErrorMessage";
import { FileSelect } from "../components/ui/FileSelect";
import Seperator from "../components/ui/Seperator";
import ButtonLink from "../components/ui/ButtonLink";
import { ChevronLeft } from "lucide-react";
import Nav from "../components/ui/Nav";
import Header from "../components/ui/Header";
import Avatar from "../components/ui/Avatar";
import type { Profile } from "../services/types";

export default function ProfileEditPage() {
    const { id } = useParams();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const updateProfile = useCallback(async () => {
        const profileController = new ProfileController(api);
        const profileData = await profileController.getProfile(parseInt(id!));
        setProfile(profileData);
    }, [id]);

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const profileController = new ProfileController(api);
            await profileController.updateProfile(parseInt(id!), {
                displayName: profile!.displayName,
                description: profile!.description,
            });
            updateProfile();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Неизвестная ошибка');
            }
        } finally {
            setLoading(false);
        }
    };

    const submitAvatarHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!fileInputRef.current?.files || fileInputRef.current?.files.length === 0) {
            setError('Выберите файл');
            return;
        }
        setLoading(true);
        try {
            const profileController = new ProfileController(api);
            await profileController.postAvatar(parseInt(id!), fileInputRef.current?.files![0]);
            updateProfile();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Неизвестная ошибка');
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteAvatarHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const profileController = new ProfileController(api);
            await profileController.deleteAvatar(parseInt(id!));
            updateProfile();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Неизвестная ошибка');
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            if (!id) {
                setError('Профиль не найден');
                return;
            }
            try {
                updateProfile();
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Неизвестная ошибка');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (auth.me?.profileId != id) {
        navigate('/profile/' + auth.me?.profileId);
    }
    if (!profile) {
        return <div className="flex items-center justify-center min-h-screen">Загрузка...</div>;
    }
    return (
        <>
            <Nav />
            <div className='min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425] w-full flex flex-col items-center'>
                <div className="w-max-container w-full py-5">
                    <Container className="space-y-4 flex flex-col items-stretch">
                        <div className="flex items-center justify-between">
                            <Header 
                                title="Редактирование профиля" 
                                actions={
                                    <ButtonLink variant="outline" href={'/profile/' + id} className="flex items-center">
                                        <ChevronLeft className="mr-2" size={16} />
                                        <span>Назад</span>
                                    </ButtonLink>
                                }
                            />
                        </div>
                        <Seperator/>
                        {error && <OldErrorMessage message={error}/>}
                        <form className='space-y-4 flex flex-col' onSubmit={submitHandler}>
                            <FormInput 
                                required 
                                id="displayName" 
                                label="Выводимая имя" 
                                disabled={loading} 
                                value={profile.displayName} 
                                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                                className="primary"
                            />
                            <TextArea 
                                id="description" 
                                label="Описание" 
                                className="outline"
                                disabled={loading} 
                                value={profile.description}
                                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                            />
                            <Button 
                                isLoading={loading} 
                                disabled={loading}
                                className="primary"
                            >
                                Сохранить
                            </Button>
                        </form>
                        <Seperator/>
                        <form className='space-y-2 flex flex-col' onSubmit={submitAvatarHandler}>
                            <div>
                                <h3 className="text-lg mb-3">Аватар</h3>
                                <div className="flex items-center mb-4">
                                    <Avatar profile={profile} size={64} />
                                </div>
                            </div>
                            <FileSelect 
                                ref={fileInputRef} 
                                id="avatar" 
                                label="Выберите изображение" 
                                disabled={loading} 
                                className="white"
                            />
                            <div className="flex gap-3">
                                <Button 
                                    type="button"
                                    isLoading={loading} 
                                    disabled={loading || profile.avatar == null}
                                    variant="outline"
                                    onClick={deleteAvatarHandler}
                                >
                                    Удалить
                                </Button>
                                <Button 
                                    type="submit"
                                    isLoading={loading} 
                                    disabled={loading} 
                                    className="primary hover:accept text-white flex-1"
                                >
                                    Загрузить
                                </Button>
                            </div>
                        </form>
                    </Container>
                </div>
            </div>
        </>
    );
}
