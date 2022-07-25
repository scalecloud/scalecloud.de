export interface CheckoutIntegrationRequest {
    productID: string;
    quantity: number;
}

export interface CheckoutIntegrationReply {
    subscriptionID: string;
    clientSecret: string;
    quantity: number;
}

export interface CheckoutIntegrationUpdateRequest {
    subscriptionID: string;
    quantity: number;
}

export interface CheckoutIntegrationUpdateReply {
    subscriptionID: string;
    clientSecret: string;
    quantity: number;
}