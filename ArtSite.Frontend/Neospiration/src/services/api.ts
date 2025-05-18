import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { LocalStorageTokenService, type TokenStorage } from './token/TokenStorage';

export interface Client {
    get url(): string;

    get(path: string, params?: any): Promise<any>;
    post(path: string, data?: any): Promise<any>;
    postFormData(path: string, data?: FormData): Promise<any>;
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
    
    get url(): string {
        return this.prefix;
    }

    async postFormData(path: string, data?: FormData): Promise<any> {
        return this.api.post(this.prefix + path, data, this.config(null, {
            'Content-Type': 'multipart/form-data',
        }));
    }

    private config(params?: any, headers: any = {}): any {
        const token = this.tokenStorage.getToken();
        if (token) {
            return {
                params,
                headers: {
                    'Authorization': token,
                    ...headers,
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
        return this.api.post(this.prefix + path, data, this.config());
    }

    put(path: string, data?: any): Promise<any> {
        return this.api.put(this.prefix + path, data, this.config());
    }

    delete(path: string, params?: any): Promise<any> {
        return this.api.delete(this.prefix + path, this.config(params));
    }
}

export default new DefaultClient();