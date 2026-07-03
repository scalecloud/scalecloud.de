import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { PaymentChangedRequiresPaymentMethodComponent } from './payment-changed-requires-payment-method.component';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

describe('PaymentChangedRequiresPaymentMethodComponent', () => {
  let component: PaymentChangedRequiresPaymentMethodComponent;
  let fixture: ComponentFixture<PaymentChangedRequiresPaymentMethodComponent>;
  let returnUrlServiceMock: { openUrlKeepReturnUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    returnUrlServiceMock = {
      openUrlKeepReturnUrl: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [PaymentChangedRequiresPaymentMethodComponent],
      providers: [
        { provide: ReturnUrlService, useValue: returnUrlServiceMock }
      ]
    });

    fixture = TestBed.createComponent(PaymentChangedRequiresPaymentMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the failure title', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(title?.textContent).toContain('Failed to process payment details');
  });

  it('should display both informational list items', () => {
    const items = fixture.nativeElement.querySelectorAll('mat-list-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Failed to process payment details. Please try another payment method.');
    expect(items[1].textContent).toContain('You can manage your Subscription in your Dashboard.');
  });

  it('should render a Dashboard button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Dashboard');
  });

  it('should call returnUrlService.openUrlKeepReturnUrl with "/change-payment" when openChangePayment is invoked', () => {
    component.openChangePayment();
    expect(returnUrlServiceMock.openUrlKeepReturnUrl).toHaveBeenCalledTimes(1);
    expect(returnUrlServiceMock.openUrlKeepReturnUrl).toHaveBeenCalledWith('/change-payment');
  });

  it('should call openChangePayment when the Dashboard button is clicked', async () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    await fixture.whenStable();

    expect(returnUrlServiceMock.openUrlKeepReturnUrl).toHaveBeenCalledTimes(1);
    expect(returnUrlServiceMock.openUrlKeepReturnUrl).toHaveBeenCalledWith('/change-payment');
  });
});