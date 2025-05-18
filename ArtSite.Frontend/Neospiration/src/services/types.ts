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
