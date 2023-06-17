export interface ISubscriptionResumeRequest {
    id: string;
}

export interface ISubscriptionResumeReply {
    id: string;
    cancel_at_period_end: boolean;
}