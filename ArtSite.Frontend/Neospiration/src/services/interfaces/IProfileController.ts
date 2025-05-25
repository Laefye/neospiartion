import type * as types from "../types";

export class ProfileException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ProfileException";
    }
}

export class ProfileNotFoundException extends ProfileException {
    constructor() {
        super("Профиль не найден");
    }
}

export interface IProfileController {
    getProfile(profileId: number): Promise<types.Profile>;
    updateProfile(profileId: number, value: types.UpdateProfile): Promise<void>;

    getArts(profileId: number): Promise<types.Art[]>;
    postArt(profileId: number, value: types.CreationArt): Promise<types.Art>;

    // getMessages(profileId: number, limit?: number, offset?: number): Promise<types.Message[]>;
    // postMessage(profileId: number, value: types.AddingMessageDto): Promise<types.Message>;
    // getConversations(profileId: number, limit?: number, offset?: number): Promise<types.Conversation[]>;

    getTiers(profileId: number): Promise<types.Tier[]>;
    createTier(profileId: number, value: types.AddingTierDto): Promise<types.Tier>;

    getAvatarUrl(profileId: number): Promise<string>;
    postAvatar(profileId: number, avatarFile: File): Promise<void>;
    deleteAvatar(profileId: number): Promise<void>;

    searchProfiles(query: string): Promise<types.Profile[]>;

    // getSubscriptions(profileId: number): Promise<types.Subscription[]>;
    // getCommissions(profileId: number): Promise<types.Commission[]>;
    // postCommission(profileId: number, value: types.CommissionDto): Promise<types.Commission>;
}