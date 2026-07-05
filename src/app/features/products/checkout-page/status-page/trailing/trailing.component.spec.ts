import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';

import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';
import { TrailingComponent } from './trailing.component';

describe('TrailingComponent', () => {
  let component: TrailingComponent;
  let fixture: ComponentFixture<TrailingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrailingComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TrailingComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });

  it('should render nothing when no reply is provided', async () => {
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('mat-card')).toBeNull();
  });

  it('should render the product name once a reply is provided', async () => {
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
      subscriptionID: 'sub-1',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Pro Plan');
  });

  it('should show a formatted trial end date when trialEnd is present', async () => {
    const trialEndSeconds = Math.floor(Date.UTC(2026, 5, 1) / 1000);
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
      trialEnd: trialEndSeconds,
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('trial will run until');
    expect(fixture.nativeElement.textContent).not.toContain('NaN');
  });

  it('should not show a trial end row when trialEnd is absent', async () => {
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).not.toContain('trial will run until');
  });

  it('should show the email notice when an email is present', async () => {
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
      email: 'user@example.com',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('user@example.com');
  });
});