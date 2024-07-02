export interface ISubscriptionResumeRequest {
    subscriptionID: string;
}

export interface ISubscriptionResumeReply {
    subscriptionID: string;
    cancel_at_period_end: boolean;
}