import { Routes } from '@angular/router';



import { dashboardGuard } from './core/auth/guards/dashboard.guard';
import { checkoutGuard } from './shared/guard/checkout.guard';
import { loginGuard } from './core/auth/guards/login.guard';
import { registerGuard } from './core/auth/guards/register.guard';
import { forgotPasswordGuard } from './core/auth/guards/forgot-password.guard';
import { verifyEMailGuard } from './core/auth/guards/verify-email.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/default/default.component').then(m => m.DefaultComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/main/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'nextcloud',
        loadComponent: () => import('./modules/products/nextcloud/nextcloud.component').then(m => m.NextcloudComponent)
      },
      {
        path: 'synology',
        loadComponent: () => import('./modules/products/synology/synology.component').then(m => m.SynologyComponent)
      },
      {
        path: 'checkout',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./modules/products/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'checkout/status',
        loadComponent: () => import('./modules/products/checkout/status/status.component').then(m => m.StatusComponent)
      },
      // Account/Dashboard - Lazy Loaded
      {
        path: 'dashboard',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./modules/account/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./modules/account/dashboard/subscription-overview/subscription-detail/subscription-detail.component').then(m => m.SubscriptionDetailComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/add-seat',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./modules/account/dashboard/subscription-overview/subscription-detail/seats/add-seat/add-seat.component').then(m => m.AddSeatComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/:uid/seat-detail',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./modules/account/dashboard/subscription-overview/subscription-detail/seats/seat-detail/seat-detail.component').then(m => m.SeatDetailComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/billing-address',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./modules/account/dashboard/subscription-overview/subscription-detail/billing-address/billing-address-detail/billing-address-detail.component').then(m => m.BillingAddressDetailComponent)
      },
      {
        path: 'dashboard/change-payment',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./modules/account/dashboard/change-payment/change-payment.component').then(m => m.ChangePaymentComponent)
      },
      {
        path: 'dashboard/change-payment/status',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./modules/account/dashboard/subscription-overview/subscription-detail/status-payment-changed/status-payment-changed.component').then(m => m.StatusPaymentChangedComponent)
      },
      // Auth - Lazy Loaded
      {
        path: 'login',
        canActivate: [loginGuard],
        loadComponent: () => import('./modules/account/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [registerGuard],
        loadComponent: () => import('./modules/account/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'verify-email-address',
        canActivate: [verifyEMailGuard],
        loadComponent: () => import('./modules/account/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
      },
      {
        path: 'forgot-password',
        canActivate: [forgotPasswordGuard],
        loadComponent: () => import('./modules/account/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      // Footer - Lazy Loaded
      {
        path: 'privacy-policy',
        loadComponent: () => import('./modules/footer/privacy/privacy.component').then(m => m.PrivacyComponent)
      },
      {
        path: 'imprint',
        loadComponent: () => import('./modules/footer/imprint/imprint.component').then(m => m.ImprintComponent)
      },
      {
        path: 'terms',
        loadComponent: () => import('./modules/footer/terms/terms.component').then(m => m.TermsComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./modules/footer/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'legal',
        loadComponent: () => import('./modules/footer/legal/legal.component').then(m => m.LegalComponent)
      },
      // Newsletter - Lazy Loaded
      {
        path: 'newsletter/confirm/:verificationToken',
        loadComponent: () => import('./shared/components/newsletter/newsletter-confirm/newsletter-confirm.component').then(m => m.NewsletterConfirmComponent)
      },
      {
        path: 'newsletter/unsubscribe/:unsubscribeToken',
        loadComponent: () => import('./shared/components/newsletter/newsletter-unsubscribe/newsletter-unsubscribe.component').then(m => m.NewsletterUnsubscribeComponent)
      },
      // Wildcard
      { path: '**', loadComponent: () => import('./modules/main/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) }
    ]
  }
];
