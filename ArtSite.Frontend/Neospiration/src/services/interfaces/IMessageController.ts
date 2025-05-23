import type * as types from "../types";

export class MessageException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MessageException";
    }
}

export class ConversationNotFoundException extends MessageException {
    constructor() {
        super("Беседа не найдена");
    }
}

export interface IMessageController {
    getConversations(profileId: number): Promise<types.Conversation[]>;
    getOrCreateConversation(profileId: number, otherProfileId: number): Promise<types.Conversation>;
    getMessages(senderProfileId: number, receiverProfileId: number, limit?: number, offset?: number): Promise<types.Message[]>;
    sendMessage(senderProfileId: number, receiverProfileId: number, text: string): Promise<types.Message>;
    markAsRead(senderProfileId: number, receiverProfileId: number): Promise<void>;
}
