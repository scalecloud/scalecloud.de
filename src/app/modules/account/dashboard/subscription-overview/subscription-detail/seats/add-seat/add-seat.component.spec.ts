import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';

import { AddSeatComponent } from './add-seat.component';
import { AddSeatService } from './add-seat.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { Role } from 'src/app/shared/roles/roles';
import { AddSeatReply } from '../seats';
import { provideZonelessChangeDetection } from '@angular/core';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUBSCRIPTION_ID = 'sub-123';

function makeSuccessReply(email = 'user@example.com'): AddSeatReply {
  return { subscriptionID: SUBSCRIPTION_ID, success: true, email };
}

function makeFailReply(email = 'user@example.com'): AddSeatReply {
  return { subscriptionID: SUBSCRIPTION_ID, success: false, email };
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('AddSeatComponent', () => {
  let component: AddSeatComponent;
  let fixture: ComponentFixture<AddSeatComponent>;

  // Mocks
  const addSeatService = { addSeat: vi.fn() };
  const authService = { waitForAuth: vi.fn(() => Promise.resolve()) };
  const logService = { warn: vi.fn(), error: vi.fn() };
  const snackBarService = { info: vi.fn(), error: vi.fn() };
  const returnUrlService = { openReturnURL: vi.fn() };

  const activatedRouteStub = {
    snapshot: { paramMap: { get: vi.fn(() => SUBSCRIPTION_ID) } },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [AddSeatComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: AddSeatService, useValue: addSeatService },
        { provide: AuthService, useValue: authService },
        { provide: LogService, useValue: logService },
        { provide: SnackBarService, useValue: snackBarService },
        { provide: ReturnUrlService, useValue: returnUrlService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSeatComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ─── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─── Initial state ──────────────────────────────────────────────────────────

  it('should initialise with an empty email field', () => {
    expect(component.email.value).toBe('');
  });

  it('should initialise with no roles selected', () => {
    expect(component.selectedRoles()).toEqual([]);
  });

  it('should initialise isSubmitting as false', () => {
    expect(component.isSubmitting()).toBe(false);
  });

  it('should not include the Owner role in inviteUserRoles', () => {
    const ownerLabel = Role[Role.Owner];
    expect(component.inviteUserRoles).not.toContain(ownerLabel);
  });

  // ─── Email validation ────────────────────────────────────────────────────────

  it('should return required error message when email is empty', () => {
    component.email.setValue('');
    component.email.markAsTouched();
    expect(component.getEmailErrorMessage()).toBe('E-mail address is required');
  });

  it('should return format error message for an invalid email', () => {
    component.email.setValue('not-an-email');
    component.email.markAsTouched();
    expect(component.getEmailErrorMessage()).toBe('Enter a valid e-mail address');
  });

  it('should return an empty string when the email is valid', () => {
    component.email.setValue('valid@example.com');
    expect(component.getEmailErrorMessage()).toBe('');
  });

  it('should mark email as touched and not call addSeat when email is invalid', async () => {
    component.email.setValue('');
    component.addSeat();
    await fixture.whenStable();

    expect(component.email.touched).toBe(true);
    expect(addSeatService.addSeat).not.toHaveBeenCalled();
  });

  // ─── Role selection ──────────────────────────────────────────────────────────

  it('should add a role when toggled for the first time', () => {
    component.toggleRoleSelection(Role.Administrator);
    expect(component.selectedRoles()).toContain(Role.Administrator);
  });

  it('should remove a role when toggled a second time', () => {
    component.toggleRoleSelection(Role.Administrator);
    component.toggleRoleSelection(Role.Administrator);
    expect(component.selectedRoles()).not.toContain(Role.Administrator);
  });

  it('should support multiple roles selected simultaneously', () => {
    component.toggleRoleSelection(Role.Administrator);
    component.toggleRoleSelection(Role.User);
    expect(component.selectedRoles()).toEqual([Role.Administrator, Role.User]);
  });

  // ─── Keyboard handler ────────────────────────────────────────────────────────

  it('should toggle role on Enter key', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    component.handleKeyDown(event, Role.Administrator);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.selectedRoles()).toContain(Role.Administrator);
  });

  it('should toggle role on Space key', () => {
    const event = new KeyboardEvent('keydown', { key: ' ' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    component.handleKeyDown(event, Role.Administrator);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(component.selectedRoles()).toContain(Role.Administrator);
  });

  it('should not toggle role on other keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    component.handleKeyDown(event, Role.Administrator);
    expect(component.selectedRoles()).not.toContain(Role.Administrator);
  });

  // ─── addSeat – success path ──────────────────────────────────────────────────

  it('should call addSeat service and show success snackbar on success', async () => {
    addSeatService.addSeat.mockReturnValue(of(makeSuccessReply('invited@example.com')));
    component.email.setValue('invited@example.com');
    component.toggleRoleSelection(Role.Administrator);

    component.addSeat();
    await fixture.whenStable();

    expect(addSeatService.addSeat).toHaveBeenCalledWith({
      subscriptionID: SUBSCRIPTION_ID,
      email: 'invited@example.com',
      roles: [Role.Administrator],
    });
    expect(snackBarService.info).toHaveBeenCalledWith('Invitation sent to invited@example.com.');
    expect(returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  it('should reset isSubmitting to false after a successful request', async () => {
    addSeatService.addSeat.mockReturnValue(of(makeSuccessReply()));
    component.email.setValue('user@example.com');

    component.addSeat();
    await fixture.whenStable();

    expect(component.isSubmitting()).toBe(false);
  });

  // ─── addSeat – failure path ──────────────────────────────────────────────────

  it('should show error snackbar when reply.success is false', async () => {
    addSeatService.addSeat.mockReturnValue(of(makeFailReply('fail@example.com')));
    component.email.setValue('fail@example.com');

    component.addSeat();
    await fixture.whenStable();

    expect(snackBarService.error).toHaveBeenCalledWith(
      'Could not send invitation to fail@example.com. Please retry.'
    );
    expect(returnUrlService.openReturnURL).not.toHaveBeenCalled();
  });

  it('should show error snackbar and log when the HTTP request throws', async () => {
    addSeatService.addSeat.mockReturnValue(throwError(() => new Error('Network error')));
    component.email.setValue('user@example.com');

    component.addSeat();
    await fixture.whenStable();

    expect(snackBarService.error).toHaveBeenCalledWith(
      'An unexpected error occurred. Please try again.'
    );
    expect(logService.error).toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  it('should show generic error snackbar and log when no subscriptionID is present', async () => {
    activatedRouteStub.snapshot.paramMap.get.mockReturnValue(null);
    component.email.setValue('user@example.com');

    component.addSeat();
    await fixture.whenStable();

    expect(snackBarService.error).toHaveBeenCalledWith(
      'Currently not possible to invite a user. Please try again later.'
    );
    expect(returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
    expect(addSeatService.addSeat).not.toHaveBeenCalled();

    // Restore for subsequent tests
    activatedRouteStub.snapshot.paramMap.get.mockReturnValue(SUBSCRIPTION_ID);
  });

  it('should log error and reset isSubmitting when waitForAuth rejects', async () => {
    authService.waitForAuth.mockRejectedValueOnce(new Error('Auth failed'));
    component.email.setValue('user@example.com');
    addSeatService.addSeat.mockReturnValue(of(makeSuccessReply()));

    component.addSeat();
    await fixture.whenStable();

    expect(logService.error).toHaveBeenCalledWith(expect.stringContaining('waitForAuth failed'));
    expect(component.isSubmitting()).toBe(false);
  });

  // ─── isEmailInvalid computed ─────────────────────────────────────────────────

  it('isEmailInvalid should be true for an empty email', () => {
    component.email.setValue('');
    expect(component.isEmailInvalid()).toBe(true);
  });

  it('isEmailInvalid should be false for a valid email', () => {
    component.email.setValue('ok@example.com');
    expect(component.isEmailInvalid()).toBe(false);
  });
});