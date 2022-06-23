import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { DashboardComponent } from './modules/account/dashboard/dashboard.component';
import { SubscriptionDetailComponent } from './modules/account/dashboard/subscription-detail/subscription-detail.component';
import { ForgotPasswordComponent } from './modules/account/forgot-password/forgot-password.component';
import { LoginComponent } from './modules/account/login/login.component';
import { RegisterComponent } from './modules/account/register/register.component';
import { VerifyEmailComponent } from './modules/account/verify-email/verify-email.component';
import { ContactComponent } from './modules/footer/contact/contact.component';
import { ImprintComponent } from './modules/footer/imprint/imprint.component';
import { LegalComponent } from './modules/footer/legal/legal.component';
import { PrivacyComponent } from './modules/footer/privacy/privacy.component';
import { TermsComponent } from './modules/footer/terms/terms.component';
import { HomeComponent } from './modules/main/home/home.component';
import { PageNotFoundComponent } from './modules/main/page-not-found/page-not-found.component';
import { CancelComponent } from './modules/products/checkout/cancel/cancel.component';
import { SuccessComponent } from './modules/products/checkout/success/success.component';
import { NextcloudComponent } from './modules/products/nextcloud/nextcloud.component';
import { SynologyComponent } from './modules/products/synology/synology.component';
import { DashboardGuard } from './shared/guard/dashboard.guard';
import { ForgotPasswordGuard } from './shared/guard/forgot-password.guard';
import { LoginGuard } from './shared/guard/login.guard';
import { RegisterGuard } from './shared/guard/register.guard';
import { VerifyEMailGuard } from './shared/guard/verify-email.guard';

const routes: Routes = [{
  path: '', component: DefaultComponent,
  children: [{
    path: '',
    component: HomeComponent
  },
  { path: 'nextcloud', component: NextcloudComponent },
  { path: 'synology', component: SynologyComponent },
  // Checkout
  { path: 'checkout/success', component: SuccessComponent },
  { path: 'checkout/cancel', component: CancelComponent },
  // Footer
  { path: 'privacy-policy', component: PrivacyComponent },
  { path: 'imprint', component: ImprintComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'contact', component: ContactComponent },
  // AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [DashboardGuard] },
  { path: 'dashboard/subscription/:id', component: SubscriptionDetailComponent, canActivate: [DashboardGuard] },
  // LoginGuard
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  // RegisterGuard
  { path: 'register', component: RegisterComponent, canActivate: [RegisterGuard] },
  // VerifyEmailGuard
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [VerifyEMailGuard] },
  // ForgotPasswordGuard
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [ForgotPasswordGuard] },
  // PageNotFound
  { path: '**', component: PageNotFoundComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
