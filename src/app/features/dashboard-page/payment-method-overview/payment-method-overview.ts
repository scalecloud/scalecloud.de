export interface PaymentMethodOverviewCard {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
}

export interface PaymentMethodOverviewSEPADebit {
    country: string;
    last4: string;
}

export interface PaymentMethodOverviewPayPal {
    email: string;
}

export interface PaymentMethodOverviewReply {
    has_valid_payment_method: boolean;
    type: string;
    card: PaymentMethodOverviewCard;
    sepa_debit: PaymentMethodOverviewSEPADebit;
    paypal: PaymentMethodOverviewPayPal;
}