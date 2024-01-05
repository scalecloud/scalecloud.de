export interface CheckoutCreateSubscriptionRequest {
    productID: string;
    quantity: number;
}

export interface CheckoutCreateSubscriptionReply {
    subscriptionID: string;
    clientSecret: string;
    quantity: number;
    email: string;
}