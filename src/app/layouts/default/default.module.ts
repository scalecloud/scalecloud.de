import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { HomeComponent } from 'src/app/modules/main/home/home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { NextcloudComponent } from 'src/app/modules/products/nextcloud/nextcloud.component';
import { SynologyComponent } from 'src/app/modules/products/synology/synology.component';
import { PrivacyComponent } from 'src/app/modules/footer/privacy/privacy.component';
import { ImprintComponent } from 'src/app/modules/footer/imprint/imprint.component';
import { LegalComponent } from 'src/app/modules/footer/legal/legal.component';
import { ContactComponent } from 'src/app/modules/footer/contact/contact.component';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionCardComponent } from 'src/app/modules/products/subscription-card/subscription-card.component';
import { TitelCardComponent } from 'src/app/modules/products/titel-card/titel-card.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginComponent } from 'src/app/modules/account/login/login.component';
import { RegisterComponent } from 'src/app/modules/account/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from 'src/app/modules/account/verify-email/verify-email.component';
import { DashboardComponent } from 'src/app/modules/account/dashboard/dashboard.component';
import { GlobeComponent } from 'src/app/modules/main/globe/globe.component';
import { ForgotPasswordComponent } from 'src/app/modules/account/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from 'src/app/modules/main/page-not-found/page-not-found.component';
import { SubscriptionOverviewComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-overview.component';
import { PasswordStrengthComponent } from 'src/app/modules/account/register/password-strength/password-strength.component';
import { PasswordMatchComponent } from 'src/app/modules/account/register/password-match/password-match.component';
import { TermsComponent } from 'src/app/modules/footer/terms/terms.component';
import { QuantityComponent } from 'src/app/modules/products/subscription-card/quantity/quantity.component';
import { CheckoutDetailsComponent } from 'src/app/modules/products/checkout/integration/checkout-details/checkout-details.component';
import { CheckoutComponent } from 'src/app/modules/products/checkout/integration/checkout.component';
import { StatusComponent } from 'src/app/modules/products/checkout/status/status.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChangePaymentComponent } from 'src/app/modules/account/dashboard/change-payment/change-payment.component';
import { SubscriptionDetailComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/subscription-detail.component';
import { SubscriptionDetailCardComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/subscription-detail-card/subscription-detail-card.component';
import { BillingPortalComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/customer-portal/billing-portal.component';
import { PaymentOverviewComponent } from 'src/app/modules/account/dashboard/payment-overview/payment-overview.component';
import { MatDialogModule } from '@angular/material/dialog';
import { StatusPaymentChangedComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/status-payment-changed/status-payment-changed.component';
import { PaymentChangedProcessingComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/status-payment-changed/payment-changed-processing/payment-changed-processing.component';
import { PaymentChangedRequiresPaymentMethodComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/status-payment-changed/payment-changed-requires-payment-method/payment-changed-requires-payment-method.component';
import { PaymentChangedSucceededComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/status-payment-changed/payment-changed-succeeded/payment-changed-succeeded.component';
import { TrailingComponent } from 'src/app/modules/products/checkout/status/trailing/trailing.component';
import { ActiveComponent } from 'src/app/modules/products/checkout/status/active/active.component';
import { SeatsComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/seats/seats.component';
import { AddSeatComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/seats/add-seat/add-seat.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { SeatDetailComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/seats/seat-detail/seat-detail.component';
import { ConfirmOwnerTransferComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/seats/seat-detail/confirm-owner-transfer/confirm-owner-transfer.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CancelStateComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/cancel-state/cancel-state.component';
import { CancelSubscriptionComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/cancel-state/cancel-subscription/cancel-subscription.component';
import { ConfirmCancelSubscriptionComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/cancel-state/cancel-subscription/confirm-cancel-subscription/confirm-cancel-subscription.component';
import { ConfirmResumeSubscriptionComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/cancel-state/resume-subscription/confirm-resume-subscription/confirm-resume-subscription.component';
import { ResumeSubscriptionComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-detail/cancel-state/resume-subscription/resume-subscription.component';
import { ServiceErrorInterceptorService } from 'src/app/shared/interceptors/service-error-interceptor.service';

@NgModule({
    declarations: [
        DefaultComponent,
        HomeComponent,
        TitelCardComponent,
        SubscriptionCardComponent,
        QuantityComponent,
        NextcloudComponent,
        SynologyComponent,
        PrivacyComponent,
        ImprintComponent,
        LegalComponent,
        TermsComponent,
        ContactComponent,
        LoginComponent,
        RegisterComponent,
        PasswordStrengthComponent,
        PasswordMatchComponent,
        VerifyEmailComponent,
        DashboardComponent,
        CancelStateComponent,
        ResumeSubscriptionComponent,
        CancelSubscriptionComponent,
        PaymentOverviewComponent,
        ChangePaymentComponent,
        ForgotPasswordComponent,
        GlobeComponent,
        PageNotFoundComponent,
        SubscriptionOverviewComponent,
        SubscriptionDetailComponent,
        SubscriptionDetailCardComponent,
        SeatsComponent,
        AddSeatComponent,
        SeatDetailComponent,
        ConfirmOwnerTransferComponent,
        BillingPortalComponent,
        CheckoutComponent,
        CheckoutDetailsComponent,
        StatusComponent,
        ActiveComponent,
        TrailingComponent,
        StatusPaymentChangedComponent,
        PaymentChangedSucceededComponent,
        PaymentChangedProcessingComponent,
        PaymentChangedRequiresPaymentMethodComponent,
        ConfirmResumeSubscriptionComponent,
        ConfirmCancelSubscriptionComponent,
    ], imports: [CommonModule,
        RouterModule,
        SharedModule,
        MatSidenavModule,
        MatDividerModule,
        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDialogModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        MatPaginatorModule,
        NgxSkeletonLoaderModule,
        ], providers: [
            provideHttpClient(withInterceptorsFromDi()),
            { provide: HTTP_INTERCEPTORS, useClass: ServiceErrorInterceptorService, multi: true }
        ]
})
export class DefaultModule { }
