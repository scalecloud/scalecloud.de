export interface ISubscriptionCancelReply {
    id: string;
    cancel_at_period_end: boolean;
    cancel_at: number;
}