export enum NewsletterStatus {
    ACTIVE = 'active',
    PENDING = 'pending',
    BOUNCED = 'bounced',
}

export enum NewsletterSubscribeReplyStatus {
    SUCCESS = 'success',
    INVALID_EMAIL = 'invalid_email',
    RATE_LIMIT = 'rate_limited',
}

export interface NewsletterSubscribeRequest {
    email: string;
}

export interface NewsletterSubscribeReply {
    newsletterSubscribeReplyStatus: NewsletterSubscribeReplyStatus;
    email: string;
}

export interface NewsletterConfirmRequest {
    verificationToken: string;
}

export interface NewsletterConfirmReply {
    confirmed: boolean;
}

export interface NewsletterUnsubscribeRequest {
    unsubscribeToken: string;
}

export enum NewsletterUnsubscribeReplyStatus {
    UNSUBSCRIBED = 'unsubscribed',
    NOTFOUND = 'not_found',
}

export interface NewsletterUnsubscribeReply {
    newsletterUnsubscribeReplyStatus: NewsletterUnsubscribeReplyStatus;
}