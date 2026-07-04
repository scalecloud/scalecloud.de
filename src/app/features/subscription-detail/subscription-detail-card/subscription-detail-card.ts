export interface SubscriptionDetailReply {
    id: string;
    active: boolean;
    product_name: string;
    product_type: string;
    storage_amount: number;
    user_count: number;
    price_per_month: number;
    currency: string;
    cancel_at_period_end: boolean;
    cancel_at: number;
    status: string;
    trial_end: number;
    current_period_end: number;
}