export interface InitStripePayment {
    intent: StripeIntent;
    client_secret: string;
    email: string;
}

export interface SubmitStripePayment {
    return_url: string;
}

export enum StripeIntent {
    PaymentIntent,
    SetupIntent,
}