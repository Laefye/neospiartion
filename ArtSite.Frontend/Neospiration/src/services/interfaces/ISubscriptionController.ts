import type * as types from "../types";

export class SubscriptionException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SubscriptionException";
    }
}

export class SubscriptionNotFoundException extends SubscriptionException {
    constructor() {
        super("Подписка не найдена");
    }
}

export interface ISubscriptionController {
    getSubscriptions(profileId: number): Promise<types.Subscription[]>;
    subscribe(tierId: number): Promise<types.Subscription>;
    unsubscribe(subscriptionId: number): Promise<void>;
    getSubscriptionForTier(profileId: number, tierId: number): Promise<types.Subscription | null>;
}