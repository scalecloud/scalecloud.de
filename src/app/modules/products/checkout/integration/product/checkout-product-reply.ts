export interface CheckoutProductReply {
    subscriptionID: string;
    productID: string;
    name: string;
    storageAmount: number;
    storageUnit: string;
    trialDays: number;
    pricePerMonth: number;
    currency: string;
}