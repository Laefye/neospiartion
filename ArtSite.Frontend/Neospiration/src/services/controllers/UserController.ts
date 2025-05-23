import { AxiosError } from "axios";
import type { Client } from "../api";
import { AlreadyUsedException, InvalidRegistrationDataException, InvalidTokenException, type IUserController } from "../interfaces/IUserController";
import type { Register, SafeUser, Login, Token, Me, UpdateUser } from "../types";

export class UserController implements IUserController {
    api: Client;
    private prefix: string = '/user';
    
    constructor(api: Client) {
        this.api = api;
    }

    private translateError(error: string) {
        if (error === "Passwords must have at least one non alphanumeric character.") {
            return "Пароль должен содержать хотя бы один специальный символ";
        } else if (
            typeof error === "string" &&
            /^Username '.+' is invalid, can only contain letters or digits\.$/.test(error)
        ) {
            return "Имя пользователя может содержать только буквы или цифры";
        } else if (error === "Passwords must have at least one lowercase ('a'-'z').") {
            return "Пароль должен содержать хотя бы одну строчную букву";
        } else if (error === "Passwords must have at least one uppercase ('A'-'Z').") {
            return "Пароль должен содержать хотя бы одну заглавную букву";
        } else if (error === "Passwords must have at least one digit ('0'-'9').") {
            return "Пароль должен содержать хотя бы одну цифру";
        }
        return error;
    }

    async register(value: Register): Promise<SafeUser> {
        try {
            const { data } = await this.api.post(this.prefix, value);
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400 && error.response?.data?.detail === "Form errors") {
                    throw new InvalidRegistrationDataException("Содержит несколько ошибок:", error.response?.data?.errors.map((e: string) => this.translateError(e)));
                } else if (error.response?.status === 400 && error.response?.data?.detail === "User already exists") {
                    throw new AlreadyUsedException();
                }
            }
            throw error;
        }

    }

    async authenticate(value: Login): Promise<Token> {
        try {
            const { data } = await this.api.post(this.prefix + '/authentication', value);
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401 && error.response?.data?.detail === "Invalid email or password") {
                    throw new AlreadyUsedException();
                }
            }
            throw error;
        }
    }

    async me(): Promise<Me> {
        try {
            const { data } = await this.api.get(this.prefix + '/me');
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    throw new InvalidTokenException();
                }
            }
            throw error;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateProfile(value: UpdateUser): Promise<void> {
        throw new Error("Method not implemented.");
    }
}