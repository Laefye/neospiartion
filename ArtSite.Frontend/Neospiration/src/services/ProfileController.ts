import { AxiosError } from "axios";
import type { Client } from "./api";
import type { Profile, UpdateProfile } from "./types";
import { ProfileNotFoundException, type IProfileController } from "./interfaces/IProfileController";

export class ProfileController implements IProfileController {
    api: Client;
    private prefix: string = '/profiles';
    
    constructor(api: Client) {
        this.api = api;
    }
    
    async deleteAvatar(profileId: number): Promise<void> {
        try {
            await this.api.delete(this.prefix + '/' + profileId + '/avatar');
        } catch (error) {
            throw error;
        }
    }
    
    async getAvatarUrl(profileId: number): Promise<string> {
        return this.api.url + this.prefix + '/' + profileId + '/avatar?timestamp=' + Date.now();
    }
    
    async postAvatar(profileId: number, avatarFile: File): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('avatarFile', avatarFile);
            await this.api.postFormData(this.prefix + '/' + profileId + '/avatar', formData);
        } catch (error) {
            throw error;
        }
    }

    async updateProfile(profileId: number, value: UpdateProfile): Promise<void> {
        try {
            await this.api.put(this.prefix + '/' + profileId, value);
        } catch (error) {
            throw error;
        }
    }

    async getProfile(profileId: number): Promise<Profile> {
        try {
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
}