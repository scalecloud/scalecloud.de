export interface SubscriptionSetupIntentRequest {
    subscriptionid: string;
}

export interface SubscriptionSetupIntentReply {
    setupintentid: string;
    secret: string;
}