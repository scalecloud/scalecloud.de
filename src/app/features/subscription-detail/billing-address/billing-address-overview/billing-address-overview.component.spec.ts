import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { BillingAddressOverviewComponent } from './billing-address-overview.component';
import { BillingAddressReply } from '../billing-address-model';
import { BillingAddressService } from '../billing-address.service';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { ActivatedRoute } from '@angular/router';
import { ServiceStatus } from 'src/app/shared/service-status';
import { of, throwError } from 'rxjs';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';
import { Auth } from 'src/app/core/auth/auth';
import { Permission } from 'src/app/core/permission/permission';
import { Log } from 'src/app/core/logging/log';

const mockReply: BillingAddressReply = {
  subscriptionID: 'subscription-123',
  name: 'Test User',
  address: {
    line1: 'Street 1',
    line2: 'Apt 2',
    postal_code: '12345',
    city: 'Test City',
    country: 'DE',
  },
  phone: '+4912345678',
};

const authMock = { waitForAuth: vi.fn().mockResolvedValue(undefined) };
const permissionMock = { isBilling: vi.fn().mockResolvedValue(true) };
const billingAddressServiceMock = { getBillingAddress: vi.fn().mockReturnValue(of(mockReply)) };
const routeMock = { snapshot: { paramMap: { get: vi.fn().mockReturnValue('subscription-123') } } };
const countryServiceMock = { getCountry: vi.fn().mockReturnValue('Germany') };
const languageServiceMock = { getLanguage: vi.fn().mockReturnValue('de') };
const logMock = { error: vi.fn() };
const snackBarServiceMock = { error: vi.fn() };
const returnUrlServiceMock = { openUrlAddReturnUrl: vi.fn() };

const providers = [
  { provide: Auth, useValue: authMock },
  { provide: Permission, useValue: permissionMock },
  { provide: BillingAddressService, useValue: billingAddressServiceMock },
  { provide: ActivatedRoute, useValue: routeMock },
  { provide: Log, useValue: logMock },
  { provide: SnackBarService, useValue: snackBarServiceMock },
  { provide: ReturnUrlService, useValue: returnUrlServiceMock },
  { provide: CountryService, useValue: countryServiceMock },
  { provide: LanguageService, useValue: languageServiceMock },
];

async function createComponent(): Promise<{
  component: BillingAddressOverviewComponent;
  fixture: ComponentFixture<BillingAddressOverviewComponent>;
}> {
  const fixture = TestBed.createComponent(BillingAddressOverviewComponent);
  const component = fixture.componentInstance;
  fixture.detectChanges();
  await vi.waitFor(() =>
    expect([ServiceStatus.Initializing, ServiceStatus.Loading]).not.toContain(component.serviceStatus())
  );
  return { component, fixture };
}

/**
 * `vi.clearAllMocks()` only wipes call history — it does NOT undo a
 * `.mockReturnValue()`/`.mockResolvedValue()`/`.mockRejectedValue()`
 * set by an earlier test. Without re-applying the defaults here,
 * an override in one test (e.g. a null subscriptionID) silently
 * leaks into every test that runs after it.
 */
function resetMockDefaults(): void {
  authMock.waitForAuth.mockResolvedValue(undefined);
  permissionMock.isBilling.mockResolvedValue(true);
  billingAddressServiceMock.getBillingAddress.mockReturnValue(of(mockReply));
  routeMock.snapshot.paramMap.get.mockReturnValue('subscription-123');
  countryServiceMock.getCountry.mockReturnValue('Germany');
  languageServiceMock.getLanguage.mockReturnValue('de');
}

describe('BillingAddressOverviewComponent', () => {
  let component: BillingAddressOverviewComponent;
  let fixture: ComponentFixture<BillingAddressOverviewComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetMockDefaults();

    await TestBed.configureTestingModule({
      imports: [BillingAddressOverviewComponent],
      providers,
    }).compileComponents();

    ({ component, fixture } = await createComponent());
  });

  afterEach(() => vi.clearAllMocks());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reach Success status after loading', () => {
    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
  });

  it('should populate reply with billing address data', () => {
    expect(component.reply()).toEqual(mockReply);
  });

  it('should have 8 skeleton items', () => {
    expect(component.skeletonItems.length).toBe(8);
  });

  describe('computed address fields', () => {
    it('should expose name', () => expect(component.name()).toBe('Test User'));
    it('should expose line1', () => expect(component.line1()).toBe('Street 1'));
    it('should expose line2', () => expect(component.line2()).toBe('Apt 2'));
    it('should expose postalCode', () => expect(component.postalCode()).toBe('12345'));
    it('should expose city', () => expect(component.city()).toBe('Test City'));
    it('should expose countryCode', () => expect(component.countryCode()).toBe('DE'));
    it('should expose phone', () => expect(component.phone()).toBe('+4912345678'));
    it('should resolve country display name', () => expect(component.country()).toBe('Germany'));
  });

  it('should set NoPermission status when permission is denied', async () => {
    permissionMock.isBilling.mockResolvedValue(false);
    ({ component } = await createComponent());
    expect(component.serviceStatus()).toBe(ServiceStatus.NoPermission);
  });

  it('should set Error status when permission check throws', async () => {
    permissionMock.isBilling.mockRejectedValue(new Error('Permission error'));
    ({ component } = await createComponent());
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(snackBarServiceMock.error).toHaveBeenCalledWith(
      'An error occurred while checking permissions.'
    );
  });

  it('should set Error status when subscriptionID is missing', async () => {
    routeMock.snapshot.paramMap.get.mockReturnValue(null);
    ({ component } = await createComponent());
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logMock.error).toHaveBeenCalled();
  });

  it('should set Error status when getBillingAddress fails', async () => {
    billingAddressServiceMock.getBillingAddress.mockReturnValue(
      throwError(() => new Error('API error'))
    );
    ({ component } = await createComponent());
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  it('should set Error status and log when waitForAuth fails', async () => {
    authMock.waitForAuth.mockRejectedValue(new Error('Auth error'));
    ({ component } = await createComponent());
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(logMock.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed')
    );
  });

  it('should navigate to billing address edit page', () => {
    component.edit();
    expect(returnUrlServiceMock.openUrlAddReturnUrl).toHaveBeenCalledWith(
      '/dashboard/subscription/subscription-123/billing-address'
    );
  });

  it('should show snackbar error when edit is called without subscriptionID', async () => {
    routeMock.snapshot.paramMap.get.mockReturnValue(null);
    ({ component } = await createComponent());
    component.edit();
    expect(snackBarServiceMock.error).toHaveBeenCalledWith(
      'Could not edit billing address. Please try again later.'
    );
  });
});