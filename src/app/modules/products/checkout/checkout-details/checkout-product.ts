export interface CheckoutProductRequest {
    productID: string;
}

export interface CheckoutProductReply {
    productID: string;
    name: string;
    storageAmount: number;
    storageUnit: string;
    trialDays: number;
    pricePerMonth: number;
    currency: string;
    has_valid_payment_method: boolean;
}