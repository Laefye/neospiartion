import type { DefaultClient } from "../api";
import type * as types from "../types";
import { TierHasChildrenException, TierNotFoundException, type ITierController } from "../interfaces/ITierController";
import { AxiosError } from "axios";

export class TierController implements ITierController {
    private api: DefaultClient;
    
    constructor(api: DefaultClient) {
        this.api = api;
    }
    async getTier(tierId: number): Promise<types.Tier> {
        const response = await this.api.get(`/tiers/${tierId}`);
        return response.data;
    }

    async deleteTier(tierId: number): Promise<void> {
        try {
            await this.api.delete(`/tiers/${tierId}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response && error.response.status === 404) {
                    throw new TierNotFoundException();
                } else if (error.response && error.response.status === 400 && error.response.data.detail === "This tier has child tiers") {
                    throw new TierHasChildrenException();
                }
            }
            throw error;
        }
    }

    async updateAvatar(tierId: number, avatarFile: File): Promise<void> {
        const formData = new FormData();
        formData.append("file", avatarFile);
        await this.api.postFormData(`/tiers/${tierId}/avatar`, formData);
    }

    getAvatarUrl(tierId: number): string {
        return `${this.api.url}/tiers/${tierId}/avatar?timestamp=${Date.now()}`;
    }
}
