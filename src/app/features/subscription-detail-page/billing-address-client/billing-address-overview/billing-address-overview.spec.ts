import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { BillingAddressOverview } from './billing-address-overview';
import { BillingAddressReply } from '../billing-address-model';
import { BillingAddressClient } from '../billing-address-client';
import { CountryLookup } from '../country-lookup/country-lookup';
import { LanguageStore } from '../country-lookup/language-store';
import { ActivatedRoute } from '@angular/router';
import { ServiceStatus } from 'src/app/shared/client-status';
import { of, throwError } from 'rxjs';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { PermissionStore } from 'src/app/core/permission-store/permission-store';

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
const permissionStoreMock = { isBilling: vi.fn().mockResolvedValue(true) };
const billingAddressServiceMock = { getBillingAddress: vi.fn().mockReturnValue(of(mockReply)) };
const routeMock = { snapshot: { paramMap: { get: vi.fn().mockReturnValue('subscription-123') } } };
const countryServiceMock = { getCountry: vi.fn().mockReturnValue('Germany') };
const languageServiceMock = { getLanguage: vi.fn().mockReturnValue('de') };
const logMock = { error: vi.fn() };
const snackBarMock = { error: vi.fn() };
const returnUrlMock = { openUrlAddReturnUrl: vi.fn() };

const providers = [
  { provide: Auth, useValue: authMock },
  { provide: PermissionStore, useValue: permissionStoreMock },
  { provide: BillingAddressClient, useValue: billingAddressServiceMock },
  { provide: ActivatedRoute, useValue: routeMock },
  { provide: Log, useValue: logMock },
  { provide: SnackBar, useValue: snackBarMock },
  { provide: ReturnUrl, useValue: returnUrlMock },
  { provide: CountryLookup, useValue: countryServiceMock },
  { provide: LanguageStore, useValue: languageServiceMock },
];

async function createComponent(): Promise<{
  component: BillingAddressOverview;
  fixture: ComponentFixture<BillingAddressOverview>;
}> {
  const fixture = TestBed.createComponent(BillingAddressOverview);
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
  permissionStoreMock.isBilling.mockResolvedValue(true);
  billingAddressServiceMock.getBillingAddress.mockReturnValue(of(mockReply));
  routeMock.snapshot.paramMap.get.mockReturnValue('subscription-123');
  countryServiceMock.getCountry.mockReturnValue('Germany');
  languageServiceMock.getLanguage.mockReturnValue('de');
}

describe('BillingAddressOverview', () => {
  let component: BillingAddressOverview;
  let fixture: ComponentFixture<BillingAddressOverview>;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetMockDefaults();

    await TestBed.configureTestingModule({
      imports: [BillingAddressOverview],
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
    permissionStoreMock.isBilling.mockResolvedValue(false);
    ({ component } = await createComponent());
    expect(component.serviceStatus()).toBe(ServiceStatus.NoPermission);
  });

  it('should set Error status when permission check throws', async () => {
    permissionStoreMock.isBilling.mockRejectedValue(new Error('Permission error'));
    ({ component } = await createComponent());
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(snackBarMock.error).toHaveBeenCalledWith(
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
    expect(returnUrlMock.openUrlAddReturnUrl).toHaveBeenCalledWith(
      '/dashboard/subscription/subscription-123/billing-address'
    );
  });

  it('should show snackbar error when edit is called without subscriptionID', async () => {
    routeMock.snapshot.paramMap.get.mockReturnValue(null);
    ({ component } = await createComponent());
    component.edit();
    expect(snackBarMock.error).toHaveBeenCalledWith(
      'Could not edit billing address. Please try again later.'
    );
  });
});