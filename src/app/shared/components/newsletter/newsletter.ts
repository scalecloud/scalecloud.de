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
    uid: string;
}

export interface NewsletterConfirmReply {
    confirmed: boolean;
}

export interface NewsletterUnsubscribeRequest {
    uid: string;
}

export interface NewsletterUnsubscribeReply {
    unsubscribed: boolean;
}