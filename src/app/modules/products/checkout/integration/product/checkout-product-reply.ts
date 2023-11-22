export interface CheckoutProductReply {
    productID: string;
    name: string;
    storageAmount: number;
    storageUnit: string;
    trialDays: number;
    pricePerMonth: number;
    currency: string;
}