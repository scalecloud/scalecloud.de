import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';

import { StatusComponent } from './status.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/core/logging/log.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { CheckoutCreateSubscriptionReply } from '../checkout-create-subscription';

describe('StatusComponent', () => {
  let component: StatusComponent;
  let fixture: ComponentFixture<StatusComponent>;

  const authService = { waitForAuth: vi.fn(() => Promise.resolve()) };
  const logService = { info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const snackBarService = { error: vi.fn() };

  async function createComponent(
    queryParams: Partial<CheckoutCreateSubscriptionReply>,
    options: { authError?: Error } = {},
  ): Promise<void> {
    vi.clearAllMocks();
    authService.waitForAuth.mockImplementation(() =>
      options.authError ? Promise.reject(options.authError) : Promise.resolve(),
    );

    await TestBed.configureTestingModule({
      imports: [StatusComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: LogService, useValue: logService },
        { provide: SnackBarService, useValue: snackBarService },
        { provide: ActivatedRoute, useValue: { queryParams: of(queryParams) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  it('should create', async () => {
    await createComponent({ status: 'active', subscriptionID: 'sub-1', productName: 'Pro', email: 'a@b.com' });
    expect(component).toBeTruthy();
  });

  it('should mark active and log success when status is active', async () => {
    await createComponent({ status: 'active', subscriptionID: 'sub-1', productName: 'Pro', email: 'a@b.com' });

    expect(component.active()).toBe(true);
    expect(component.trialing()).toBe(false);
    expect(logService.info).toHaveBeenCalledWith('Success! Your payment method has been saved.');
  });

  it('should mark trialing and log a warning when status is trialing', async () => {
    await createComponent({ status: 'trialing', subscriptionID: 'sub-1', productName: 'Pro', email: 'a@b.com' });

    expect(component.trialing()).toBe(true);
    expect(component.active()).toBe(false);
    expect(logService.warn).toHaveBeenCalledWith(
      "Processing payment details. We'll update you when processing is complete.",
    );
  });

  it('should expose the resolved reply to child components', async () => {
    await createComponent({ status: 'active', subscriptionID: 'sub-1', productName: 'Pro', email: 'a@b.com' });

    expect(component.checkoutCreateSubscriptionReply()?.subscriptionID).toBe('sub-1');
  });

  it('should show an error snackbar when query params are incomplete', async () => {
    await createComponent({ status: 'active', subscriptionID: '' });

    expect(snackBarService.error).toHaveBeenCalledWith(
      'Error: Could not get payment status. Please try again later.',
    );
    expect(component.active()).toBe(false);
    expect(component.trialing()).toBe(false);
  });

  it('should show an error snackbar and log when waitForAuth rejects', async () => {
    await createComponent(
      { status: 'active', subscriptionID: 'sub-1', productName: 'Pro', email: 'a@b.com' },
      { authError: new Error('Auth failed') },
    );

    expect(logService.error).toHaveBeenCalledWith(expect.stringContaining('waitForAuth failed'));
    expect(snackBarService.error).toHaveBeenCalledWith(
      'Error: Could not get payment status. Please try again later.',
    );
    expect(component.checkoutCreateSubscriptionReply()).toBeUndefined();
  });
});