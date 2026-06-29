import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { PaymentChangedSucceededComponent } from './payment-changed-succeeded.component';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

describe('PaymentChangedSucceededComponent', () => {
  let component: PaymentChangedSucceededComponent;
  let fixture: ComponentFixture<PaymentChangedSucceededComponent>;
  let returnUrlServiceMock: { openReturnURL: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    returnUrlServiceMock = {
      openReturnURL: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [PaymentChangedSucceededComponent],
      providers: [
        { provide: ReturnUrlService, useValue: returnUrlServiceMock }
      ]
    });

    fixture = TestBed.createComponent(PaymentChangedSucceededComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the success title', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(title?.textContent).toContain('Success');
  });

  it('should display both informational list items', () => {
    const items = fixture.nativeElement.querySelectorAll('mat-list-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Your payment method has been saved.');
    expect(items[1].textContent).toContain('You can manage your Subscription in your Dashboard.');
  });

  it('should render a Return button', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Return');
  });

  it('should call returnUrlService.openReturnURL with "/dashboard" when openReturnUrl is invoked', () => {
    component.openReturnUrl();
    expect(returnUrlServiceMock.openReturnURL).toHaveBeenCalledTimes(1);
    expect(returnUrlServiceMock.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  it('should call openReturnUrl when the Return button is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();

    expect(returnUrlServiceMock.openReturnURL).toHaveBeenCalledTimes(1);
    expect(returnUrlServiceMock.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });
});