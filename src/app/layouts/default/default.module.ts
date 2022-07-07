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
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { SubscriptionCardComponent } from 'src/app/modules/products/subscription-card/subscription-card.component';
import { TitelCardComponent } from 'src/app/modules/products/titel-card/titel-card.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from 'src/app/modules/products/in-memory-data.service';
import { LoginComponent } from 'src/app/modules/account/login/login.component';
import { RegisterComponent } from 'src/app/modules/account/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from 'src/app/modules/account/verify-email/verify-email.component';
import { DashboardComponent } from 'src/app/modules/account/dashboard/dashboard.component';
import { GlobeComponent } from 'src/app/modules/main/globe/globe.component';
import { ForgotPasswordComponent } from 'src/app/modules/account/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from 'src/app/modules/main/page-not-found/page-not-found.component';
import { SubscriptionDetailComponent } from 'src/app/modules/account/dashboard/subscription-detail/subscription-detail.component';
import { SubscriptionOverviewComponent } from 'src/app/modules/account/dashboard/subscription-overview/subscription-overview.component';
import { SubscriptionDetailCardComponent } from 'src/app/modules/account/dashboard/subscription-detail/subscription-detail-card/subscription-detail-card.component';
import { BillingPortalComponent } from 'src/app/modules/account/dashboard/subscription-detail/customer-portal/billing-portal.component';
import { PasswordStrengthComponent } from 'src/app/modules/account/register/password-strength/password-strength.component';
import { PasswordMatchComponent } from 'src/app/modules/account/register/password-match/password-match.component';
import { CancelComponent } from 'src/app/modules/products/checkout/cancel/cancel.component';
import { SuccessComponent } from 'src/app/modules/products/checkout/success/success.component';
import { TermsComponent } from 'src/app/modules/footer/terms/terms.component';
import { QuantityComponent } from 'src/app/modules/products/subscription-card/quantity/quantity.component';

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
    ForgotPasswordComponent,
    GlobeComponent,
    PageNotFoundComponent,
    SubscriptionOverviewComponent,
    SubscriptionDetailComponent,
    SubscriptionDetailCardComponent,
    BillingPortalComponent,
    SuccessComponent,
    CancelComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatIconModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, {
      delay: 0,
      dataEncapsulation: false,
      passThruUnknownUrl: true
    },
    )
  ],
  providers: [
    HttpClientModule
  ]
})
export class DefaultModule { }
