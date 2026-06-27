import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { BillingAddressReply, BillingAddressRequest } from '../billing-address-model';
import { BillingAddressService } from '../billing-address.service';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatTooltip } from '@angular/material/tooltip';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../../../../../../shared/components/loading-failed/loading-failed.component';

@Component({
  selector: 'app-billing-address-overview',
  templateUrl: './billing-address-overview.component.html',
  styleUrl: './billing-address-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCard,
    MatProgressBar,
    MatCardTitle,
    MatIcon,
    MatDivider,
    MatCardContent,
    MatList,
    MatListItem,
    NgxSkeletonLoaderComponent,
    MatTooltip,
    MatCardActions,
    MatButton,
    LoadingFailedComponent,
  ],
})
export class BillingAddressOverviewComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly permissionService = inject(PermissionService);
  private readonly billingAddressService = inject(BillingAddressService);
  private readonly route = inject(ActivatedRoute);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly returnUrlService = inject(ReturnUrlService);
  private readonly countryService = inject(CountryService);
  private readonly languageService = inject(LanguageService);

  readonly ServiceStatus = ServiceStatus;
  readonly serviceStatus = signal<ServiceStatus>(ServiceStatus.Initializing);
  readonly reply = signal<BillingAddressReply | null>(null);
  readonly country = signal<string | null>(null);
  readonly skeletonItems = Array.from({ length: 8 });

  readonly name = computed(() => this.reply()?.name ?? '');
  readonly line1 = computed(() => this.reply()?.address?.line1 ?? '');
  readonly line2 = computed(() => this.reply()?.address?.line2 ?? '');
  readonly postalCode = computed(() => this.reply()?.address?.postal_code ?? '');
  readonly city = computed(() => this.reply()?.address?.city ?? '');
  readonly countryCode = computed(() => this.reply()?.address?.country ?? '');
  readonly phone = computed(() => this.reply()?.phone ?? '');

  readonly subscriptionId = computed(() =>
    this.route.snapshot.paramMap.get('subscriptionID') ?? ''
  );

  ngOnInit(): void {
    this.checkPermissions();
  }

  edit(): void {
    const id = this.subscriptionId();
    if (!id) {
      this.snackBarService.error('Could not edit billing address. Please try again later.');
      return;
    }
    this.returnUrlService.openUrlAddReturnUrl(`/dashboard/subscription/${id}/billing-address`);
  }

  private async checkPermissions(): Promise<void> {
    const id = this.subscriptionId();
    if (!id) {
      this.logService.error('BillingAddressOverviewComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    try {
      const hasPermission = await this.permissionService.isBilling(id);
      if (hasPermission) {
        this.loadBillingAddress();
      } else {
        this.serviceStatus.set(ServiceStatus.NoPermission);
      }
    } catch {
      this.serviceStatus.set(ServiceStatus.Error);
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  private loadBillingAddress(): void {
    this.serviceStatus.set(ServiceStatus.Loading);

    this.authService
      .waitForAuth()
      .then(() => {
        const id = this.subscriptionId();
        if (!id) {
          this.logService.error('BillingAddressOverviewComponent.loadBillingAddress: subscriptionID is null');
          this.serviceStatus.set(ServiceStatus.Error);
          return;
        }

        const request: BillingAddressRequest = { subscriptionID: id };
        this.billingAddressService.getBillingAddress(request).subscribe({
          next: (data) => {
            this.reply.set(data);
            const resolvedCountry = this.countryService.getCountry(
              this.languageService.getLanguage(),
              this.countryCode()
            );
            this.country.set(resolvedCountry);
            this.serviceStatus.set(ServiceStatus.Success);
          },
          error: (error) => {
            this.logService.error(`getBillingAddress failed: ${error}`);
            this.serviceStatus.set(ServiceStatus.Error);
          },
        });
      })
      .catch((error) => {
        this.logService.error(`waitForAuth failed: ${error}`);
        this.serviceStatus.set(ServiceStatus.Error);
      });
  }
}