import type * as types from "../types";

export class CommissionException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "CommissionException";
    }
}

export class CommissionNotFoundException extends CommissionException {
    constructor() {
        super("Коммишка не найдена");
    }
}

export interface ICommissionController {
    getCommission(commissionId: number): Promise<types.Commission>;
    deleteCommission(commissionId: number): Promise<void>;
    updateCommission(commissionId: number, data: types.CommissionDto): Promise<void>;
    
    getCommissionImageUrl(commissionId: number): string;
    uploadCommissionImage(commissionId: number, file: File): Promise<void>;
    deleteCommissionImage(commissionId: number): Promise<void>;
    
    getProfileCommissions(profileId: number): Promise<types.Commission[]>;
    createCommission(profileId: number, data: types.CommissionDto): Promise<types.Commission>;
}