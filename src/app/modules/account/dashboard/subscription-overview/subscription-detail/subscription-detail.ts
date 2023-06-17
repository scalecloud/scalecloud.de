export interface ISubscriptionDetail {
    id: string;
    active: boolean;
    productName: string;
    productType: string;
    storageAmount: number;
    userCount: number;
    pricePerMonth: number;
    currency: string;
    cancelAtPeriodEnd: boolean;
    cancelAt: number;
}