import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/service-status';
import { Address, BillingAddressReply, BillingAddressRequest, UpdateBillingAddressRequest } from '../billing-address-model';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PermissionService } from 'src/app/core/permission/permission.service';
import { BillingAddressService } from '../billing-address.service';
import { ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/core/logging/log.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CountryInputComponent } from '../country-input/country-input.component';
import { MatButton } from '@angular/material/button';
import { LoadingFailedComponent } from '../../../../../../shared/loading-failed/loading-failed.component';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';

/**
 * Typed shape of the billing address form.
 * Adjust the field types here if your real model differs
 * (e.g. if `line2` is nullable rather than always a string).
 */
interface BillingAddressFormControls {
  name: FormControl<string>;
  country: FormControl<string>;
  line1: FormControl<string>;
  line2: FormControl<string>;
  postalCode: FormControl<string>;
  city: FormControl<string>;
  phone: FormControl<string>;
}

@Component({
  selector: 'app-billing-address-detail',
  templateUrl: './billing-address-detail.component.html',
  // Explicitly kept even though OnPush is now the Angular 22 default,
  // so intent is clear regardless of future default changes.
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './billing-address-detail.component.scss',
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
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    CountryInputComponent,
    MatCardActions,
    MatButton,
    LoadingFailedComponent,
  ],
})
export class BillingAddressDetailComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly permissionService = inject(PermissionService);
  private readonly service = inject(BillingAddressService);
  private readonly route = inject(ActivatedRoute);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly returnUrlService = inject(ReturnUrlService);

  // Mutable view state is now signal-backed. With OnPush as the
  // baseline strategy, plain field mutations would not reliably
  // trigger a re-render; signals make updates explicit and correct
  // without needing markForCheck() calls.
  readonly ServiceStatus = ServiceStatus;
  readonly serviceStatus = signal(ServiceStatus.Initializing);
  readonly submitted = signal(false);
  private readonly reply = signal<BillingAddressReply | undefined>(undefined);

  /**
   * NOTE: the template checks f.phone.errors?.pattern, which implies
   * a pattern validator was always intended here but was missing
   * from the original component — meaning that error message could
   * never have fired. This regex is a reasonable placeholder
   * (digits, spaces, +, -, parentheses, 6+ digits total); replace it
   * with whatever pattern your app actually validates against.
   */
  private static readonly PHONE_PATTERN = /^[+]?[\d\s().-]{6,}$/;

  // Built as a field initializer instead of inside ngOnInit, since
  // nothing async needs to happen first. Typed via FormBuilder +
  // nonNullable, replacing UntypedFormBuilder/UntypedFormGroup.
  readonly form: FormGroup<BillingAddressFormControls> = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    country: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    postalCode: ['', Validators.required],
    city: ['', Validators.required],
    phone: ['', [Validators.required, Validators.pattern(BillingAddressDetailComponent.PHONE_PATTERN)]],
  });

  ngOnInit(): void {
    this.checkPermissions();
  }

  get f() {
    return this.form.controls;
  }

  onCountryControlReceived(countryControl: FormControl<string>) {
    this.form.setControl('country', countryControl);
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }

  /**
   * Kept because the template pre-fills app-country-input via
   * [initialCountryCode]="getCountyCode()" before the form's own
   * country control exists. Everything else that used to be a
   * single-use getXxx() method was inlined into applyReply() below,
   * since those weren't referenced from the template.
   */
  getCountyCode(): string {
    return this.reply()?.address.country ?? '';
  }

  async checkPermissions() {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('BillingAddressDetailComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    try {
      const hasPermission = await this.permissionService.isBilling(subscriptionID);
      if (hasPermission) {
        await this.reloadBillingAddressDetail();
      } else {
        this.serviceStatus.set(ServiceStatus.NoPermission);
      }
    } catch {
      this.serviceStatus.set(ServiceStatus.Error);
    }
  }

  /**
   * Returns a Promise so callers (and tests) can await completion
   * directly instead of relying on fixture.whenStable(), which only
   * tracks Angular-scheduled work and is not guaranteed to wait for
   * an arbitrary, untracked promise chain under zoneless CD.
   */
  async reloadBillingAddressDetail(): Promise<void> {
    this.serviceStatus.set(ServiceStatus.Loading);

    try {
      await this.authService.waitForAuth();
    } catch (error) {
      this.logService.error('waitForAuth failed: ' + error);
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('BillingAddressDetailComponent.reloadBillingAddressDetail: subscriptionID is null');
      return;
    }

    const request: BillingAddressRequest = { subscriptionID };
    this.service.getBillingAddress(request).subscribe({
      next: (reply) => this.applyReply(reply),
      error: () => this.serviceStatus.set(ServiceStatus.Error),
    });
  }

  /**
   * Patches the form directly from the reply, replacing the
   * previous getName()/getLine1()/... getter methods (still keeping
   * getCountyCode(), which the template calls directly). `address`
   * is a required field on BillingAddressReply, so no optional
   * chaining is needed on it specifically.
   */
  private applyReply(reply: BillingAddressReply): void {
    this.reply.set(reply);
    this.form.patchValue({
      name: reply.name,
      country: reply.address.country,
      line1: reply.address.line1,
      line2: reply.address.line2,
      postalCode: reply.address.postal_code,
      city: reply.address.city,
      phone: reply.phone,
    });
    this.serviceStatus.set(ServiceStatus.Success);
  }

  /**
   * Returns a Promise for the same reason as reloadBillingAddressDetail():
   * lets tests await the full submit flow deterministically instead of
   * racing fixture.whenStable() against an untracked promise chain.
   */
  async onSubmit(): Promise<void> {
    this.submitted.set(true);
    if (this.form.invalid) {
      return;
    }

    try {
      await this.authService.waitForAuth();
    } catch (error) {
      this.logService.error('waitForAuth failed: ' + error);
      return;
    }

    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.snackBarService.error('Currently not possible update billing address. Please try again later.');
      this.returnUrlService.openReturnURL('/dashboard');
      return;
    }

    const address: Address = {
      city: this.f.city.value,
      country: this.f.country.value,
      line1: this.f.line1.value,
      line2: this.f.line2.value,
      postal_code: this.f.postalCode.value,
    };
    const updateBillingAddressRequest: UpdateBillingAddressRequest = {
      subscriptionID,
      name: this.f.name.value,
      address,
      phone: this.f.phone.value,
    };

    this.service.updateBillingAddress(updateBillingAddressRequest).subscribe((reply) => {
      if (reply.subscriptionID) {
        this.snackBarService.info('Billing address updated.');
        this.returnUrlService.openReturnURL('/dashboard');
      } else {
        this.snackBarService.error('Could not update billing address. Please retry.');
      }
    });
  }

  cancel(): void {
    this.returnUrlService.openReturnURL('/dashboard');
  }
}