export interface SubscriptionPaymentMethodRequest {
    id: string;
}

export interface SubscriptionPaymentMethodReply {
    id: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}