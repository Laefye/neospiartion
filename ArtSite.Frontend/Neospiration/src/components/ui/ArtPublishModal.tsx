import { useState, useRef, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { ArtController } from '../../services/controllers/ArtController';
import { ProfileController } from '../../services/controllers/ProfileController';
import api from '../../services/api';
import Button from './Button';
import Container from './Container';

interface ArtPublishModalProps {
    profileId: number;
    onPublished: () => Promise<void>;
}

export default function ArtPublishModal({ profileId, onPublished }: ArtPublishModalProps) {
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showCreatePostForm, setShowCreatePostForm] = useState(false);
    const [showBlurOverlay, setShowBlurOverlay] = useState(false);
    const [animateModal, setAnimateModal] = useState(false);
    const [postDescription, setPostDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const blurOverlayRef = useRef<HTMLDivElement>(null);
    
    const openModal = () => {
        setShowBlurOverlay(true);
        
        setTimeout(() => {
            setShowCreatePostForm(true);
            requestAnimationFrame(() => {
                setAnimateModal(true);
            });
        }, 1000);
    };
    
    const closeModal = () => {
        if (uploading) return;
        setAnimateModal(false);
        setTimeout(() => {
            setShowCreatePostForm(false);
            setTimeout(() => {
                setShowBlurOverlay(false);
            }, 300);
        }, 500);
    };

    useEffect(() => {
        if (showBlurOverlay || showCreatePostForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showBlurOverlay, showCreatePostForm]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                if (!uploading) closeModal();
            }
        }

        if (showCreatePostForm) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCreatePostForm, uploading]);

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
            closeModal();
            if (fileInputRef.current) fileInputRef.current.value = '';
            onPublished();
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
        <Container>
            <Button
                onClick={openModal}
                className="w-full gap-2"
                variant="primary"
            >
                <Plus size={20} />
                <span>Создать пост</span>
            </Button>

            {showBlurOverlay && (
                <div 
                    ref={blurOverlayRef}
                    className="fixed inset-0 z-40"
                    style={{
                        backdropFilter: 'blur(8px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        opacity: showCreatePostForm ? 1 : 0,
                        transition: 'opacity 1s ease-in-out, backdrop-filter 1s ease-in-out',
                    }}
                />
            )}

            {showCreatePostForm && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center"
                >
                    <div 
                        ref={modalRef}
                        style={{
                            transform: animateModal ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                            opacity: animateModal ? 1 : 0,
                            transition: 'transform 0.7s ease-out, opacity 0.7s ease-out',
                        }}
                        className="bg-gradient-to-br from-[#320425] to-[#25022A] rounded-lg shadow-2xl w-full max-w-3xl p-8 mx-4"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-medium text-white">Создать новый пост</h3>
                            <Button
                                onClick={closeModal}
                                disabled={uploading}
                                variant="ghost"
                                className="text-gray-400 hover:text-white p-1 rounded-full"
                                aria-label="Close"
                            >
                                <X size={24} />
                            </Button>
                        </div>
                        
                        {error && <div className="p-4 mb-5 bg-art-error text-white rounded-md">{error}</div>}
                        
                        <form onSubmit={handleCreatePost} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="postDescription" className="block text-base font-medium text-white">
                                    Описание
                                </label>
                                <textarea
                                    id="postDescription"
                                    value={postDescription}
                                    onChange={(e) => setPostDescription(e.target.value)}
                                    disabled={uploading}
                                    placeholder="Расскажите о вашей работе..."
                                    className="w-full p-4 border border-purple-900/30 rounded-lg h-40 bg-purple-900/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="artFile" className="block text-base font-medium text-white">
                                    Изображение
                                </label>
                                <div className="relative">
                                    <input
                                        id="artFile"
                                        type="file"
                                        ref={fileInputRef}
                                        disabled={uploading}
                                        accept="image/*"
                                        className="w-full p-4 border border-purple-900/30 rounded-lg bg-purple-900/20 text-white file:mr-4 file:py-2.5 file:px-5 file:rounded-md file:border-0 file:text-sm file:bg-purple-700 file:text-white hover:file:bg-purple-600"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-4 justify-end pt-4">
                                <Button 
                                    type="button"
                                    onClick={closeModal}
                                    disabled={uploading}
                                    variant="outline"
                                    className="px-8 py-2.5 text-base"
                                >
                                    Отмена
                                </Button>
                                
                                <Button 
                                    type="submit"
                                    isLoading={uploading}
                                    variant="primary"
                                    className="px-8 py-2.5 text-base"
                                >
                                    Опубликовать
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Container>
    );
}
