import type * as types from "../types";

export class UserException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "UserException";
    }
}

export class InvalidCredentialsException extends UserException {
    constructor() {
        super("Неверный E-Mail или пароль");
    }
}

export class InvalidRegistrationDataException extends UserException {
    constructor(message: string) {
        super(message);
    }
}

export class InvalidTokenException extends UserException {
    constructor() {
        super("Неверный токен");
    }
}

export interface IUserController {
    register(value: types.Register): Promise<types.SafeUser>;

    authenticate(value: types.Login): Promise<types.Token>;

    me(): Promise<types.Me>;

    updateProfile(value: types.UpdateUser): Promise<void>;
}