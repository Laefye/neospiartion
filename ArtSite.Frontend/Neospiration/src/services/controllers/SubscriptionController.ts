// src/services/controllers/SubscriptionController.ts
import { AxiosError } from "axios";
import type { Client } from "../api";
import type * as types from "../types";
import { SubscriptionNotFoundException } from "../interfaces/ISubscriptionController";
import type { ISubscriptionController } from "../interfaces/ISubscriptionController";

export class SubscriptionController implements ISubscriptionController {
    private api: Client;
    
    constructor(api: Client) {
        this.api = api;
    }
    
    async getSubscriptions(profileId: number): Promise<types.Subscription[]> {
        try {
            const response = await this.api.get(`/api/profiles/${profileId}/subscriptions`);
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            return [];
        }
    }
    
    async subscribe(tierId: number): Promise<types.Subscription> {
        try {
            const response = await this.api.post(`/api/tiers/${tierId}/subscriptions`);
            return response.data;
        } catch (error) {
            console.error("Error subscribing to tier:", error);
            if (error instanceof AxiosError && error.response) {
                if (error.response.status === 400 && error.response.data?.detail) {
                    throw new Error(error.response.data.detail);
                }
            }
            throw new Error("Не удалось подписаться на уровень");
        }
    }
    
    async unsubscribe(subscriptionId: number): Promise<void> {
        try {
            const response = await this.api.delete(`/api/subscriptions/${subscriptionId}`);
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
    
    async getSubscriptionForTier(profileId: number, tierId: number): Promise<types.Subscription | null> {
        try {
            const subscriptions = await this.getSubscriptions(profileId);
            return subscriptions.find(sub => sub.tierId === tierId) || null;
        } catch (error) {
            console.error("Error finding subscription for tier:", error);
            return null;
        }
    }
}