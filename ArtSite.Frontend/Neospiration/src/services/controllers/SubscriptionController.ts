import { AxiosError } from "axios";
import type { Client } from "../api";
import { SubscriptionNotFoundException } from "../interfaces/ISubscriptionController";
import type { ISubscriptionController } from "../interfaces/ISubscriptionController";

export class SubscriptionController implements ISubscriptionController {
    private api: Client;
    
    constructor(api: Client) {
        this.api = api;
    }
    
    async unsubscribe(subscriptionId: number): Promise<void> {
        try {
            const response = await this.api.delete(`/subscriptions/${subscriptionId}`);
            if (response.status !== 204 && response.status !== 200) {
                throw new Error("Не удалось отписаться от уровня");
            }
        } catch (error) {
            console.error("Error unsubscribing from tier:", error);
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 404) {
                    throw new SubscriptionNotFoundException();
                }
            }
            throw new Error("Не удалось отписаться от уровня: " + 
                (error instanceof Error ? error.message : "неизвестная ошибка"));
        }
    }
}