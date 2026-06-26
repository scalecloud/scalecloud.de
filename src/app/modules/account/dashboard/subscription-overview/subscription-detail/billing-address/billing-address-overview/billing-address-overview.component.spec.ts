import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { BillingAddressOverviewComponent } from './billing-address-overview.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { BillingAddressService } from '../billing-address.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { CountryService } from '../country/country.service';
import { LanguageService } from '../country/language.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute } from '@angular/router';

describe('BillingAddressOverviewComponent', () => {
  let component: BillingAddressOverviewComponent;
  let fixture: ComponentFixture<BillingAddressOverviewComponent>;

  const authServiceMock = { waitForAuth: vi.fn().mockResolvedValue(undefined) };
  const permissionServiceMock = { isBilling: vi.fn().mockResolvedValue(true) };
  const billingAddressServiceMock = {
    getBillingAddress: vi.fn().mockReturnValue(of({
      name: 'Test User',
      address: {
        line1: 'Street 1',
        line2: 'Apt 2',
        postal_code: '12345',
        city: 'Test City',
        country: 'DE'
      },
      phone: '+4912345678'
    }))
  };
  const routeMock = {
    snapshot: {
      paramMap: {
        get: vi.fn().mockReturnValue('subscription-123')
      }
    }
  };
  const countryServiceMock = { getCountry: vi.fn().mockReturnValue('Germany') };
  const languageServiceMock = { getLanguage: vi.fn().mockReturnValue('de') };
  const logServiceMock = { error: vi.fn(), info: vi.fn() };
  const snackBarServiceMock = { error: vi.fn() };
  const returnUrlServiceMock = { openUrlAddReturnUrl: vi.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingAddressOverviewComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: PermissionService, useValue: permissionServiceMock },
        { provide: BillingAddressService, useValue: billingAddressServiceMock },
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: LogService, useValue: logServiceMock },
        { provide: SnackBarService, useValue: snackBarServiceMock },
        { provide: ReturnUrlService, useValue: returnUrlServiceMock },
        { provide: CountryService, useValue: countryServiceMock },
        { provide: LanguageService, useValue: languageServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingAddressOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
