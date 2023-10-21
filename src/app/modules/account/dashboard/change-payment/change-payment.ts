export interface ChangePaymentRequest {
    subscriptionid: string;
}

export interface ChangePaymentReply {
    setupintentid: string;
    clientsecret: string;
    email: string;
}