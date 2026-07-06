export interface Invoice {
    invoiceID: string;
    subscriptionID: string;
    created: number;
    total: number;
    currency: string;
    status: InvoiceStatus;
    invoice_pdf: string;
}

export interface ListInvoicesRequest {
    subscriptionID: string;
    pageSize: number;
    startingAfter?: string;
    endingBefore?: string;
}

export interface ListInvoicesReply {
    subscriptionID: string;
    invoices: Invoice[];
    totalResults: number;
}

export enum InvoiceStatus {
    Draft = "draft",
    Open = "open",
    Paid = "paid",
    Uncollectible = "uncollectible",
    Void = "void"
}