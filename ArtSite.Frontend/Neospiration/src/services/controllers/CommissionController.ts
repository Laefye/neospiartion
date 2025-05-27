import { AxiosError } from "axios";
import type { Client } from "../api";
import type * as types from "../types";
import { 
    CommissionNotFoundException,
    type ICommissionController
} from "../interfaces/ICommissionController";

export class CommissionController implements ICommissionController {
    private api: Client;
    private prefix: string = '/commissions';
    
    constructor(api: Client) {
        this.api = api;
    }

    async getCommission(commissionId: number): Promise<types.Commission> {
        try {
            const { data } = await this.api.get(`${this.prefix}/${commissionId}`);
            return {
                ...data,
                createdAt: new Date(data.createdAt)
            };
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                throw new CommissionNotFoundException();
            }
            throw error;
        }
    }

    async deleteCommission(commissionId: number): Promise<void> {
        try {
            await this.api.delete(`${this.prefix}/${commissionId}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new CommissionNotFoundException();
                }
                if (error.response?.status === 400) {
                    throw new Error("Некорректный запрос при удалении коммишки");
                }
            }
            throw error;
        }
    }

    async updateCommission(commissionId: number, data: types.CommissionDto): Promise<void> {
        try {
            await this.api.put(`${this.prefix}/${commissionId}`, data);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new CommissionNotFoundException();
                }
                if (error.response?.status === 400) {
                    throw new Error("Некорректные данные при обновлении коммишки");
                }
            }
            throw error;
        }
    }

    getCommissionImageUrl(commissionId: number): string {
        return `${this.api.url}/commissions/${commissionId}/image?timestamp=${Date.now()}`;
    }

    async uploadCommissionImage(commissionId: number, file: File): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            await this.api.postFormData(`${this.prefix}/${commissionId}/image`, formData);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new CommissionNotFoundException();
                }
                if (error.response?.status === 400) {
                    throw new Error("Некорректный формат файла");
                }
            }
            throw error;
        }
    }

    async deleteCommissionImage(commissionId: number): Promise<void> {
        try {
            await this.api.delete(`${this.prefix}/${commissionId}/image`);
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new CommissionNotFoundException();
                }
                if (error.response?.status === 400) {
                    throw new Error("Ошибка при удалении изображения");
                }
            }
            throw error;
        }
    }

    async getProfileCommissions(profileId: number): Promise<types.Commission[]> {
        try {
            const { data } = await this.api.get(`/profiles/${profileId}/commissions`);
            return data.map((commission: any) => ({
                ...commission,
                createdAt: new Date(commission.createdAt)
            }));
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                throw new Error("Профиль не найден");
            }
            throw error;
        }
    }

    async createCommission(profileId: number, data: types.CommissionDto): Promise<types.Commission> {
        try {
            const response = await this.api.post(`/profiles/${profileId}/commissions`, data);
            return {
                ...response.data,
                createdAt: new Date(response.data.createdAt)
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    throw new Error("Профиль для создания не найден");
                }
                if (error.response?.status === 400) {
                    throw new Error("Некорректные данные коммишки");
                }
                if (error.response?.status === 403) {
                    throw new Error("У вас нет прав для создания коммишки для этого профиля");
                }
            }
            throw error;
        }
    }
}
