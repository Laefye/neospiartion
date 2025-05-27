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
    getMessage(messageId: number): Promise<types.Message>;
}
