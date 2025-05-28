import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router';
import { MessageController } from '../services/controllers/MessageController';
import { ProfileController } from '../services/controllers/ProfileController';
import { CommissionController } from '../services/controllers/CommissionController';
import api from '../services/api';
import type { Profile, Message, Conversation, Commission } from '../services/types';
import { useAuth } from '../contexts/AuthContext';
import Container from '../components/ui/Container';
import Nav from '../components/ui/Nav';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { Send } from 'lucide-react';
import { formatDate } from '../utils/formatDate';

export default function MessagesPage() {
    const { profileId } = useParams<{ profileId?: string }>();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [conversationProfiles, setConversationProfiles] = useState<Record<number, Profile>>({});
    const [messages, setMessages] = useState<Message[]>([]);
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [commissions, setCommissions] = useState<Record<number, Commission>>({});
    // const [messagesOffset, setMessagesOffset] = useState(0);
    // const [hasMoreMessages, setHasMoreMessages] = useState(true);
    // const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
    
    const messageController = useMemo(() => new MessageController(api), []);
    const profileController = useMemo(() => new ProfileController(api), []);
    const commissionController = useMemo(() => new CommissionController(api), []);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        const loadConversations = async () => {
            if (!auth.me?.profileId) return;
            
            try {
                setLoading(true);
                const userConversations = await profileController.getConversations(auth.me.profileId);
                setConversations(userConversations);
                
                const profilesData: Record<number, Profile> = {};
                await Promise.all(userConversations.map(async (conversation) => {
                    try {
                        const profile = await profileController.getProfile(conversation.profileId);
                        profilesData[conversation.profileId] = profile;
                    } catch (error) {
                        console.error(`Error loading profile ${conversation.profileId}:`, error);
                    }
                }));
                
                setConversationProfiles(profilesData);
                setLoading(false);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Не удалось загрузить диалоги');
                setLoading(false);
            }
        };
        
        loadConversations();
    }, [auth.me?.profileId, messageController, profileController]);
    
    useEffect(() => {
        const loadActiveConversation = async () => {
            if (!profileId || !auth.me?.profileId) return;
            
            try {
                setLoading(true);
                const targetProfileId = parseInt(profileId);
                const profile = await profileController.getProfile(targetProfileId);
                setActiveProfile(profile);
                
                const conversationMessages = await messageController.getProfileMessages(targetProfileId, 500, 0);
                setMessages(conversationMessages);
                
                const commissionIds = conversationMessages
                    .filter(msg => msg.commissionId !== null && msg.commissionId !== undefined)
                    .map(msg => msg.commissionId!);
                    
                if (commissionIds.length > 0) {
                    const commissionData: Record<number, Commission> = {};
                    await Promise.all(commissionIds.map(async (commissionId) => {
                        try {
                            const commission = await commissionController.getCommission(commissionId);
                            commissionData[commissionId] = commission;
                        } catch (error) {
                            console.error(`Error loading commission ${commissionId}:`, error);
                        }
                    }));
                    
                    setCommissions(commissionData);
                }
                
                setLoading(false);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Не удалось загрузить сообщения');
                setLoading(false);
            }
        };
        
        loadActiveConversation();
    }, [profileId, auth.me?.profileId, messageController, profileController, commissionController]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const messageText = messageInputRef.current?.value?.trim() || '';
        
        if (!activeProfile || !messageText || !auth.me?.profileId) return;
        
        try {
            setSendingMessage(true);
            const sentMessage = await profileController.postMessage(activeProfile.id, { text: messageText });
            setMessages(prev => [...prev, sentMessage]);
            
            if (messageInputRef.current) {
                messageInputRef.current.value = '';
            }
            messageInputRef.current?.focus();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Не удалось отправить сообщение');
        } finally {
            setSendingMessage(false);
        }
    };
    
    const MessageBubble = ({ message }: { message: Message }) => {
        const isOwnMessage = message.senderId === auth.me?.profileId;
        const messageDate = formatDate(message.createdAt);
        const commission = message.commissionId ? commissions[message.commissionId] : undefined;
        
        return (
            <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} my-2`}>
                <div className={`rounded-lg px-4 py-2 max-w-[75%] ${isOwnMessage ? 'bg-[#6c2769] text-white' : 'bg-gray-100'}`}>
                    {message.text}
                    
                    {commission && (
                        <div className="mt-2 border-t pt-2">
                            <div className="flex items-center">
                                {commission.image && (
                                    <img 
                                        src={commissionController.getCommissionImageUrl(commission.id)} 
                                        className="w-12 h-12 rounded-md object-cover mr-2" 
                                        alt={commission.name}
                                    />
                                )}
                                <div>
                                    <div className="font-bold text-sm">{commission.name}</div>
                                    <div className="text-xs">{commission.price} ₽</div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className={`text-xs mt-1 ${isOwnMessage ? 'text-gray-200' : 'text-gray-500'}`}>
                        {messageDate}
                    </div>
                </div>
            </div>
        );
    };
    
    const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
        const profile = conversationProfiles[conversation.profileId];
        if (!profile) return null;
        
        return (
            <Link 
                to={`/messages/${profile.id}`} 
                className={`flex items-center p-3 hover:bg-gray-100 transition-colors ${
                    activeProfile?.id === profile.id ? 'bg-gray-100' : ''
                }`}
            >
                <Avatar profile={profile} size={40} />
                <div className="ml-2">
                    <div className="font-medium">{profile.displayName}</div>
                    {conversation.lastMessage && (
                        <div className="text-sm text-gray-500 truncate">
                            Открыть диалог
                        </div>
                    )}
                </div>
            </Link>
        );
    };

    // const loadMoreMessages = async () => {
    //     if (loadingMoreMessages || !hasMoreMessages || !activeProfile) return;
        
    //     try {
    //         setLoadingMoreMessages(true);
    //         const nextOffset = messagesOffset + 10;
    //         const moreMessages = await messageController.getProfileMessages(
    //             activeProfile.id, 
    //             10, 
    //             nextOffset
    //         );
            
    //         if (moreMessages.length < 10) {
    //             setHasMoreMessages(false);
    //         }
            
    //         setMessages(prevMessages => [...prevMessages, ...moreMessages]);
    //         setMessagesOffset(nextOffset);
    //     } catch (error) {
    //         console.error('Error loading more messages:', error);
    //     } finally {
    //         setLoadingMoreMessages(false);
    //     }
    // };
    
    return (
        <>
            <Nav/>
            <div className='min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425] w-full flex flex-col items-center py-5'>
                <Container className='flex h-[calc(80vh)] max-h-[700px] overflow-hidden max-w-[1200px] w-full'>
                    <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
                        <div className="p-4 font-medium text-lg border-b flex justify-between items-center">
                            <div>Сообщения</div>
                        </div>
                        <div>
                            {loading && !activeProfile ? (
                                <div className="p-4 text-center text-gray-500">Загрузка...</div>
                            ) : error ? (
                                <div className="p-4 text-center text-red-500">{error}</div>
                            ) : conversations.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">Нет диалогов</div>
                            ) : (
                                conversations.map(conversation => (
                                    <ConversationItem key={conversation.profileId} conversation={conversation} />
                                ))
                            )}
                        </div>
                    </div>
                    
                    <div className="w-3/4 flex flex-col bg-white">
                        {activeProfile ? (
                            <>
                                <div className="p-3 border-b flex items-center">
                                    <Avatar profile={activeProfile} size={40} />
                                    <div className="ml-2 font-medium">{activeProfile.displayName}</div>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                                    {loading ? (
                                        <div className="text-center text-gray-500">Загрузка сообщений...</div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center text-gray-500 mt-4">
                                            Нет сообщений. Начните диалог!
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <MessageBubble key={message.id} message={message} />
                                        ))
                                    )}
                                    {/* {hasMoreMessages && (
                                        <div className="text-center mb-4">
                                            <button
                                                onClick={loadMoreMessages}
                                                disabled={loadingMoreMessages}
                                                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                                            >
                                                {loadingMoreMessages ? 'Загрузка...' : 'Загрузить предыдущие сообщения'}
                                            </button>
                                        </div>
                                    )} */}
                                    <div ref={messagesEndRef} />
                                </div>
                                
                                <form onSubmit={handleSendMessage} className="p-3 border-t flex items-center">
                                    <input
                                        type="text"
                                        className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Сообщение"
                                        ref={messageInputRef}
                                        disabled={sendingMessage}
                                    />
                                    <Button 
                                        type="submit" 
                                        className="primary ml-2"
                                        isLoading={sendingMessage}
                                        disabled={sendingMessage}
                                    >
                                        <Send size={18} className="mr-1" />
                                        Отправить
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="text-6xl mb-4">💬</div>
                                <div className="text-xl">Выберите диалог</div>
                                <div className="text-sm mt-2">Используйте панель слева для просмотра бесед</div>
                            </div>
                        )}
                    </div>
                </Container>
            </div>
        </>
    );
}