import { useState, useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { ArtController } from '../../services/ArtController';
import api from '../../services/api';
import { FileSelect } from './FileSelect';
import Container from './Container';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileController } from '../../services/ProfileController';

interface ArtPublishModalProps {
    profileId: number;
    onPublished: () => Promise<void>;
}

export default function ArtPublishModal({ profileId, onPublished }: ArtPublishModalProps) {
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    const [postDescription, setPostDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileInputRef.current?.files?.length) {
            setError('Пожалуйста, выберите файл для загрузки');
            return;
        }
        setUploading(true);
        setError(null);
        try {
            const artController = new ArtController(api);
            const profileController = new ProfileController(api);
            const art = await profileController.postArt(
                profileId, 
                { 
                    description: postDescription,
                    tierId: null,
                }
            );
            
            await artController.uploadPicture(
                art.id,
                fileInputRef.current.files[0]
            );
            
            setPostDescription('');
            setShowCreatePostForm(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ошибка при создании поста');
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full flex justify-center mb-4">
            {!showCreatePostForm ? (
                <button
                    onClick={() => setShowCreatePostForm(true)}
                    className="w-full bg-[#1E1E1E] hover:bg-opacity-90 text-white py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Создать пост</span>
                </button>
            ) : (
                <Container className='space-y-4'>
                    <h3 className="text-lg font-medium">Создать новый пост</h3>
                    {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
                    
                    <form onSubmit={handleCreatePost} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="postDescription" className="block text-sm font-medium">
                                Описание
                            </label>
                            <textarea
                                id="postDescription"
                                value={postDescription}
                                onChange={(e) => setPostDescription(e.target.value)}
                                disabled={uploading}
                                placeholder="Расскажите о вашей работе..."
                                className="w-full p-2 border border-gray-300 rounded-md h-24"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="artFile" className="block text-sm font-medium">
                                Изображение
                            </label>
                            <input
                                id="artFile"
                                type="file"
                                ref={fileInputRef}
                                disabled={uploading}
                                accept="image/*"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        
                        <div className="flex gap-3">
                            <button 
                                type="submit"
                                disabled={uploading}
                                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                            >
                                {uploading ? 'Загрузка...' : 'Опубликовать'}
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setShowCreatePostForm(false)}
                                disabled={uploading}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </Container>
            )}
        </div>
    );
}