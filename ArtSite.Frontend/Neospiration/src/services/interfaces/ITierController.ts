import type * as types from "../types";

export class TierException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ArtException";
    }
}

export class TierNotFoundException extends TierException {
    constructor() {
        super("Уровень подписки не найден");
    }
}

export class TierHasChildrenException extends TierException {
    constructor() {
        super("Невозможно удалить уровень подписки, так как он имеет дочерние уровни");
    }
}


export interface ITierController {
    getTier(tierId: number): Promise<types.Tier>;

    deleteTier(tierId: number): Promise<void>;

    updateAvatar(tierId: number, avatarFile: File): Promise<void>;

    getAvatarUrl(tierId: number): string;

    subscribeToTier(tierId: number): Promise<void>;

    unsubscribeFromTier(tierId: number): Promise<void>;
}
