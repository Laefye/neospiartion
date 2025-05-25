import { AxiosError } from "axios";
import type { Client } from "../api";
import type * as types from "../types";
import { ProfileNotFoundException, type IProfileController } from "../interfaces/IProfileController";

export class ProfileController implements IProfileController {
    api: Client;
    private prefix: string = '/profiles';
    
    constructor(api: Client) {
        this.api = api;
    }
    
    
    async getTiers(profileId: number): Promise<types.Tier[]> {
        const { data } = await this.api.get(this.prefix + '/' + profileId + '/tiers');
        return data;
    }

    async createTier(profileId: number, value: types.AddingTierDto): Promise<types.Tier> {
        const { data } = await this.api.post(this.prefix + '/' + profileId + '/tiers', value);
        return data;
    }
    
    async postArt(profileId: number, value: types.CreationArt): Promise<types.Art> {
        const { data } = await this.api.post(`/profiles/${profileId}/arts`, value);
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

    async updateProfile(profileId: number, value: types.UpdateProfile): Promise<void> {
        await this.api.put(this.prefix + '/' + profileId, value);
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

    async getArts(profileId: number): Promise<types.Art[]> {
        const { data } = await this.api.get(this.prefix + '/' + profileId + '/arts');
        return data.map((art: any) => ({
            ...art,
            uploadedAt: new Date(art.uploadedAt),
            description: art.description || '',
        } as types.Art));
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

    async getSubscriptions(profileId: number): Promise<types.Subscription[]> {
        const { data } = await this.api.get(this.prefix + '/' + profileId + '/subscriptions');
        return data.map((subscription: any) => ({
            ...subscription,
            createdAt: new Date(subscription.createdAt),
            expiresAt: new Date(subscription.expiresAt),
        } as types.Subscription));
    }
}
