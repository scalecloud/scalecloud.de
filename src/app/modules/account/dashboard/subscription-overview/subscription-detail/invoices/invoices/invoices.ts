export interface Invoice {
    invoiceID: string;
    subscriptionID: string;
    created: number;
    total: number;
    currency: string;
    status: InvoiceStatus;
    hosted_invoice_url: string;
}

export interface ListInvoicesRequest {
    subscriptionID: string;
    pageIndex: number;
    pageSize: number;
}

export interface ListInvoicesReply {
    subscriptionID: string;
    invoices: Invoice[];
    pageIndex: number;
    totalResults: number;
}

export enum InvoiceStatus {
    Draft = "draft",
    Open = "open",
    Paid = "paid",
    Uncollectible = "uncollectible",
    Void = "void"
}