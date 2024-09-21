import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { StripePaymentElementComponent } from './components/stripe/stripe-payment-element/stripe-payment-element.component';
import { MatCardModule } from '@angular/material/card';
import { LoadingFailedComponent } from './components/loading-failed/loading-failed.component';
import { SnackBarProgressComponent } from './services/snackbar/snack-bar-progress/snack-bar-progress.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    StripePaymentElementComponent,
    LoadingFailedComponent,
    SnackBarProgressComponent,
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    RouterModule,
    MatSnackBarModule,
    MatCardModule,
    MatProgressBarModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    StripePaymentElementComponent,
    LoadingFailedComponent,
    SnackBarProgressComponent,
  ]
})
export class SharedModule { }
