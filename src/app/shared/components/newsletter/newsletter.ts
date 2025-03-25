export enum NewsletterStatus {
    SUBSCRIBED = 'SUBSCRIBED',
    UNSUBSCRIBED = 'UNSUBSCRIBED',
    CONFIRM_AWAITING = 'CONFIRM_AWAITING',
}

export enum NewsletterSubscribeReplyStatus {
    SUCCESS = 'SUCCESS',
    INVALID_EMAIL = 'INVALID_EMAIL',
}

export interface NewsletterSubscribeRequest {
    email: string;
}

export interface NewsletterSubscribeReply {
    newsletterSubscribeReplyStatus: NewsletterSubscribeReplyStatus;
    email: string;
}

export interface NewsletterConfirmRequest {
    newsletterUUID: string;
}

export interface NewsletterConfirmReply {
    confirmed: boolean;
}

export interface NewsletterUnsubscribeRequest {
    newsletterUUID: string;
}

export interface NewsletterUnsubscribeReply {
    unsubscribed: boolean;
}