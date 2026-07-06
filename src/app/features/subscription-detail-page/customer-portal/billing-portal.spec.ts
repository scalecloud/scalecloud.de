import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { BillingPortal } from './billing-portal';
import { IBillingPortal } from './billing-portal-model';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { BillingPortalClient } from './billing-portal-client';

describe('BillingPortal', () => {
  let component: BillingPortal;
  let fixture: ComponentFixture<BillingPortal>;

  const authMock = {
    getHttpOptions: vi.fn().mockReturnValue({})
  };

  const logMock = {
    error: vi.fn()
  };

  const billingPortalClientMock = {
    getBillingPortal: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [BillingPortal],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: Log, useValue: logMock },
        { provide: BillingPortalClient, useValue: billingPortalClientMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BillingPortal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('openBillingPortal', () => {
    let openSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    });

    afterEach(() => {
      openSpy.mockRestore();
    });

    it('should open the billing portal url in a new tab when one is returned', () => {
      const billingPortal: IBillingPortal = { url: 'https://billing.example.com/session/123' };
      billingPortalClientMock.getBillingPortal.mockReturnValue(of(billingPortal));

      component.openBillingPortal();

      expect(billingPortalClientMock.getBillingPortal).toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalledWith(billingPortal.url, '_blank');
      expect(logMock.error).not.toHaveBeenCalled();
    });

    it('should log an error and not open a tab when billingPortal is null', () => {
      billingPortalClientMock.getBillingPortal.mockReturnValue(of(null));

      component.openBillingPortal();

      expect(logMock.error).toHaveBeenCalledWith(
        'BillingPortalComponent.openBillingPortal: billingPortal is null'
      );
      expect(openSpy).not.toHaveBeenCalled();
    });
  });
});