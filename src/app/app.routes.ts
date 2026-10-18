import { Routes } from '@angular/router';
import { dashboardGuard } from './core/auth/guards/dashboard-guard';
import { loginGuard } from './core/auth/guards/login-guard';
import { registerGuard } from './core/auth/guards/register-guard';
import { checkoutGuard } from './features/products/checkout-page/guard/checkout-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/default/default').then(m => m.Default),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home-page/home-page').then(m => m.HomePage)
      },
      {
        path: 'nextcloud',
        loadComponent: () => import('./features/products/nextcloud-page/nextcloud-page').then(m => m.NextcloudPage)
      },
      {
        path: 'synology',
        loadComponent: () => import('./features/products/synology-page/synology-page').then(m => m.SynologyPage)
      },
      {
        path: 'checkout',
        canActivate: [checkoutGuard],
        loadComponent: () => import('./features/products/checkout-page/checkout-page').then(m => m.CheckoutPage)
      },
      {
        path: 'checkout/status',
        loadComponent: () => import('./features/change-payment-status-page/change-payment-status-page').then(m => m.ChangePaymentStatusPage)
      },
      {
        path: 'claim-invite',
        loadComponent: () => import('./features/claim-invite/claim-invite-page').then(m => m.ClaimInvitePage)
      },
      {
        path: 'dashboard',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/dashboard-page/dashboard-page').then(m => m.DashboardPage)
      },
      {
        path: 'dashboard/subscription/:subscriptionID',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail-page/subscription-detail-page').then(m => m.SubscriptionDetailPage)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/add-seat',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail-page/seats/add-seat-page/add-seat-page').then(m => m.AddSeatPage)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/:uid/seat-detail',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail-page/seats/seat-detail-page/seat-detail-page').then(m => m.SeatDetailPage)
      },
      {
        path: 'dashboard/subscription/:subscriptionID/billing-address',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/subscription-detail-page/billing-address-client/billing-address-detail-page/billing-address-detail-page').then(m => m.BillingAddressDetailPage)
      },
      {
        path: 'dashboard/change-payment',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/dashboard-page/change-payment-page/change-payment-page').then(m => m.ChangePaymentPage)
      },
      {
        path: 'dashboard/change-payment/status',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./features/change-payment-status-page/change-payment-status-page').then(m => m.ChangePaymentStatusPage)
      },
      {
         path: 'login',
        canActivate: [loginGuard],
        children: []
      },
      {
        path: 'register',
        canActivate: [registerGuard],
        children: []
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./features/privacy-page/privacy-page').then(m => m.PrivacyPage)
      },
      {
        path: 'imprint',
        loadComponent: () => import('./features/imprint-page/imprint-page').then(m => m.ImprintPage)
      },
      {
        path: 'terms',
        loadComponent: () => import('./features/terms-page/terms-page').then(m => m.TermsPage)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact-page/contact-page').then(m => m.ContactPage)
      },
      {
        path: 'legal',
        loadComponent: () => import('./features/legal-page/legal-page').then(m => m.LegalPage)
      },
      {
        path: 'newsletter/confirm/:verificationToken',
        loadComponent: () => import('./features/newsletter-client/newsletter-confirm-page/newsletter-confirm-page').then(m => m.NewsletterConfirmPage)
      },
      {
        path: 'newsletter/unsubscribe/:unsubscribeToken',
        loadComponent: () => import('./features/newsletter-client/newsletter-unsubscribe-page/newsletter-unsubscribe-page').then(m => m.NewsletterUnsubscribePage)
      },
      { path: '**', loadComponent: () => import('./features/page-not-found-page/page-not-found-page').then(m => m.PageNotFoundPage) }
    ]
  }
];