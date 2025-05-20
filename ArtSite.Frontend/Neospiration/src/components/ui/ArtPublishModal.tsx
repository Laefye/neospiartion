import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { ArtController } from '../../services/ArtController';
import api from '../../services/api';

interface ArtPublishModalProps {
    open: boolean;
    onClose: () => void;
    profileId: number;
    onPublished: () => Promise<void>;
}

export default function ArtPublishModal({ open, onClose, profileId, onPublished }: ArtPublishModalProps) {
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileInputRef.current?.files?.length) {
            setError('Выберите изображение');
            return;
        }
        setUploading(true);
        setError(null);
        try {
            const artController = new ArtController(api);
            const art = await artController.createArt(profileId, description);
            await artController.uploadPicture(art.id, fileInputRef.current.files[0]);
            // Reset form
            setDescription('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            // Notify parent to refresh the arts list
            await onPublished();
        } catch (err: any) {
            setError(err.message || 'Ошибка публикации');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Публикация нового арта</h2>
                    <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium">
                            Описание
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            rows={4}
                            placeholder="Расскажите о вашей работе..."
                            disabled={uploading}
                        />
                    </div>
                    <div>
                        <label htmlFor="artFile" className="block text-sm font-medium">
                            Изображение
                        </label>
                        <input
                            id="artFile"
                            type="file"
                            ref={fileInputRef}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            accept="image/*"
                            disabled={uploading}
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={uploading}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                        >
                            {uploading ? 'Загрузка...' : 'Опубликовать'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}