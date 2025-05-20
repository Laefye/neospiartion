import type * as types from "../types";

export class CommentException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommentException";
    }
}

export class CommentNotFoundException extends CommentException {
    constructor() {
        super("Комментарий не найден");
    }
}

export class CommentNotAuthorException extends CommentException {
    constructor() {
        super("Вы не являетесь автором комментария");
    }
}

export class CommentNotCreatedException extends CommentException {
    constructor() {
        super("Комментарий не создан");
    }
}

export interface ICommentController {
    getComments(artId: number): Promise<types.Comment[]>;
    getComment(commentId: number): Promise<types.Comment>;
    addComment(artId: number, text: string): Promise<types.Comment>;
    deleteComment(commentId: number): Promise<void>;
    updateComment(commentId: number, text: string): Promise<types.Comment>;
}