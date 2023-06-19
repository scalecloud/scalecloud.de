export interface InitStripePaymentSetupIntent {
    intent: Intent;
    client_secret: string;
}

export interface SubmitPaymentSetupIntent {
    return_url: string;
}

export enum Intent {
    PaymentIntent,
    SetupIntent,
}