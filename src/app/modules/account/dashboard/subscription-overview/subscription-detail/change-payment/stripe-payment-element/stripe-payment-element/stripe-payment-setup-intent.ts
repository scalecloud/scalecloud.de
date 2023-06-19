export interface InitStripePayment {
    intent: Intent;
    client_secret: string;
    customer_email: string;
}

export interface SubmitStripePayment {
    return_url: string;
}

export enum Intent {
    PaymentIntent,
    SetupIntent,
}