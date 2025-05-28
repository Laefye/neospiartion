import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { ProfileController } from '../services/controllers/ProfileController';
import api from '../services/api';
import type { Commission, Profile, Art, Tier, Subscription } from '../services/types';
import Seperator from '../components/ui/Seperator';
import { MessageSquare, PencilLine } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ButtonLink from '../components/ui/ButtonLink';
import Container from '../components/ui/Container';
import ArtPublishModal from '../components/ui/ArtPublishModal';
import Publication from '../components/ui/Publication';
import Nav from '../components/ui/Nav';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import { FormInput } from '../components/ui/FormInput';
import { FileSelect } from '../components/ui/FileSelect';
import Header from '../components/ui/Header';
import ErrorMessage from '../components/ui/ErrorMessage';
import { TierController } from '../services/controllers/TierController';
import { FormList } from '../components/ui/FormList';
import BigText from '../components/ui/BigText';
import { SubscriptionController } from '../services/controllers/SubscriptionController';
import { CommissionController } from '../services/controllers/CommissionController';
import { TextArea } from '../components/ui/TextArea';

function Submenu({tiers, profile, onTiersUpdated}: {profile: Profile, tiers: Tier[], onTiersUpdated?: () => void}) {
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [creatingForm, setCreatingForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'tiers' | 'commissions'>('tiers');
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [creatingCommission, setCreatingCommission] = useState(false);
    const [commissionLoading, setCommissionLoading] = useState(true);
    
    const nameRef = useRef<HTMLInputElement | null>(null);
    const descriptionRef = useRef<HTMLInputElement | null>(null);
    const priceRef = useRef<HTMLInputElement | null>(null);
    const extendsRef = useRef<HTMLSelectElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const icon = useRef<HTMLInputElement | null>(null);
    const profileController = useMemo(() => new ProfileController(api), [api]);
    const tierController = useMemo(() => new TierController(api), [api]);
    const commissionController = useMemo(() => new CommissionController(api), [api]);
    const subscriptionController = useMemo(() => new SubscriptionController(api), [api]);
    const [userSubscriptions, setUserSubscriptions] = useState<Subscription[]>([]);
    
    const isTierSubscribed = (tierId: number) => {
        return userSubscriptions.some(sub => sub.tierId === tierId);
    };
    
    const commissionNameRef = useRef<HTMLInputElement | null>(null);
    const commissionDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
    const commissionPriceRef = useRef<HTMLInputElement | null>(null);
    const commissionImageRef = useRef<HTMLInputElement | null>(null);
    
    useEffect(() => {
        if (activeTab === 'commissions') {
            loadCommissions();
        }
    }, [activeTab]);

    useEffect(() => {
        const loadSubscriptions = async () => {
            if (!auth.me) return;
            try {
                const subscriptions = await profileController.getSubscriptions(auth.me.profileId!);
                setUserSubscriptions(subscriptions);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Неизвестная ошибка при загрузке подписок');
                }
            }
        }
        loadSubscriptions();
    }, [auth.me, profileController]);

    const loadCommissions = async () => {
        try {
            setCommissionLoading(true);
            const fetchedCommissions = await profileController.getCommissions(profile.id);
            setCommissions(fetchedCommissions);
            setCommissionLoading(false);
        } catch (error) {
            console.error('Error loading commissions:', error);
            setCommissionLoading(false);
        }
    };

    const handleCreateTier = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nameRef.current?.value || !descriptionRef.current?.value || !icon.current?.files?.length) {
            return;
        }
        setLoading(true);
        try {
            const iconFile = icon.current.files[0];
            const extendsValue = extendsRef.current?.value ? parseInt(extendsRef.current.value) : null;
            const tier = await profileController.createTier(profile.id, {
                name: nameRef.current.value,
                description: descriptionRef.current.value,
                price: parseFloat(priceRef.current?.value || '0'),
                extends: extendsValue == 0 ? null : extendsValue
            });
            await tierController.updateAvatar(tier.id, iconFile);
            if (nameRef.current) {
                nameRef.current.value = '';
            }
            if (descriptionRef.current) {
                descriptionRef.current.value = '';
            }
            if (priceRef.current) {
                priceRef.current.value = '';
            }
            if (icon.current) {
                icon.current.value = '';
            }
            if (extendsRef.current) {
                extendsRef.current.value = '';
            }
            setCreatingForm(false);
            if (onTiersUpdated) {
                onTiersUpdated();
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
    }

    const handleCreateCommission = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!commissionNameRef.current?.value || !commissionDescriptionRef.current?.value || !commissionPriceRef.current?.value) {
            setError('Пожалуйста, заполните все поля');
            return;
        }
        
        setLoading(true);
        try {
            const newCommission = await commissionController.createCommission(profile.id, {
                name: commissionNameRef.current.value,
                description: commissionDescriptionRef.current.value,
                price: parseInt(commissionPriceRef.current.value)
            });
            
            if (commissionImageRef.current?.files?.length) {
                await commissionController.uploadCommissionImage(newCommission.id, commissionImageRef.current.files[0]);
            }
            
            if (commissionNameRef.current) commissionNameRef.current.value = '';
            if (commissionDescriptionRef.current) commissionDescriptionRef.current.value = '';
            if (commissionPriceRef.current) commissionPriceRef.current.value = '';
            if (commissionImageRef.current) commissionImageRef.current.value = '';
            
            setCreatingCommission(false);
            loadCommissions();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Неизвестная ошибка при создании коммиссии');
            }
        } finally {
            setLoading(false);
        }
    };

    const deleteTier = async (tierId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить этот уровень подписки?')) {
            try {
                await tierController.deleteTier(tierId);
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                }
                else {
                    alert('Неизвестная ошибка при удалении уровня подписки');
                }
            }
            if (onTiersUpdated) {
                onTiersUpdated();
            }
        }
    }

    const deleteCommission = async (commissionId: number) => {
        if (window.confirm('Вы уверены, что хотите удалить эту коммиссию?')) {
            try {
                await commissionController.deleteCommission(commissionId);
                loadCommissions();
            } catch (error) {
                if (error instanceof Error) {
                    alert(error.message);
                } else {
                    alert('Неизвестная ошибка при удалении коммиссии');
                }
            }
        }
    };

    const getParentTiers = (extendsId: number | null): Tier[] => {
        if (!extendsId) return [];
        const parentTier = tiers.find(tier => tier.id === extendsId);
        if (!parentTier) return [];
        return [parentTier, ...getParentTiers(parentTier.extends)];
    }

    const subscribeToTier = async (tierId: number) => {
        if (!auth.me) {
            alert('Вы должны быть авторизованы для подписки на уровень');
            return;
        }
        try {
            await tierController.subscribeToTier(tierId);
            alert('Вы успешно подписались на уровень');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Неизвестная ошибка при подписке на уровень');
            }
        }
    };

    const unsubscribeFromTier = async (tierId: number) => {
        if (!auth.me) {
            alert('Вы должны быть авторизованы для отписки от уровня');
            return;
        }
        try {
            subscriptionController.unsubscribe(userSubscriptions.find(sub => sub.tierId === tierId)?.id!);
            const subscriptions = await profileController.getSubscriptions(auth.me.profileId!);
            setUserSubscriptions(subscriptions);
            alert('Вы успешно отписались от уровня');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Неизвестная ошибка при отписке от уровня');
            }
        }
    };

    const CommissionItem = ({ commission }: { commission: Commission }) => {
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageError, setMessageError] = useState<string | null>(null);
    
    const handleRequestCommission = () => {
        setMessageText(`Здравствуйте, я хотел бы заказать "${commission.name}" (№${commission.id}).`);
        setShowMessageForm(true);
    };
    
    const handleSendMessage = async () => {
        if (!messageText.trim()) return;
        
        try {
            setSendingMessage(true);
            setMessageError(null);
            
            await profileController.postMessage(profile.id, {
                text: messageText,
                commissionId: commission.id
            });
            
            setShowMessageForm(false);
            setMessageText('');
            alert('Сообщение успешно отправлено!');
        } catch (error) {
            if (error instanceof Error) {
                setMessageError(error.message);
            } else {
                setMessageError('Произошла ошибка при отправке сообщения');
            }
        } finally {
            setSendingMessage(false);
        }
    };
    
    return (
        <div key={commission.id} className='flex flex-col gap-1 items-center border-2 border-art-text-hint rounded-lg p-3 w-full'>
            <span className='text-sm text-art-text-hint w-full'>{commission.price} ₽</span>
            {commission.image && (
                <img 
                    src={commissionController.getCommissionImageUrl(commission.id)} 
                    width={96} 
                    height={96} 
                    className='rounded-lg object-cover h-24 w-24'
                    alt={commission.name}
                />
            )}
            <span className='text-lg'>{commission.name}</span>
            <p className='text-center text-art-text-hint'>{commission.description}</p>
            
            {auth.me?.userId === profile.userId ? (
                <Button variant='danger' onClick={() => deleteCommission(commission.id)}>Удалить</Button>
            ) : auth.me && (
                <Button variant='primary' onClick={handleRequestCommission} className="w-full mt-2">
                    Заказать
                </Button>
            )}
            
            {showMessageForm && (
                <div className='fixed left-0 top-0 w-full h-full backdrop-blur-sm bg-black/50 z-50' onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setShowMessageForm(false);
                    }
                }}>
                    <Container className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 w-full max-w-[500px]'>
                        <form className='flex flex-col gap-3' onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                            <Header title="Заказать комиссию" />
                            {messageError && <ErrorMessage>{messageError}</ErrorMessage>}
                            <TextArea 
                                value={messageText} 
                                onChange={(e) => setMessageText(e.target.value)} 
                                disabled={sendingMessage}
                                required
                                id="commission-message"
                                label="Сообщение"
                                rows={5}
                            />
                            <div className='flex gap-3'>
                                <Button 
                                    disabled={sendingMessage} 
                                    isLoading={sendingMessage} 
                                    type='submit' 
                                    className='grow'
                                >
                                    Отправить
                                </Button>
                                <Button 
                                    disabled={sendingMessage} 
                                    variant='outline' 
                                    type='button' 
                                    onClick={() => setShowMessageForm(false)}
                                >
                                    Отмена
                                </Button>
                            </div>
                        </form>
                    </Container>
                </div>
            )}
        </div>
    );
};

    const renderForms = () => (
        <>
            {creatingForm && (
                <div className='fixed left-0 top-0 w-full h-full backdrop-blur-sm bg-black/50' onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setCreatingForm(false);
                    }
                }}>
                    <Container className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 w-full max-w-[500px]'>
                        <form className='flex flex-col gap-3' onSubmit={handleCreateTier}>
                            <Header title="Создание уровня подписки"/>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            <FormInput required disabled={loading} id='name' label='Название' inputRef={nameRef}/>
                            <FormInput required disabled={loading} id='description' label='Описание' inputRef={descriptionRef} />
                            <FormInput required disabled={loading} id='price' label='Цена (₽)' type='number' min={1} inputRef={priceRef}/>
                            <FileSelect id='icon' label='Иконка' accept='image/*' ref={icon} />
                            <FormList id='extends' label='Наследование' options={<><option value="0">Ничего</option>{tiers.map(tier => <option value={tier.id} key={tier.id}>{tier.name}</option>)}</>} inputRef={extendsRef} className='w-full' placeholder='Не наследовать'/>
                            <div className='flex gap-3'>
                                <Button disabled={loading} isLoading={loading} type='submit' className='grow'>Создать</Button>
                                <Button disabled={loading} variant='outline' type='button' onClick={() => setCreatingForm(false)}>Отмена</Button>
                            </div>
                        </form>
                    </Container>
                </div>
            )}
            
            {creatingCommission && (
                <div className='fixed left-0 top-0 w-full h-full backdrop-blur-sm bg-black/50' onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setCreatingCommission(false);
                    }
                }}>
                    <Container className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 w-full max-w-[500px]'>
                        <form className='flex flex-col gap-3' onSubmit={handleCreateCommission}>
                            <Header title="Создание заказа"/>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            <FormInput required disabled={loading} id='commission-name' label='Название' inputRef={commissionNameRef}/>
                            <TextArea required disabled={loading} id='commission-description' label='Описание' inputRef={commissionDescriptionRef} />
                            <FormInput required disabled={loading} id='commission-price' label='Цена (₽)' type='number' min={1} inputRef={commissionPriceRef}/>
                            <FileSelect id='commission-image' label='Изображение' accept='image/*' ref={commissionImageRef} />
                            <div className='flex gap-3'>
                                <Button disabled={loading} isLoading={loading} type='submit' className='grow'>Создать</Button>
                                <Button disabled={loading} variant='outline' type='button' onClick={() => setCreatingCommission(false)}>Отмена</Button>
                            </div>
                        </form>
                    </Container>
                </div>
            )}
        </>
    );
    
    return <>
        {renderForms()}
        <Container className='flex flex-col items-center justify-between h-min md:min-w-[400px]' withoutPadding>
            <div className='flex w-full'>
                <div className={`grow border-b-2 ${activeTab === 'tiers' ? 'border-art-secondary' : 'border-art-text-hint'}`}>
                    <Button 
                        variant='submenu' 
                        className='w-full' 
                        onClick={() => setActiveTab('tiers')}
                    >
                        Уровни подписки
                    </Button>
                </div>
                <div className={`grow border-b-2 ${activeTab === 'commissions' ? 'border-art-secondary' : 'border-art-text-hint'}`}>
                    <Button 
                        variant='submenu' 
                        className='w-full'
                        onClick={() => setActiveTab('commissions')}
                    >
                        Заказы
                    </Button>
                </div>
            </div>
            <div className="p-3 w-full">
                {activeTab === 'tiers' ? (
                    <div className='flex flex-col gap-2 w-full'>
                        {tiers.length > 0 ? tiers.map((tier) => (
                            <div key={tier.id} className='flex flex-col gap-1 items-center'>
                                <span className='text-sm text-art-text-hint w-full'>{tier.price} ₽ в Месяц</span>
                                { tier.avatar && (
                                    <img src={tierController.getAvatarUrl(tier.id)} width={96} height={96} className='rounded-lg'/>
                                )}
                                <span className='text-lg'>{tier.name}</span>
                                <p className='text-center text-art-text-hint'>{tier.description}</p>
                                {auth.me?.userId === profile.userId && (
                                    <Button variant='danger' onClick={() => deleteTier(tier.id)}>Удалить</Button>
                                )}
                                {tier.extends && (
                                    <div className='flex flex-col items-center'>
                                        <span className='text-sm text-art-text-hint'>Наследует от:</span>
                                        <ul className='list-disc list-inside text-center'>
                                            {getParentTiers(tier.extends).map((parentTier) => (
                                                <li key={parentTier.id} className='text-sm'>{parentTier.name}</li>
                                            )).reverse()}
                                        </ul>
                                    </div>
                                )}
                                {auth.me && auth.me.userId !== profile.userId && (
                                    <Button 
                                        variant={isTierSubscribed(tier.id) ? 'danger' : 'outline'} 
                                        onClick={() => isTierSubscribed(tier.id) ? unsubscribeFromTier(tier.id) : subscribeToTier(tier.id)}
                                        className="w-full"
                                    >
                                        {isTierSubscribed(tier.id) ? "Отписаться" : "Подписаться"}
                                    </Button>
                                )}
                            </div>
                        )) : (
                            <p className='text-center text-art-text-hint'>Уровни подписки отсутствуют</p>
                        )}
                        {auth.me?.userId === profile.userId && (
                            <Button variant='outline' className='w-full mt-3' onClick={() => setCreatingForm(true)}>
                                Создать уровень подписки
                            </Button>
                        )}
                    </div>
                ) : (
                    activeTab === 'commissions' && (
                        <div className='flex flex-col gap-2 w-full'>
                            {commissionLoading ? (
                                <p className='text-center text-art-text-hint'>Загрузка заказов...</p>
                            ) : commissions.length > 0 ? (
                                commissions.map(commission => (
                                    <CommissionItem key={commission.id} commission={commission} />
                                ))
                            ) : (
                                <p className='text-center text-art-text-hint'>Заказы отсутствуют</p>
                            )}
                            {auth.me?.userId === profile.userId && (
                                <Button variant='outline' className='w-full mt-3' onClick={() => setCreatingCommission(true)}>
                                    Создать заказ
                                </Button>
                            )}
                        </div>
                    )
                )}
            </div>
        </Container>
    </>
}

export default function ProfilePage() {
    const { id } = useParams();
    const auth = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [arts, setArts] = useState<Art[]>([]);
    
    const profileController = useMemo(() => new ProfileController(api), [api]);

    const updateArts = async () => {
        const arts = await profileController.getArts(parseInt(id!));
        setArts(arts);
    }

    const updateTiers = async () => {
        setTiers(await profileController.getTiers(parseInt(id!)));
    }

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await profileController.getProfile(parseInt(id!));
                setProfile(profile);
                await updateArts();
                await updateTiers();
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Неизвестная ошибка');
                }
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            loadProfile();
        }
    }, [id]);

    const getProfileActions = () => {
        if (!profile) return null;
        
        if (auth.me?.userId === profile.userId) {
            return (
                <ButtonLink variant='outline' href={`/profile/${profile.id}/edit`}>
                    <PencilLine className='me-2' />
                    <span>Редактировать</span>
                </ButtonLink>
            );
        } else if (auth.me) {
            return (
                <ButtonLink
                variant='outline' 
                href={`/messages/${profile.id}`} 
                aria-label="Открыть чат с пользователем">
                    <MessageSquare className='me-2' />
                    <span>Сообщения</span>
                </ButtonLink>
            );
        }
        return null;
    };
    
    if (loading) {
        return (
            <>
                <Nav/>
                <div className='min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425] w-full flex flex-col items-center'>
                    <div className='w-max-container w-full py-5'>
                        <div className='p-2.5 rounded-lg bg-white space-y-2.5'>
                            <div className='flex items-center'>
                                <div className='w-16 h-16 rounded-full bg-gray-200 animate-pulse'></div>
                                <span className='ml-4 w-24 h-6 animate-pulse bg-gray-200 rounded'></span>
                                <div className='grow'></div>
                            </div>
                            <Seperator/>
                            <div className='w-full h-6 animate-pulse bg-gray-200 rounded'></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Nav/>
            <div className='min-h-screen bg-gradient-to-b from-[#25022A] to-[#320425] w-full flex flex-col items-center'>
                {error && <div className='p-2.5 rounded-lg bg-white space-y-2.5'>{error}</div>}
                {profile && (
                    <div className='w-max-container w-full py-5 space-y-5'>
                        <Container className='space-y-2.5'>
                            <div className='flex items-center'>
                                <Avatar profile={profile} size={64} />
                                <span className='ml-4 text-2xl'>{profile.displayName}</span>
                                <div className='grow'></div>
                                {getProfileActions()}
                            </div>
                            {profile.description && (
                                <>
                                    <Seperator/>
                                    <BigText className='text-lg' textArea={profile.description}/>
                                </>
                            )}
                        </Container>
                        
                        {profile.userId === auth.me?.userId && (
                            <ArtPublishModal onPublished={updateArts} profileId={parseInt(id!)}/>
                        )}
                        
                        <div className='flex flex-col gap-4 md:flex-row-reverse'>
                            <Submenu profile={profile} tiers={tiers} onTiersUpdated={() => updateTiers()}/>
                            <div className='flex flex-col gap-4 grow'>
                                {arts.length > 0 && arts.map((art) => (<Publication key={art.id} art={art} settings={{onDeleted: () => updateArts()}}/>))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
