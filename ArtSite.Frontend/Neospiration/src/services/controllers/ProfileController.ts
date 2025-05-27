import { AxiosError } from "axios";
import type { Client } from "../api";
import type * as types from "../types";
import { ProfileNotFoundException, type IProfileController } from "../interfaces/IProfileController";
import { ConversationNotFoundException, MessageException } from "../interfaces/IMessageController";

export class ProfileController implements IProfileController {
    api: Client;
    private prefix: string = '/profiles';
    
    constructor(api: Client) {
        this.api = api;
    }

    async getProfile(profileId: number): Promise<types.Profile> {
        try 
        {
            const { data } = await this.api.get(this.prefix + '/' + profileId);
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404 && error.response?.data?.detail === "Profile not found") {
                    throw new ProfileNotFoundException();
                }
            }
            throw error;
        }
    }

    async updateProfile(profileId: number, value: types.UpdateProfile): Promise<void> {
        await this.api.put(this.prefix + '/' + profileId, value);
    }

    async getArts(profileId: number): Promise<types.Art[]> {
        const { data } = await this.api.get(this.prefix + '/' + profileId + '/arts');
        return data.map((art: any) => ({
            ...art,
            uploadedAt: new Date(art.uploadedAt),
            description: art.description || '',
        } as types.Art));
    }

    async postArt(profileId: number, value: types.CreationArt): Promise<types.Art> {
        const { data } = await this.api.post(`/profiles/${profileId}/arts`, value);
        return data;
    }
    
    async getMessages(profileId: number, limit: number = 1000, offset: number = 0): Promise<types.Message[]> {
        try {
            const { data } = await this.api.get(`${this.prefix}/${profileId}/messages`, {
                params: { limit, offset }
            });
            
            return data.map((message: any) => ({
                ...message,
                createdAt: new Date(message.createdAt)
            } as types.Message));
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new ProfileNotFoundException();
                }
                if (error.response?.status === 403) {
                    throw new Error("Доступ запрещен");
                }
            }
            throw error;
        }
    }

    async postMessage(profileId: number, message: types.AddingMessage): Promise<types.Message> {
        try {
            const { data } = await this.api.post(`/profiles/${profileId}/messages`, message);
            
            return {
                ...data,
                createdAt: new Date(data.createdAt)
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new MessageException('Профиль не найден');
                }
                if (error.response?.status === 403) {
                    throw new MessageException('Нельзя отправить сообщение самому себе');
                }
            }
            throw new MessageException(`Ошибка при отправке сообщения: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
    }

    async getConversations(profileId: number, limit: number = 100, offset: number = 0): Promise<types.Conversation[]> {
        try {
            const { data } = await this.api.get(`${this.prefix}/${profileId}/conversations`, {
                params: { limit, offset }
            });
            
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new ConversationNotFoundException();
                }
                if (error.response?.status === 403) {
                    throw new Error("Доступ запрещен");
                }
            }
            throw error;
        }
    }
    
    async getTiers(profileId: number): Promise<types.Tier[]> {
        const { data } = await this.api.get(this.prefix + '/' + profileId + '/tiers');
        return data;
    }

    async createTier(profileId: number, value: types.AddingTierDto): Promise<types.Tier> {
        const { data } = await this.api.post(this.prefix + '/' + profileId + '/tiers', value);
        return data;
    }
    
    async deleteAvatar(profileId: number): Promise<void> {
        await this.api.delete(this.prefix + '/' + profileId + '/avatar');
    }
    
    async getAvatarUrl(profileId: number): Promise<string> {
        return this.api.url + this.prefix + '/' + profileId + '/avatar?timestamp=' + Date.now();
    }
    
    async postAvatar(profileId: number, avatarFile: File): Promise<void> {
        const formData = new FormData();
        formData.append('avatarFile', avatarFile);
        await this.api.postFormData(this.prefix + '/' + profileId + '/avatar', formData);
    }

    async searchProfiles(query: string): Promise<types.Profile[]> {
        try {
            const response = await this.api.get('/api/profiles/search', {
                params: { query },
                skipAuthRefresh: true
            });
            return response.data;
        } catch (error) {
            console.error("Error searching profiles:", error);
            return [];
        }
    }

    async getCommissions(profileId: number): Promise<types.Commission[]> {
        const { data } = await this.api.get(this.prefix + '/' + profileId + '/commissions');
        return data.map((commission: any) => ({
            ...commission,
            createdAt: new Date(commission.createdAt),
            updatedAt: new Date(commission.updatedAt),
        } as types.Commission));
    }
    
    async postCommission(profileId: number, value: types.CommissionDto): Promise<types.Commission> {
        const { data } = await this.api.post(this.prefix + '/' + profileId + '/commissions', value);
        return {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
        } as types.Commission;
    }

    async getSubscriptions(profileId: number): Promise<types.Subscription[]> {
        const { data } = await this.api.get(this.prefix + '/' + profileId + '/subscriptions');
        return data.map((subscription: any) => ({
            ...subscription,
            createdAt: new Date(subscription.createdAt),
            expiresAt: new Date(subscription.expiresAt),
        } as types.Subscription));
    }
}
