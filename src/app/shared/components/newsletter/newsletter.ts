export enum NewsletterStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    BOUNCED = 'bounced',
}

export enum NewsletterSubscribeReplyStatus {
    SUCCESS = 'success',
    INVALID_EMAIL = 'invalid_email',
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