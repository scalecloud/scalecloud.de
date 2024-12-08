import { Component } from '@angular/core';
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

@Component({
  selector: 'app-billing-address-overview',
  templateUrl: './billing-address-overview.component.html',
  styleUrl: './billing-address-overview.component.scss'
})
export class BillingAddressOverviewComponent {

  
  reply: BillingAddressReply | undefined;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  constructor(
    public authService: AuthService,
    private permissionService: PermissionService,
    private service: BillingAddressService,
    private route: ActivatedRoute,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
    private countryService: CountryService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
    this.checkPermissions();
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }

  async checkPermissions() {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('BillingAddressDetailComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    try {
      const hasPermission = await this.permissionService.isBilling(subscriptionID);
      if (hasPermission) {
        this.reloadBillingAddressDetail();
      } else {
        this.serviceStatus = ServiceStatus.NoPermission;
      }
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  reloadBillingAddressDetail(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (subscriptionID == null) {
        this.logService.error('BillingAddressDetailComponent.reloadBillingAddressDetail: subscriptionID is null');
      } else {
        let request: BillingAddressRequest = {
          subscriptionID: subscriptionID,
        };
        this.service.getBillingAddress(request)
          .subscribe({
            next: reply => {
              this.reply = reply;
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.serviceStatus = ServiceStatus.Error;
              this.snackBarService.error(error);
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }

  getName(): string {
    return this.reply?.name || '';
  }

  getLine1(): string {
    return this.reply?.address?.line1 || '';
  }

  getLine2(): string {
    return this.reply?.address?.line2 || '';
  }

  getPostalCode(): string {
    return this.reply?.address?.postal_code || '';
  }

  getCity(): string {
    return this.reply?.address?.city || '';
  }

  getState(): string {
    return this.reply?.address?.state || '';
  }

  getCountyCode(): string {
    return this.reply?.address?.country || '';
  }

  getCounty(): string {
    return this.countryService.getCountry(this.languageService.getLanguage(), this.getCountyCode());
  }

  getPhone(): string {
    return this.reply?.phone || '';
  }

  edit(): void {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.snackBarService.error('Could not edit billing address. Please try again later.');
      return;
    }
    this.returnUrlService.openUrlAddReturnUrl('/dashboard/subscription/' + subscriptionID + '/billing-address');
  }

}
