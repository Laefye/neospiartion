import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { MessageController } from '../services/controllers/MessageController';
import { ProfileController } from '../services/controllers/ProfileController';
import api from '../services/api';
import type { Profile, Conversation, Message } from '../services/types';
import { useAuth } from '../contexts/AuthContext';
import Nav from '../components/ui/Nav';
import { Send, MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import Header from '../components/ui/Header';

export default function MessagesPage() {
    const { conversationId } = useParams<{ conversationId: string }>();
    const navigate = useNavigate();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const messageContainerRef = useRef<HTMLDivElement | null>(null);
    const messageController = new MessageController(api);
    const profileController = new ProfileController(api);

    useEffect(() => {
        if (!auth.me?.profileId) return;
        
        const loadConversations = async () => {
            try {
                const fetchedConversations = await messageController.getConversations(auth.me!.profileId!);
                setConversations(fetchedConversations);
                setLoading(false);
            } catch {
                setError('Не удалось загрузить диалоги');
                setLoading(false);
            }
        };
        
        loadConversations();
    }, [auth.me]);

    useEffect(() => {
        const loadConversation = async () => {
            if (!conversationId || !auth.me?.profileId) return;
            
            try {
                const otherProfileId = parseInt(conversationId);
                const profile = await profileController.getProfile(otherProfileId);
                setSelectedProfile(profile);

                const messages = await messageController.getMessages(auth.me.profileId!, otherProfileId);
                setMessages(messages);

                await messageController.markAsRead(auth.me.profileId!, otherProfileId);

                let conversation = conversations.find(c => 
                    c.participants.some(p => p.id === otherProfileId)
                );

                if (!conversation) {
                    conversation = await messageController.getOrCreateConversation(auth.me.profileId!, otherProfileId);
                }
                
                setSelectedConversation(conversation);
                
            } catch (err) {
                console.error("Error loading conversation:", err);
                setError('Не удалось загрузить сообщения');
            }
        };
        
        loadConversation();
    }, [conversationId, conversations, auth.me]);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !auth.me?.profileId || !selectedProfile) return;
        
        setSending(true);
        try {
            const message = await messageController.sendMessage(
                auth.me.profileId, 
                selectedProfile.id, 
                newMessage
            );
            
            setMessages(prev => [...prev, message]);
            setNewMessage('');
            
            const updatedConversations = await messageController.getConversations(auth.me.profileId);
            setConversations(updatedConversations);
        } catch {
            setError('Не удалось отправить сообщение');
        } finally {
            setSending(false);
        }
    };

    const formatMessageTime = (date: Date) => {
        return 'test'
    };

    if (!auth.me) {
        navigate('/login');
        return null;
    }

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425] w-full flex flex-col items-center py-6">
                <div className="max-w-7xl w-full mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
                    <Header 
                        title="Сообщения" 
                        className="px-4 pt-6 pb-2"
                    />
                    <div className="flex h-[calc(80vh-100px)]">
                        <div className="w-1/3 border-r border-gray-200 bg-white">
                            <div className="overflow-y-auto h-[calc(80vh-152px)]">
                                <div className="p-4 border-b border-gray-200">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Поиск диалогов..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-y-auto h-[calc(80vh-152px)]">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <p>Загрузка...</p>
                                    </div>
                                ) : error ? (
                                    <div className="p-4 text-red-500">{error}</div>
                                ) : conversations.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4 text-center">
                                        <MessageSquare size={48} className="mb-2 opacity-50" />
                                        <p>У вас пока нет сообщений</p>
                                        <p className="text-sm mt-2">Начните общение с художниками на их страницах</p>
                                    </div>
                                ) : (
                                    conversations.map(conversation => {
                                        const otherParticipant = conversation.participants.find(
                                            p => p.id !== auth.me?.profileId
                                        );
                                        
                                        if (!otherParticipant) return null;
                                        
                                        return (
                                            <a
                                                key={otherParticipant.id}
                                                href={`/messages/${otherParticipant.id}`}
                                                className={`flex items-start p-4 border-b border-gray-200 hover:bg-purple-50 transition-colors ${
                                                    conversationId && parseInt(conversationId) === otherParticipant.id 
                                                        ? 'bg-purple-100' 
                                                        : ''
                                                }`}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-purple-200 flex-shrink-0 overflow-hidden">
                                                    {otherParticipant.avatar ? (
                                                        <img 
                                                            src={`/api/profiles/${otherParticipant.id}/avatar`} 
                                                            alt={otherParticipant.displayName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-purple-700 font-bold">
                                                            {otherParticipant.displayName.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-medium text-gray-900 truncate">
                                                            {otherParticipant.displayName}
                                                        </p>
                                                        {conversation.lastMessage && (
                                                            <span className="text-xs text-gray-500">
                                                                {formatMessageTime(conversation.lastMessage.createdAt)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {conversation.lastMessage?.text || 'Нет сообщений'}
                                                    </p>
                                                </div>
                                                {conversation.unreadCount > 0 && (
                                                    <div className="ml-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                        {conversation.unreadCount}
                                                    </div>
                                                )}
                                            </a>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        <div className="w-2/3 flex flex-col bg-gray-50">
                            {selectedProfile ? (
                                <>
                                    <div className="p-4 border-b border-gray-200 bg-white flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-purple-200 overflow-hidden">
                                            {selectedProfile.avatar ? (
                                                <img 
                                                    src={`/api/profiles/${selectedProfile.id}/avatar`} 
                                                    alt={selectedProfile.displayName}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-purple-700 font-bold">
                                                    {selectedProfile.displayName.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium text-gray-900">{selectedProfile.displayName}</p>
                                            {selectedConversation && (
                                                <p className="text-xs text-gray-500">
                                                    {selectedConversation.unreadCount > 0 ? 
                                                        `${selectedConversation.unreadCount} непрочитанных` : 
                                                        'Все прочитано'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div 
                                        ref={messageContainerRef}
                                        className="flex-1 p-4 overflow-y-auto"
                                    >
                                        {messages.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                                <MessageSquare size={48} className="mb-2 opacity-50" />
                                                <p>Нет сообщений</p>
                                                <p className="text-sm mt-1">Начните общение прямо сейчас</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {messages.map(message => {
                                                    const isOwnMessage = message.senderId === auth.me?.profileId;
                                                    
                                                    return (
                                                        <div 
                                                            key={message.id}
                                                            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                                        >
                                                            <div 
                                                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                                                    isOwnMessage 
                                                                        ? 'bg-purple-600 text-white' 
                                                                        : 'bg-white border border-gray-200 text-gray-900'
                                                                }`}
                                                            >
                                                                <p>{message.text}</p>
                                                                <p className={`text-xs mt-1 text-right ${
                                                                    isOwnMessage ? 'text-purple-200' : 'text-gray-500'
                                                                }`}>
                                                                    {formatMessageTime(message.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div ref={messageEndRef} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 border-t border-gray-200 bg-white">
                                        <form onSubmit={handleSendMessage} className="flex items-end">
                                            <div className="flex-1">
                                                <textarea
                                                    value={newMessage}
                                                    onChange={e => setNewMessage(e.target.value)}
                                                    placeholder="Введите сообщение..."
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                                    rows={1}
                                                    disabled={sending}
                                                />
                                            </div>
                                            <Button 
                                                type="submit"
                                                variant="primary"
                                                className="ml-2"
                                                disabled={!newMessage.trim() || sending}
                                            >
                                                <Send size={18} />
                                            </Button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4">
                                        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">Выберите диалог</h3>
                                        <p className="text-gray-500 text-sm">История ваших переписок будет отображаться здесь</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
