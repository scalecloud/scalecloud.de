import { Routes } from '@angular/router';



import { dashboardGuard } from './core/auth/guards/dashboard.guard';
import { loginGuard } from './core/auth/guards/login.guard';
import { registerGuard } from './core/auth/guards/register.guard';
import { forgotPasswordGuard } from './core/auth/guards/forgot-password.guard';
import { verifyEMailGuard } from './core/auth/guards/verify-email.guard';
import { checkoutGuard } from './features/products/checkout/guard/checkout.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/default/default.component').then(m => m.DefaultComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'nextcloud',
        loadComponent: () => import('./features/products/nextcloud/nextcloud.component').then(m => m.NextcloudComponent)
      },
      {
        path: 'synology',
        loadComponent: () => import('./features/products/synology/synology.component').then(m => m.SynologyComponent)
      },
      {
        path: 'checkout',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./features/products/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'checkout/status',
        loadComponent: () => import('./features/products/checkout/status/status.component').then(m => m.StatusComponent)
      },
      // Account/Dashboard - Lazy Loaded
      {
        path: 'dashboard',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail/subscription-detail.component').then(m => m.SubscriptionDetailComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/add-seat',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail/seats/add-seat/add-seat.component').then(m => m.AddSeatComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/:uid/seat-detail',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail/seats/seat-detail/seat-detail.component').then(m => m.SeatDetailComponent)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/billing-address',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail/billing-address/billing-address-detail/billing-address-detail.component').then(m => m.BillingAddressDetailComponent)
      },
      {
        path: 'dashboard/change-payment',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/dashboard/change-payment/change-payment.component').then(m => m.ChangePaymentComponent)
      },
      {
        path: 'dashboard/change-payment/status',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/dashboard/change-payment/status/status.component').then(m => m.StatusComponent)
      },
      // Auth - Lazy Loaded
      {
        path: 'login',
        canActivate: [loginGuard],
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [registerGuard],
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'verify-email-address',
        canActivate: [verifyEMailGuard],
        loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
      },
      {
        path: 'forgot-password',
        canActivate: [forgotPasswordGuard],
        loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      // Footer - Lazy Loaded
      {
        path: 'privacy-policy',
        loadComponent: () => import('./features/privacy/privacy.component').then(m => m.PrivacyComponent)
      },
      {
        path: 'imprint',
        loadComponent: () => import('./features/imprint/imprint.component').then(m => m.ImprintComponent)
      },
      {
        path: 'terms',
        loadComponent: () => import('./features/terms/terms.component').then(m => m.TermsComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'legal',
        loadComponent: () => import('./features/legal/legal.component').then(m => m.LegalComponent)
      },
      // Newsletter - Lazy Loaded
      {
        path: 'newsletter/confirm/:verificationToken',
        loadComponent: () => import('./features/newsletter/newsletter-confirm/newsletter-confirm.component').then(m => m.NewsletterConfirmComponent)
      },
      {
        path: 'newsletter/unsubscribe/:unsubscribeToken',
        loadComponent: () => import('./features/newsletter/newsletter-unsubscribe/newsletter-unsubscribe.component').then(m => m.NewsletterUnsubscribeComponent)
      },
      // Wildcard
      { path: '**', loadComponent: () => import('./features/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) }
    ]
  }
];
