import type { DefaultClient } from "../api";
import type * as types from "../types";
import { ArtNotFoundException, ArtNotAvailableForProfileException } from "../interfaces/IArtController";
import type { IArtController } from "../interfaces/IArtController";

export class ArtController implements IArtController {
    private api: DefaultClient;
    
    constructor(api: DefaultClient) {
        this.api = api;
    }

    async deleteArt(artId: number): Promise<void> {
        try {
            await this.api.delete(`/arts/${artId}`);
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            if (err.response && err.response.status === 403) {
                throw new ArtNotAvailableForProfileException();
            }
            throw err;
        }
    }
    
    async likeArt(artId: number): Promise<void> {
        await this.api.post(`/arts/${artId}/like`);
    }
    async unlikeArt(artId: number): Promise<void> {
        await this.api.delete(`/arts/${artId}/like`);
    }

    async getArt(artId: number): Promise<types.Art> {
        try {
            const { data } = await this.api.get(`/arts/${artId}`);
            return {
                ...data,
                uploadedAt: new Date(data.uploadedAt),
            };
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async createArt(profileId: number, description: string, tierId?: number): Promise<types.Art> {
        try {
            const response = await this.api.post(`/profiles/${profileId}/arts`, {
                description,
                tierId
            });
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            if (err.response && err.response.status === 403) {
                throw new ArtNotAvailableForProfileException();
            }
            throw err;
        }
    }

    async getComments(artId: number, offset: number, limit: number): Promise<types.Countable<types.Comment>> {
        try {
            const response = await this.api.get(`/arts/${artId}/comments`, {
                offset,
                limit,
            });
            return {
                count: response.data.count,
                items: response.data.items.map((comment: any) => ({
                    ...comment,
                    uploadedAt: new Date(comment.uploadedAt),
                }))
            };
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async addComment(artId: number, text: string): Promise<types.Comment> {
        try {
            const response = await this.api.post(`/arts/${artId}/comments`, { text });
            return {
                ...response.data,
                uploadedAt: new Date(response.data.uploadedAt),
            };
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async getPictures(artId: number): Promise<types.Picture[]> {
        try {
            const response = await this.api.get(`/arts/${artId}/pictures`);
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    async uploadPicture(artId: number, file: File): Promise<types.Picture> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await this.api.postFormData(`/arts/${artId}/pictures`, formData);
            return response.data;
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }

    getPictureUrl(pictureId: number): string {
        return this.api.url + `/pictures/${pictureId}/view`;
    }

    async getAllArts(offset: number = 0, limit: number = 10): Promise<types.Countable<types.Art>> {
        try {
            const response = await this.api.get(`/arts`, {
                offset, limit,
                skipAuthRefresh: true 
            });
            
            return {
                count: response.data.count,
                items: response.data.items.map((art: any) => ({ ...art, uploadedAt: new Date(art.uploadedAt) }))
            }
        }
        catch (err: any) 
        {
            if (err.response && err.response.status === 404) {
                throw new ArtNotFoundException();
            }
            throw err;
        }
    }
}
