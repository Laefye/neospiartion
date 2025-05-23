import { useNavigate, useParams } from "react-router"; // Fix the import
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useRef, useState } from "react";
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

export default function ProfileEditPage() {
    const { id } = useParams();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const profileController = new ProfileController(api);
            await profileController.updateProfile(parseInt(id!), {
                description,
                displayName
            });
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
            const avatarUrl = await profileController.getAvatarUrl(parseInt(id!));
            setAvatarUrl(avatarUrl);
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
            setAvatarUrl(null);
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
            const profileController = new ProfileController(api);
            try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                const profile = await profileController.getProfile(auth.me?.profileId!);
                setDisplayName(profile.displayName);
                setDescription(profile.description);
                if (profile.avatar) {
                    const avatarUrl = await profileController.getAvatarUrl(profile.id);
                    setAvatarUrl(avatarUrl);
                }
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
                                value={displayName} 
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="primary"
                            />
                            <TextArea 
                                id="description" 
                                label="Описание" 
                                className="outline"
                                disabled={loading} 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
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
                        <form className='space-y-4 flex flex-col' onSubmit={submitAvatarHandler}>
                            <div>
                                <h3 className="text-white text-lg mb-3">Аватар</h3>
                                <div className="flex items-center mb-4">
                                    {avatarUrl ? (
                                        <img
                                            src={avatarUrl}
                                            alt={displayName}
                                            className='ghost w-45 h-45'
                                        />
                                    ) : (
                                        <div className='w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center'>
                                            <span className="text-gray-500 text-lg font-bold">
                                                {displayName ? displayName[0].toUpperCase() : "?"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <FileSelect 
                                ref={fileInputRef} 
                                id="avatar" 
                                label="Выберите изображение" 
                                disabled={loading} 
                                onChange={(e) => console.log(e.target.files)} 
                                className="white"
                            />
                            <div className="flex gap-3">
                                <Button 
                                    type="submit"
                                    isLoading={loading} 
                                    disabled={loading}
                                    variant="outline"
                                >
                                    Загрузить
                                </Button>
                                <Button 
                                    type="button"
                                    isLoading={loading} 
                                    disabled={loading || avatarUrl == null} 
                                    onClick={deleteAvatarHandler}
                                    className="primary hover:accept text-white flex-1"
                                >
                                    Удалить
                                </Button>
                            </div>
                        </form>
                    </Container>
                </div>
            </div>
        </>
    );
}
