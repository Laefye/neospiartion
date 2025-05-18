import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { LocalStorageTokenService, type TokenStorage } from './token/TokenStorage';

export interface Client {
    get(path: string, params?: any): Promise<any>;
    post(path: string, data?: any): Promise<any>;
    put(path: string, data?: any): Promise<any>;
    delete(path: string, params?: any): Promise<any>;
}

export class DefaultClient implements Client {
    private api: AxiosInstance;
    tokenStorage: TokenStorage;
    private baseURL: string = 'http://localhost:5273';
    private prefix: string = this.baseURL + '/api';

    constructor() {
        this.api = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.tokenStorage = new LocalStorageTokenService();
    }

    private config(params?: any) {
        const token = this.tokenStorage.getToken();
        if (token) {
            return {
                params,
                headers: {
                    'Authorization': token,
                },
            }
        }
        return {
            params,
        }
    }

    get(path: string, params?: any): Promise<any> {
        return this.api.get(this.prefix + path, this.config(params));
    }

    post(path: string, data?: any): Promise<any> {
        return this.api.post(this.prefix + path, data);
    }

    put(path: string, data?: any): Promise<any> {
        return this.api.put(this.prefix + path, data);
    }

    delete(path: string, params?: any): Promise<any> {
        return this.api.delete(this.prefix + path, { params });
    }
}

export default new DefaultClient();