export interface CheckoutIntegrationRequest {
    productID: string;
    quantity: number;
}

export interface CheckoutIntegrationReturn {
    subscriptionID: string;
    clientSecret: string;
    quantity: number;
}

export interface CheckoutIntegrationUpdateRequest {
    subscriptionID: string;
    quantity: number;
}

export interface CheckoutIntegrationUpdateReturn {
    subscriptionID: string;
    clientSecret: string;
    quantity: number;
}