export interface Art {
    id: number;
    title: string;
    description: string;
    artistId: number;
    createdAt: string;
    tags?: string[];
}