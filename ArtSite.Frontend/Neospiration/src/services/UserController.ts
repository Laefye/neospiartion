import { AxiosError } from "axios";
import type { Client } from "./api";
import { InvalidCredentialsException, InvalidRegistrationDataException, InvalidTokenException, type IUserController } from "./interfaces/IUserController";
import type { Register, SafeUser, Login, Token, Me, UpdateUser } from "./types";

export class UserController implements IUserController {
    api: Client;
    private prefix: string = '/user';
    
    constructor(api: Client) {
        this.api = api;
    }

    async register(value: Register): Promise<SafeUser> {
        try {
            const { data } = await this.api.post(this.prefix, value);
            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400 && error.response?.data?.detail === "Passwords must have at least one non alphanumeric character.") {
                    throw new InvalidRegistrationDataException("Пароль должен содержать хотя бы один специальный символ");
                } else if (
                    error.response?.status === 400 &&
                    typeof error.response?.data?.detail === "string" &&
                    /^Username '.+' is invalid, can only contain letters or digits\.$/.test(error.response.data.detail)
                ) {
                    throw new InvalidRegistrationDataException("Имя пользователя может содержать только буквы или цифры");
                } else if (error.response?.status === 400 && error.response?.data?.detail == 'User already exists') {
                    throw new InvalidRegistrationDataException("Имя пользователя или почта уже занято");
                } else if (error.response?.status === 400 && error.response?.data?.detail == 'Passwords must have at least one lowercase (\'a\'-\'z\').') {
                    throw new InvalidRegistrationDataException("Пароль должен содержать хотя бы одну строчную букву");
                } else if (error.response?.status === 400 && error.response?.data?.detail == 'Passwords must have at least one uppercase (\'A\'-\'Z\').') {
                    throw new InvalidRegistrationDataException("Пароль должен содержать хотя бы одну заглавную букву");
                } else if (error.response?.status === 400 && error.response?.data?.detail == 'Passwords must have at least one digit (\'0\'-\'9\').') {
                    throw new InvalidRegistrationDataException("Пароль должен содержать хотя бы одну цифру");
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
                    throw new InvalidCredentialsException();
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

    updateProfile(value: UpdateUser): Promise<void> {
        throw new Error("Method not implemented.");
    }
}