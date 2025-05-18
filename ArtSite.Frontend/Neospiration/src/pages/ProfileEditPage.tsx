import { useNavigate, useParams } from "react-router";
import { useAuth } from "../contexts/AuthContext"
import { useEffect, useRef, useState } from "react";
import Container from "../components/ui/Container";
import { FormInput } from "../components/ui/FormInput";
import { TextArea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import { ProfileController } from "../services/ProfileController";
import api from "../services/api";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { FileSelect } from "../components/ui/FileSelect";
import Seperator from "../components/ui/Seperator";
import ButtonLink from "../components/ui/ButtonLink";
import { ChevronLeft } from "lucide-react";

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
        <div className='w-full flex flex-col items-center'>
            <div className="w-max-container w-full py-5">
                <Container className="space-y-2.5">
                    <div className="flex items-center justify-end">
                        <ButtonLink variant="outline" href={'/profile/' + id} className="w-min">
                            <ChevronLeft className="me-2" />
                            <span>Назад</span>
                        </ButtonLink>
                    </div>
                    <Seperator/>
                    {error && <ErrorMessage message={error} />}
                    <form className='space-y-2.5 flex flex-col' onSubmit={submitHandler}>
                        <FormInput required id="displayName" label="Выводимая имя" disabled={loading} value={displayName} onChange={(e) => setDisplayName(e.target.value)}/>
                        <TextArea id="description" label="Описание" className="h-32" disabled={loading} value={description} onChange={(e) => setDescription(e.target.value)}/>
                        <Button isLoading={loading} disabled={loading}>Сохранить</Button>
                    </form>
                    <Seperator/>
                    <form className='space-y-2.5 flex flex-col' onSubmit={submitAvatarHandler}>
                        {avatarUrl && (
                            <img
                                src={avatarUrl}
                                alt={displayName}
                                className='w-16 h-16 rounded-full'
                            />
                        )}
                        {!avatarUrl && (
                            <div className='w-16 h-16 rounded-full bg-gray-200'></div>
                        )}
                        <FileSelect ref={fileInputRef} id="avatar" label="Аватар" disabled={loading} onChange={(e) => console.log(e.target.files)} />
                        <Button isLoading={loading} disabled={loading}>Загрузить</Button>
                        <Button isLoading={loading} disabled={loading || avatarUrl == null} onClick={deleteAvatarHandler}>Удалить</Button>
                    </form>
                </Container>
            </div>
        </div>
    )
}