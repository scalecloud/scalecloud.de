import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, it, expect } from 'vitest';
import { CheckoutCreateSubscriptionReply } from '../../checkout-create-subscription';
import { ActiveComponent } from './active.component';

describe('ActiveComponent', () => {
  let component: ActiveComponent;
  let fixture: ComponentFixture<ActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ActiveComponent);
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
      email: 'user@example.com',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Pro Plan');
  });

  it('should show the subscription ID when present', async () => {
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
      subscriptionID: 'sub-42',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('sub-42');
  });

  it('should not show a subscription ID row when it is absent', async () => {
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('mat-icon')?.textContent).not.toBe('tag');
  });

  it('should show the email notice when an email is present', async () => {
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
      email: 'user@example.com',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('user@example.com');
  });

  it('should render a Dashboard button', async () => {
    fixture.componentRef.setInput('checkoutCreateSubscriptionReply', {
      productName: 'Pro Plan',
    } as CheckoutCreateSubscriptionReply);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('button')?.textContent).toContain('Dashboard');
  });
});