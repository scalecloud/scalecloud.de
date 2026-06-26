import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { ChangePaymentComponent } from './change-payment.component';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ChangePaymentService } from './change-payment.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { ServiceStatus } from 'src/app/shared/services/service-status';

@Component({
  selector: 'app-stripe-payment-element',
  template: ''
})
class StripePaymentElementStubComponent {
  serviceStatus = ServiceStatus.Success;
  initPaymentElement = vi.fn();
  submitIntent = vi.fn();
}

describe('ChangePaymentComponent', () => {
  let component: ChangePaymentComponent;
  let fixture: ComponentFixture<ChangePaymentComponent>;
  const authServiceMock = {
    waitForAuth: vi.fn().mockResolvedValue(void 0)
  };
  const changePaymentServiceMock = {
    getChangePaymentSetupIntent: vi.fn().mockReturnValue(of({
      clientsecret: 'test-secret',
      email: 'test@example.com'
    }))
  };
  const logServiceMock = {
    info: vi.fn(),
    error: vi.fn()
  };
  const returnUrlServiceMock = {
    getSpecifiedUrlWithReturnUrl: vi.fn().mockReturnValue('/dashboard/change-payment/status'),
    openReturnURL: vi.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePaymentComponent, StripePaymentElementStubComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ChangePaymentService, useValue: changePaymentServiceMock },
        { provide: LogService, useValue: logServiceMock },
        { provide: ReturnUrlService, useValue: returnUrlServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call change payment method when stripe element exists', () => {
    const stripeComponent = fixture.debugElement.query(
      (de) => de.componentInstance instanceof StripePaymentElementStubComponent
    );

    component.stripePaymentElementComponent = stripeComponent?.componentInstance as any;
    component.changePaymentMethod();

    expect(stripeComponent?.componentInstance.submitIntent).toHaveBeenCalledWith({
      return_url: '/dashboard/change-payment/status'
    });
  });
});
