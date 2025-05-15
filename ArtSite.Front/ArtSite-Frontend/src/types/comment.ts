export interface Comment {
    id: number;
    text: string;
    userId: number;
    artId: number;
    createdAt: string;
}

export interface AddingComment {
    text: string;
}
