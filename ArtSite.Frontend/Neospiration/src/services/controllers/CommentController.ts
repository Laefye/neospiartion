import { AxiosError } from "axios";
import type { Client } from "../api";
import type * as types from "../types";
import type { ICommentController } from "../interfaces/ICommentController";
import { CommentNotFoundException, CommentNotAuthorException, CommentNotCreatedException } from "../interfaces/ICommentController";

export class CommentController implements ICommentController {
    api: Client;
    private prefix: string = '/comments';
    
    constructor(api: Client) {
        this.api = api;
    }
    
    async deleteComment(commentId: number): Promise<void> {
        try {
            await this.api.delete(`/comments/${commentId}`);
        } catch (err: any) {
            if (err.response) {
                if (err.response.status === 404) {
                    throw new CommentNotFoundException();
                } else if (err.response.status === 403) {
                    throw new CommentNotAuthorException();
                }
            }
            throw err;
        }
    }

    async getComment(commentId: number): Promise<types.Comment> {
        try {
            const { data } = await this.api.get(this.prefix + '/' + commentId);
            return data;
        } catch (error: any) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new CommentNotFoundException();
                }
            }
            throw error;
        }
    }

    async updateComment(commentId: number, text: string): Promise<types.Comment> {
        try {
            const response = await this.api.put(`/api/comments/${commentId}`, { text });
            return response.data;
        }
        catch (error: any) {
            if (error.response) {
                if (error.response.status === 400) {
                    throw new CommentNotCreatedException();
                } else if (error.response.status === 404) {
                    throw new CommentNotFoundException();
                } else if (error.response.status === 403) {
                    throw new CommentNotAuthorException();
                }
            }
            throw error;
        }
    }
}
