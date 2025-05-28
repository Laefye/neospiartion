export type Register = {
    email: string;
    password: string;
    userName: string;
    displayName: string;
}

export type Login = {
    email: string;
    password: string;
}

export type Countable<T> = {
    count: number;
    items: T[];
}

export type SafeUser = {
    id: string;
    userName: string;
    email: string;
}

export type Token = {
    accessToken: string;
    expiresAt: Date;
}

export type Me = {
    userId: string;
    email: string;
    userName: string;
    profileId: number | null;
}

export type UpdateUser = {
    userName: string;
}

export type Profile = {
    id: number;
    userId: string;
    displayName: string;
    avatar: number | null;
    description: string;
}

export type UpdateProfile = {
    displayName: string;
    description: string;
}

export type Art = {
    id: number;
    description?: string;
    uploadedAt: Date;
    profileId: number;
    tierId?: number;
    likeCount: number;
    commentCount: number;
    isLiked?: boolean;
}

export type CreationArt = {
    description: string;
    tierId?: number | null;
}

export type Picture = {
    id: number;
    artId: number;
    storagedFileId: number;
}

export type Comment = {
    id: number;
    text: string;
    artId: number;
    uploadedAt: Date;
    profileId: number;
}

export type Message = {
    id: number;
    text: string;
    senderId: number;
    receiverId: number;
    createdAt: Date;
    isRead: boolean;
    commissionId?: number;
}

export type AddingMessage = {
    text: string;
    commissionId?: number;
}

export type Conversation = {
    id: number;
    profileId: number;
    participants: Profile[];
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: Date;
}

export type Tier = {
    id: number;
    name: string;
    description: string;
    price: number;
    avatar: number | null;
    extends: number | null;
    profileId: number;
};

export type AddingTierDto = {
    name: string;
    description: string;
    price: number;
    extends?: number | null;
}

export type Subscription = {
    id: number;
    profileId: number;
    tierId: number;
    createdAt: Date;
    expiresAt: Date;
};

export type Commission = {
    image: any;
    id: number;
    name: string;
    profileId: number;
    description: string;
    price: number;
    status: "pending" | "accepted" | "rejected" | "completed";
    createdAt: Date;
    updatedAt: Date;
};

export type CommissionDto = {
    name: string;
    description: string;
    price: number;
};