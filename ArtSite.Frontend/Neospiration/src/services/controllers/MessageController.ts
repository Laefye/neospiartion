import { AxiosError } from "axios";
import type { Client } from "../api";
import type * as types from "../types";
import { ConversationNotFoundException } from "../interfaces/IMessageController";
import type { IMessageController } from "../interfaces/IMessageController";

export class MessageController implements IMessageController {
    private api: Client;
    private prefix: string = '/messages';

    
    constructor(api: Client) {
        this.api = api;
    }
    
    async getMessage(messageId: number): Promise<types.Message> {
        try {
            const response = await this.api.get(`${this.prefix}/${messageId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                throw new ConversationNotFoundException();
            }
            throw new Error(`Не удалось получить сообщение: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
        }
    }
}
