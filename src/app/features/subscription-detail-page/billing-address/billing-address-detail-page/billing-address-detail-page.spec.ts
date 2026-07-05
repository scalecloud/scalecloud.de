import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, it, expect, vi, type Mock } from 'vitest';

import { BillingAddressDetailPage } from './billing-address-detail-page';
import { ServiceStatus } from 'src/app/shared/service-status';
import { BillingAddressService } from '../billing-address.service';
import { BillingAddressReply } from '../billing-address-model';
import { Auth } from 'src/app/core/auth/auth';
import { Permission } from 'src/app/core/permission/permission';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

/**
 * NOTE: These mock shapes are inferred from how the component calls
 * each service. If the real services have additional methods, extra
 * required constructor args, or different method signatures, adjust
 * the `vi.fn()` stubs below to match.
 */

const SUBSCRIPTION_ID = 'sub-123';

function createActivatedRouteStub(subscriptionID: string | null = SUBSCRIPTION_ID): Partial<ActivatedRoute> {
  return {
    snapshot: {
      paramMap: convertToParamMap(subscriptionID ? { subscriptionID } : {}),
    } as ActivatedRoute['snapshot'],
  };
}

function createReply(overrides: Partial<BillingAddressReply> = {}): BillingAddressReply {
  return {
    subscriptionID: SUBSCRIPTION_ID,
    name: 'Jane Doe',
    phone: '+49 123 456789',
    address: {
      line1: 'Main Street 1',
      line2: 'Apt 2',
      postal_code: '24937',
      city: 'Flensburg',
      country: 'DE',
    },
    ...overrides,
  };
}

describe('BillingAddressDetailPage', () => {
  let component: BillingAddressDetailPage;
  let fixture: ComponentFixture<BillingAddressDetailPage>;

  let authMock: { waitForAuth: Mock };
  let permissionMock: { isBilling: Mock };
  let billingAddressServiceMock: { getBillingAddress: Mock; updateBillingAddress: Mock };
  let logMock: { error: Mock };
  let snackBarMock: { info: Mock; error: Mock };
  let returnUrlMock: { openReturnURL: Mock };
  let activatedRouteStub: Partial<ActivatedRoute>;

  /**
   * Configures TestBed with the given ActivatedRoute stub and creates
   * the component. Split out so tests that need a different
   * subscriptionID (e.g. missing) can override before creation,
   * since getSubscriptionID() is read in ngOnInit via checkPermissions().
   */
  async function setup(routeOverride?: Partial<ActivatedRoute>) {
    authMock = { waitForAuth: vi.fn().mockResolvedValue(undefined) };
    permissionMock = { isBilling: vi.fn().mockResolvedValue(true) };
    billingAddressServiceMock = {
      getBillingAddress: vi.fn().mockReturnValue(of(createReply())),
      updateBillingAddress: vi.fn().mockReturnValue(of({ subscriptionID: SUBSCRIPTION_ID })),
    };
    logMock = { error: vi.fn() };
    snackBarMock = { info: vi.fn(), error: vi.fn() };
    returnUrlMock = { openReturnURL: vi.fn() };
    activatedRouteStub = routeOverride ?? createActivatedRouteStub();

    // Allows setup() to be called more than once within a single test
    // (e.g. to swap in a null subscriptionID after an outer beforeEach
    // has already created a fixture). Without this, a second
    // configureTestingModule() call throws "test module has already
    // been instantiated".
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [BillingAddressDetailPage],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: Permission, useValue: permissionMock },
        { provide: BillingAddressService, useValue: billingAddressServiceMock },
        { provide: Log, useValue: logMock },
        { provide: SnackBar, useValue: snackBarMock },
        { provide: ReturnUrl, useValue: returnUrlMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAddressDetailPage);
    component = fixture.componentInstance;
  }

  describe('creation', () => {
    beforeEach(async () => {
      await setup();
    });

    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should build the form with all expected controls', () => {
      expect(component.form.controls.name).toBeDefined();
      expect(component.form.controls.country).toBeDefined();
      expect(component.form.controls.line1).toBeDefined();
      expect(component.form.controls.line2).toBeDefined();
      expect(component.form.controls.postalCode).toBeDefined();
      expect(component.form.controls.city).toBeDefined();
      expect(component.form.controls.phone).toBeDefined();
    });

    it('should start in the Initializing state before ngOnInit runs', () => {
      expect(component.serviceStatus()).toBe(ServiceStatus.Initializing);
    });
  });

  describe('checkPermissions', () => {
    it('should set Error status and log when subscriptionID is missing', async () => {
      await setup(createActivatedRouteStub(null));

      fixture.detectChanges();
      await vi.waitFor(() => expect(component.serviceStatus()).toBe(ServiceStatus.Error));

      expect(logMock.error).toHaveBeenCalledWith(
        expect.stringContaining('subscriptionID is null'),
      );
      expect(permissionMock.isBilling).not.toHaveBeenCalled();
    });

    it('should set NoPermission status when the user lacks billing permission', async () => {
      await setup();
      permissionMock.isBilling.mockResolvedValue(false);

      fixture.detectChanges();
      await vi.waitFor(() => expect(component.serviceStatus()).toBe(ServiceStatus.NoPermission));

      expect(permissionMock.isBilling).toHaveBeenCalledWith(SUBSCRIPTION_ID);
      expect(billingAddressServiceMock.getBillingAddress).not.toHaveBeenCalled();
    });

    it('should set Error status when the permission check throws', async () => {
      await setup();
      permissionMock.isBilling.mockRejectedValue(new Error('permission service down'));

      fixture.detectChanges();
      await vi.waitFor(() => expect(component.serviceStatus()).toBe(ServiceStatus.Error));
    });

    it('should proceed to load the billing address when permission is granted', async () => {
      await setup();

      fixture.detectChanges();
      await vi.waitFor(() => expect(billingAddressServiceMock.getBillingAddress).toHaveBeenCalled());

      expect(authMock.waitForAuth).toHaveBeenCalled();
      expect(billingAddressServiceMock.getBillingAddress).toHaveBeenCalledWith({
        subscriptionID: SUBSCRIPTION_ID,
      });
    });
  });

  describe('reloadBillingAddressDetail', () => {
    beforeEach(async () => {
      await setup();
    });

    it('should set Loading status immediately, before auth resolves', () => {
      // Don't await — an async function body runs synchronously up
      // to its first `await`, so the Loading status is already set
      // by the time this call returns, while waitForAuth() is still
      // pending. Deliberately not awaiting the returned promise here.
      void component.reloadBillingAddressDetail();
      expect(component.serviceStatus()).toBe(ServiceStatus.Loading);
    });

    it('should patch the form and set Success status on a successful reply', async () => {
      await component.reloadBillingAddressDetail();

      expect(component.serviceStatus()).toBe(ServiceStatus.Success);
      expect(component.form.controls.name.value).toBe('Jane Doe');
      expect(component.form.controls.line1.value).toBe('Main Street 1');
      expect(component.form.controls.line2.value).toBe('Apt 2');
      expect(component.form.controls.postalCode.value).toBe('24937');
      expect(component.form.controls.city.value).toBe('Flensburg');
      expect(component.form.controls.country.value).toBe('DE');
      expect(component.form.controls.phone.value).toBe('+49 123 456789');
    });

    it('should expose the loaded country code via getCountyCode()', async () => {
      await component.reloadBillingAddressDetail();

      expect(component.getCountyCode()).toBe('DE');
    });

    it('should return an empty string from getCountyCode() before any reply has loaded', () => {
      expect(component.getCountyCode()).toBe('');
    });

    it('should set Error status when getBillingAddress errors', async () => {
      billingAddressServiceMock.getBillingAddress.mockReturnValue(
        throwError(() => new Error('network error')),
      );

      await component.reloadBillingAddressDetail();

      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    });

    it('should log and set Error status when waitForAuth rejects', async () => {
      authMock.waitForAuth.mockRejectedValue(new Error('auth failed'));

      await component.reloadBillingAddressDetail();

      expect(logMock.error).toHaveBeenCalledWith(
        expect.stringContaining('waitForAuth failed'),
      );
      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    });

    it('should log and not call getBillingAddress when subscriptionID is missing after auth resolves', async () => {
      await setup(createActivatedRouteStub(null));

      await component.reloadBillingAddressDetail();

      expect(logMock.error).toHaveBeenCalledWith(
        expect.stringContaining('subscriptionID is null'),
      );
      expect(billingAddressServiceMock.getBillingAddress).not.toHaveBeenCalled();
    });
  });

  describe('onCountryControlReceived', () => {
    beforeEach(async () => {
      await setup();
      fixture.detectChanges();
    });

    it('should replace the country control on the form', () => {
      const newControl = new FormControl('FR', { nonNullable: true });

      component.onCountryControlReceived(newControl);

      expect(component.form.controls.country).toBe(newControl);
      expect(component.form.controls.country.value).toBe('FR');
    });
  });

  describe('onSubmit', () => {
    beforeEach(async () => {
      await setup();
      fixture.detectChanges();
      // Let the ngOnInit-driven initial load + patchValue settle.
      await vi.waitFor(() => expect(component.serviceStatus()).toBe(ServiceStatus.Success));
    });

    it('should mark the form as submitted', () => {
      void component.onSubmit();
      expect(component.submitted()).toBe(true);
    });

    it('should not call updateBillingAddress when the form is invalid', () => {
      component.form.controls.name.setValue('');
      void component.onSubmit();
      expect(billingAddressServiceMock.updateBillingAddress).not.toHaveBeenCalled();
    });

    it('should mark the phone control invalid with a pattern error for malformed input', () => {
      component.form.controls.phone.setValue('abc');
      expect(component.form.controls.phone.errors?.['pattern']).toBeTruthy();
      expect(component.form.controls.phone.errors?.['required']).toBeFalsy();
    });

    it('should accept a phone number in a valid format', () => {
      component.form.controls.phone.setValue('+49 (0) 123-456789');
      expect(component.form.controls.phone.errors).toBeNull();
    });

    it('should not call updateBillingAddress when the phone number fails the pattern check', () => {
      component.form.setValue({
        name: 'John Smith',
        country: 'DE',
        line1: 'Second Street 2',
        line2: '',
        postalCode: '99999',
        city: 'Berlin',
        phone: 'not-a-phone-number',
      });

      void component.onSubmit();

      expect(billingAddressServiceMock.updateBillingAddress).not.toHaveBeenCalled();
    });

    it('should submit the mapped address and show a success snackbar on success', async () => {
      component.form.setValue({
        name: 'John Smith',
        country: 'DE',
        line1: 'Second Street 2',
        line2: '',
        postalCode: '99999',
        city: 'Berlin',
        phone: '+49 000 000000',
      });

      await component.onSubmit();

      expect(billingAddressServiceMock.updateBillingAddress).toHaveBeenCalledWith({
        subscriptionID: SUBSCRIPTION_ID,
        name: 'John Smith',
        phone: '+49 000 000000',
        address: {
          city: 'Berlin',
          country: 'DE',
          line1: 'Second Street 2',
          line2: '',
          postal_code: '99999',
        },
      });
      expect(snackBarMock.info).toHaveBeenCalledWith('Billing address updated.');
      expect(returnUrlMock.openReturnURL).toHaveBeenCalledWith('/dashboard');
    });

    it('should show an error snackbar when the update reply has no subscriptionID', async () => {
      billingAddressServiceMock.updateBillingAddress.mockReturnValue(of({ subscriptionID: '' }));
      component.form.controls.name.setValue('Valid Name');
      component.form.controls.line1.setValue('Valid Line 1');
      component.form.controls.postalCode.setValue('12345');
      component.form.controls.city.setValue('Valid City');
      component.form.controls.country.setValue('DE');
      component.form.controls.phone.setValue('+49 123456');

      await component.onSubmit();

      expect(snackBarMock.error).toHaveBeenCalledWith('Could not update billing address. Please retry.');
      expect(returnUrlMock.openReturnURL).not.toHaveBeenCalled();
    });

    it('should show an error snackbar and redirect when subscriptionID is missing at submit time', async () => {
      await setup(createActivatedRouteStub(null));
      fixture.detectChanges();
      await vi.waitFor(() => expect(component.serviceStatus()).toBe(ServiceStatus.Error));
      component.form.controls.name.setValue('Valid Name');
      component.form.controls.line1.setValue('Valid Line 1');
      component.form.controls.postalCode.setValue('12345');
      component.form.controls.city.setValue('Valid City');
      component.form.controls.country.setValue('DE');
      component.form.controls.phone.setValue('+49 123456');

      await component.onSubmit();

      expect(snackBarMock.error).toHaveBeenCalledWith(
        'Currently not possible update billing address. Please try again later.',
      );
      expect(returnUrlMock.openReturnURL).toHaveBeenCalledWith('/dashboard');
      expect(billingAddressServiceMock.updateBillingAddress).not.toHaveBeenCalled();
    });

    it('should log when waitForAuth rejects during submit', async () => {
      authMock.waitForAuth.mockRejectedValue(new Error('auth failed'));
      component.form.controls.name.setValue('Valid Name');
      component.form.controls.line1.setValue('Valid Line 1');
      component.form.controls.postalCode.setValue('12345');
      component.form.controls.city.setValue('Valid City');
      component.form.controls.country.setValue('DE');
      component.form.controls.phone.setValue('+49 123456');

      await component.onSubmit();

      expect(logMock.error).toHaveBeenCalledWith(
        expect.stringContaining('waitForAuth failed'),
      );
    });
  });

  describe('cancel', () => {
    beforeEach(async () => {
      await setup();
      fixture.detectChanges();
    });

    it('should navigate back to the dashboard', () => {
      component.cancel();
      expect(returnUrlMock.openReturnURL).toHaveBeenCalledWith('/dashboard');
    });
  });
});