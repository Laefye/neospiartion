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

    async subscribeToTier(tierId: number): Promise<void> {
        const response = await this.api.post(`/tiers/${tierId}/subscriptions`);
        if (response.status !== 201) {
            throw new Error("Не удалось подписаться на уровень");
        }
    }

    async unsubscribeFromTier(tierId: number): Promise<void> {
        try {
            const response = await this.api.delete(`/api/tiers/${tierId}/subscriptions/${id}`);
            if (response.status !== 204 && response.status !== 200) {
                throw new Error("Не удалось отписаться от уровня");
            }
        } catch (error) {
            console.error("Error unsubscribing from tier:", error);
            throw new Error("Не удалось отписаться от уровня: " + 
                (error instanceof Error ? error.message : "неизвестная ошибка"));
        }
    }
}
