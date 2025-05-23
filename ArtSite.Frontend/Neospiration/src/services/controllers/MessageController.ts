import type { Client } from "../api";
import type * as types from "../types";
import { ConversationNotFoundException } from "../interfaces/IMessageController";
import type { IMessageController } from "../interfaces/IMessageController";

export class MessageController implements IMessageController {
    api: Client;
    
    constructor(api: Client) {
        this.api = api;
    }

    async getConversations(profileId: number): Promise<types.Conversation[]> {
        try {
            const response = await this.api.get(`/api/profiles/${profileId}/conversations`);
            return response.data.map((conv: any) => ({
                ...conv,
                updatedAt: new Date(conv.updatedAt || Date.now()),
                lastMessage: conv.lastMessage ? {
                    ...conv.lastMessage,
                    createdAt: new Date(conv.lastMessage.createdAt)
                } : undefined
            }));
        } catch (error) {
            console.error("Error fetching conversations:", error);
            return [];
        }
    }
    
    async getOrCreateConversation(profileId: number, otherProfileId: number): Promise<types.Conversation> {
        try {
            const conversations = await this.getConversations(profileId);
            const existingConversation = conversations.find(conv => 
                conv.participants.some(p => p.id === otherProfileId)
            );
            
            if (existingConversation) {
                return existingConversation;
            }
            
            await this.sendMessage(profileId, otherProfileId, " ");
            
            const updatedConversations = await this.getConversations(profileId);
            const newConversation = updatedConversations.find(conv => 
                conv.participants.some(p => p.id === otherProfileId)
            );
            
            if (!newConversation) {
                throw new ConversationNotFoundException();
            }
            
            return newConversation;
        } catch (error) {
            console.error("Error creating conversation:", error);
            throw error;
        }
    }

    async getMessages(senderProfileId: number, receiverProfileId: number, limit: number = 50, offset: number = 0): Promise<types.Message[]> {
        try {
            const response = await this.api.get(`/api/profiles/${senderProfileId}/conversations/${receiverProfileId}/messages`, {
                params: { limit, offset }
            });
            
            return response.data.map((msg: any) => ({
                ...msg,
                createdAt: new Date(msg.createdAt)
            }));
        } catch (error) {
            console.error("Error fetching messages:", error);
            return [];
        }
    }

    async sendMessage(senderProfileId: number, receiverProfileId: number, text: string): Promise<types.Message> {
        try {
            const response = await this.api.post(`/api/profiles/${senderProfileId}/conversations/${receiverProfileId}/messages`, { 
                text 
            });
            
            return {
                ...response.data,
                createdAt: new Date(response.data.createdAt)
            };
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    async markAsRead(senderProfileId: number, receiverProfileId: number): Promise<void> {
        try {
            await this.api.post(`/api/profiles/${senderProfileId}/conversations/${receiverProfileId}/read`);
        } catch (error) {
            console.error("Error marking messages as read:", error);
        }
    }
}
