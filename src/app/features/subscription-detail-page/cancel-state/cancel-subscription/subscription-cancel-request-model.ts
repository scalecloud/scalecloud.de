export interface SubscriptionCancelRequest {
    subscriptionID: string;
}

export interface SubscriptionCancelReply {
    subscriptionID: string;
    cancel_at_period_end: boolean;
    cancel_at: number;
}