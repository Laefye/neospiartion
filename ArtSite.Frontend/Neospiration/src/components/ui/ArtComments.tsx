import { useState, useEffect } from 'react';
import { CommentController } from '../../services/controllers/CommentController';
import { ProfileController } from '../../services/controllers/ProfileController';
import api from '../../services/api';
import type { Comment, Profile } from '../../services/types';
import Button from './Button';
import Avatar from './Avatar';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAuth } from '../../contexts/AuthContext';

interface ArtCommentsProps {
    artId: number;
    onCommentCountChange?: (count: number) => void;
}

function ArtComments({ artId, onCommentCountChange }: ArtCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingComment, setEditingComment] = useState<{ id: number, text: string } | null>(null);
    const [profiles, setProfiles] = useState<Record<number, Profile>>({});
    
    const auth = useAuth();
    const commentController = new CommentController(api);
    const profileController = new ProfileController(api);

    const fetchProfiles = async (comments: Comment[]) => {
        const profileIds = Array.from(new Set(comments.map(comment => comment.profileId)));
        const profilePromises = profileIds.map(id => 
            profileController.getProfile(id)
                .then(profile => ({ id, profile }))
                .catch(() => ({ id, profile: null }))
        );
        
        const profileResults = await Promise.all(profilePromises);
        const profileMap: Record<number, Profile> = {};
        
        profileResults.forEach(({ id, profile }) => {
            if (profile) profileMap[id] = profile;
        });
        
        setProfiles(profileMap);
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const fetchedComments = await commentController.getComments(artId);
                setComments(fetchedComments);
                if (onCommentCountChange) {
                    onCommentCountChange(fetchedComments.length);
                }
                await fetchProfiles(fetchedComments);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Не удалось загрузить комментарии');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [artId, commentController]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !auth.me) return;
        
        try {
            const comment = await commentController.addComment(artId, newComment);
            const updatedComments = [comment, ...comments];
            setComments(updatedComments);
            setNewComment('');
            
            if (onCommentCountChange) {
                onCommentCountChange(updatedComments.length);
            }
            
            if (!profiles[comment.profileId]) {
                try {
                    const profile = await profileController.getProfile(comment.profileId);
                    setProfiles(prev => ({...prev, [comment.profileId]: profile}));
                } catch {
                    console.error("Could not load profile for new comment");
                }
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Не удалось добавить комментарий');
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await commentController.deleteComment(commentId);
            const updatedComments = comments.filter(comment => comment.id !== commentId);
            setComments(updatedComments);
            
            if (onCommentCountChange) {
                onCommentCountChange(updatedComments.length);
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Не удалось удалить комментарий');
            }
        }
    };

    const startEditing = (comment: Comment) => {
        setEditingComment({ id: comment.id, text: comment.text });
    };

    const cancelEditing = () => {
        setEditingComment(null);
    };

    const handleUpdateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingComment) return;
        
        try {
            const updatedComment = await commentController.updateComment(
                editingComment.id, 
                editingComment.text
            );
            setComments(prev => prev.map(comment => 
                comment.id === editingComment.id ? updatedComment : comment
            ));
            setEditingComment(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Не удалось обновить комментарий');
            }
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-medium">Комментарии</h3>
            {error && (
                <p className="text-red-500 mt-2">{error}</p>
            )}
            
            {auth.me && (
                <form onSubmit={handleAddComment} className="mt-4">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        className="w-full p-2 border rounded-md"
                        placeholder="Добавьте ваш комментарий..."
                        rows={3}
                    />
                    <Button
                        type="submit"
                        disabled={!newComment.trim()}
                        className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
                    >
                        Отправить
                    </Button>
                </form>
            )}
            
            {loading ? (
                <div className="py-4 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : comments.length > 0 ? (
                <ul className="mt-6 space-y-4">
                    {comments.map(comment => (
                        <li key={comment.id} className="p-4 bg-white rounded-md shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Avatar 
                                        src={profiles[comment.profileId]?.avatar ? 
                                            `/api/profiles/${comment.profileId}/avatar` : undefined
                                        }
                                        alt={profiles[comment.profileId]?.displayName || `User #${comment.profileId}`}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span className="font-medium">
                                        {profiles[comment.profileId]?.displayName || `Пользователь #${comment.profileId}`}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(comment.uploadedAt), { addSuffix: true, locale: ru })}
                                </span>
                            </div>
                            
                            {editingComment && editingComment.id === comment.id ? (
                                <form onSubmit={handleUpdateComment} className="mt-2">
                                    <textarea
                                        value={editingComment.text}
                                        onChange={e => setEditingComment({ 
                                            ...editingComment, 
                                            text: e.target.value 
                                        })}
                                        className="w-full p-2 border rounded-md"
                                        rows={3}
                                    />
                                    <div className="flex space-x-2 mt-2">
                                        <Button
                                            type="submit"
                                            disabled={!editingComment.text.trim()}
                                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            onClick={cancelEditing}
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
                                        >
                                            Отмена
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="mt-2">{comment.text}</p>
                                    {auth.me && auth.me.profileId === comment.profileId && (
                                        <div className="mt-2 flex space-x-3">
                                            <Button
                                                onClick={() => startEditing(comment)}
                                                className="text-sm py-1 px-2 text-blue-600 hover:text-blue-800"
                                            >
                                                Редактировать
                                            </Button>
                                            <Button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-sm py-1 px-2 text-red-500 hover:text-red-700"
                                            >
                                                Удалить
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-gray-500">Нет комментариев. Будьте первым!</p>
            )}
        </div>
    );
}

export default ArtComments;
