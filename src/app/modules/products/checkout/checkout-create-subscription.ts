export interface CheckoutCreateSubscriptionRequest {
    productID: string;
    quantity: number;
}

export interface CheckoutCreateSubscriptionReply {
    status: string;
    subscriptionID: string;
    productName: string;
    email: string;
    trialEnd: number;
}