import { Component } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { BillingAddressReply, BillingAddressRequest } from '../billing-address-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { BillingAddressService } from '../billing-address.service';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-billing-address-detail',
  standalone: false,
  templateUrl: './billing-address-detail.component.html',
  styleUrl: './billing-address-detail.component.scss'
})
export class BillingAddressDetailComponent {

  reply: BillingAddressReply | undefined;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;
  form: UntypedFormGroup;
  submitted = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    public authService: AuthService,
    private permissionService: PermissionService,
    private service: BillingAddressService,
    private route: ActivatedRoute,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      line1: ['', Validators.required],
      line2: [''],
      postalCode: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required]
    });
    this.checkPermissions();
  }

  get f() {
    return this.form.controls;
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
              this.form.patchValue({
                name: this.getName(),
                country: this.getCountyCode(),
                line1: this.getLine1(),
                line2: this.getLine2(),
                postalCode: this.getPostalCode(),
                city: this.getCity(),
                phone: this.getPhone()
              });
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.serviceStatus = ServiceStatus.Error;
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

  getPhone(): string {
    return this.reply?.phone || '';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
  }

  cancel(): void {
    this.returnUrlService.openReturnURL("/dashboard");
  }

}
