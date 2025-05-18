export interface TokenStorage {
    setToken(token: string): void;
    getToken(): string | null;
    removeToken(): void;
    isAuthenticated(): boolean;
}

export class LocalStorageTokenService implements TokenStorage {
    private readonly tokenKey: string = 'token';
    
    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }
    
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
    
    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }
}

const tokenService = new LocalStorageTokenService();

export default tokenService;
