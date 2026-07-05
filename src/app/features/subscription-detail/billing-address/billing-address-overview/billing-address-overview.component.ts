import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceStatus } from 'src/app/shared/service-status';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
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
import { LoadingFailedComponent } from '../../../../shared/loading-failed/loading-failed.component';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';
import { Auth } from 'src/app/core/auth/auth';
import { Permission } from 'src/app/core/permission/permission';
import { Log } from 'src/app/core/logging/log';

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
  private readonly auth = inject(Auth);
  private readonly permission = inject(Permission);
  private readonly billingAddressService = inject(BillingAddressService);
  private readonly route = inject(ActivatedRoute);
  private readonly log = inject(Log);
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
      this.log.error('BillingAddressOverviewComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    try {
      const hasPermission = await this.permission.isBilling(id);
      if (hasPermission) {
        await this.loadBillingAddress();
      } else {
        this.serviceStatus.set(ServiceStatus.NoPermission);
      }
    } catch {
      this.serviceStatus.set(ServiceStatus.Error);
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  /**
   * Returns a Promise so callers (and tests) can await completion
   * directly instead of relying on fixture.whenStable(), which only
   * tracks Angular-scheduled work and is not guaranteed to wait for
   * an arbitrary, untracked promise chain under zoneless CD.
   */
  private async loadBillingAddress(): Promise<void> {
    this.serviceStatus.set(ServiceStatus.Loading);

    try {
      await this.auth.waitForAuth();
    } catch (error) {
      this.log.error(`waitForAuth failed: ${error}`);
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    const id = this.subscriptionId();
    if (!id) {
      this.log.error('BillingAddressOverviewComponent.loadBillingAddress: subscriptionID is null');
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
        this.log.error(`getBillingAddress failed: ${error}`);
        this.serviceStatus.set(ServiceStatus.Error);
      },
    });
  }
}