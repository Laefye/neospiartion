import { AxiosError } from "axios";
import type { Client } from "./api";
import type { Profile } from "./types";
import { ProfileNotFoundException, type IProfileController } from "./interfaces/IProfileController";

export class ProfileController implements IProfileController {
    api: Client;
    private prefix: string = '/profiles';
    
    constructor(api: Client) {
        this.api = api;
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