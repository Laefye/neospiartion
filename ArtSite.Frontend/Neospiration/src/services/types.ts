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
    updatedAt: Date;
    profileId: number;
    tierId?: number;
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
    updatedAt: Date;
    profileId: number;
}
