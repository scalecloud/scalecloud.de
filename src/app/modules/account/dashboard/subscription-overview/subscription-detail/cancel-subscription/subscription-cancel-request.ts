export interface ISubscriptionCancelRequest {
    subscriptionID: string;
}

export interface ISubscriptionCancelReply {
    subscriptionID: string;
    cancel_at_period_end: boolean;
    cancel_at: number;
}