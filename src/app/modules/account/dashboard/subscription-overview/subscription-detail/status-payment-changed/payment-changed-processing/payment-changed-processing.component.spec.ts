import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { PaymentChangedProcessingComponent } from './payment-changed-processing.component';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';

describe('PaymentChangedProcessingComponent', () => {
  let component: PaymentChangedProcessingComponent;
  let fixture: ComponentFixture<PaymentChangedProcessingComponent>;
  let returnUrlServiceMock: { openReturnURL: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    returnUrlServiceMock = {
      openReturnURL: vi.fn()
    };

    TestBed.configureTestingModule({
      imports: [PaymentChangedProcessingComponent],
      providers: [
        { provide: ReturnUrlService, useValue: returnUrlServiceMock }
      ]
    });

    fixture = TestBed.createComponent(PaymentChangedProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the processing title', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(title?.textContent).toContain('Processing payment details');
  });

  it('should display both informational list items', () => {
    const items = fixture.nativeElement.querySelectorAll('mat-list-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Your payment details are being processed.');
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