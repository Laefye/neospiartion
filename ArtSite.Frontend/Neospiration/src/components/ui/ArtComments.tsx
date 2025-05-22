import { useState, useEffect } from 'react';
import { CommentController } from '../../services/CommentController';
import api from '../../services/api';
import type { Comment } from '../../services/types';
import Button from './Button';

function ArtComments({ artId }: { artId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editingComment, setEditingComment] = useState<{ id: number, text: string } | null>(null);

    const commentController = new CommentController(api);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const comments = await commentController.getComments(artId);
                setComments(comments);
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
    }, [artId]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        
        try {
            const comment = await commentController.addComment(artId, newComment);
            setComments(prev => [comment, ...prev]);
            setNewComment('');
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
            setComments(prev => prev.filter(comment => comment.id !== commentId));
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
        <div className="mt-6">
            <h3 className="text-lg font-medium">Комментарии</h3>
            {error && (
                <p className="text-red-500 mt-2">{error}</p>
            )}
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
                    variant="primary"
                    className="mt-2"
                >
                    Отправить
                </Button>
            </form>
            
            {loading ? (
                <p className="mt-4">Загрузка комментариев...</p>
            ) : comments.length > 0 ? (
                <ul className="mt-6 space-y-4">
                    {comments.map(comment => (
                        <li key={comment.id} className="p-4 bg-gray-50 rounded-md">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Профиль #{comment.profileId}</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(comment.uploadedAt).toLocaleString()}
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
                                            variant="primary"
                                            className="flex-1"
                                        >
                                            Сохранить
                                        </Button>
                                        <Button
                                            onClick={cancelEditing}
                                            variant="secondary"
                                            className="flex-1"
                                        >
                                            Отмена
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <p className="mt-2">{comment.text}</p>
                                    <div className="mt-2 flex space-x-3">
                                        <Button
                                            onClick={() => startEditing(comment)}
                                            className="text-sm py-1 px-2"
                                        >
                                            Редактировать
                                        </Button>
                                        <Button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-sm text-red-500"
                                        >
                                            Удалить
                                        </Button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4">Нет комментариев</p>
            )}
        </div>
    );
}

export default ArtComments;
