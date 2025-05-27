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
    unsubscribe(subscriptionId: number): Promise<void>;
}