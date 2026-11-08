import { Routes } from '@angular/router';
import { dashboardGuard } from './core/auth/guards/dashboard-guard';
import { loginGuard } from './core/auth/guards/login-guard';
import { registerGuard } from './core/auth/guards/register-guard';
import { checkoutGuard } from './features/products/checkout-page/guard/checkout-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/default-layout/default-layout').then(m => m.DefaultLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home-page/home-page').then(m => m.HomePage)
      },
      {
        path: 'opencloud',
        loadComponent: () => import('./features/products/opencloud-page/opencloud-page').then(m => m.OpenCloudPage)
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
        canActivateChild: [dashboardGuard],
        data: { breadcrumb: 'Subscriptions' },
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () => import('./features/dashboard-page/dashboard-page').then(m => m.DashboardPage)
          },
          {
            path: 'subscription/:subscriptionID',
            data: { breadcrumb: 'Details' },
            children: [
              {
                path: '',
                pathMatch: 'full',
                loadComponent: () => import('./features/subscription-detail-page/subscription-detail-page').then(m => m.SubscriptionDetailPage)
              },
              {
                path: 'add-seat',
                data: { breadcrumb: 'Add seat' },
                loadComponent: () => import('./features/subscription-detail-page/seats/add-seat-page/add-seat-page').then(m => m.AddSeatPage)
              },
              {
                path: ':uid/seat-detail',
                data: { breadcrumb: 'Seat details' },
                loadComponent: () => import('./features/subscription-detail-page/seats/seat-detail-page/seat-detail-page').then(m => m.SeatDetailPage)
              },
              {
                path: 'billing-address',
                data: { breadcrumb: 'Billing address' },
                loadComponent: () => import('./features/subscription-detail-page/billing-address-client/billing-address-detail-page/billing-address-detail-page').then(m => m.BillingAddressDetailPage)
              }
            ]
          },
          {
            path: 'change-payment',
            data: { breadcrumb: 'Change payment' },
            children: [
              {
                path: '',
                pathMatch: 'full',
                loadComponent: () => import('./features/dashboard-page/change-payment-page/change-payment-page').then(m => m.ChangePaymentPage)
              },
              {
                path: 'status',
                data: { breadcrumb: 'Payment status' },
                loadComponent: () => import('./features/change-payment-status-page/change-payment-status-page').then(m => m.ChangePaymentStatusPage)
              }
            ]
          }
        ]
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