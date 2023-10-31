export interface PaymentMethodOverviewSEPADebit {
    bank_code: string;
    branch: string;
    country: string;
    last4: string;
}

export interface PaymentMethodOverviewCard {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}

export interface PaymentMethodOverviewPayPal {
    email: string;
}

export interface PaymentMethodOverviewReply {
    type: string;
    card: PaymentMethodOverviewCard;
    sepa_debit: PaymentMethodOverviewSEPADebit;
    paypal: PaymentMethodOverviewPayPal;
}