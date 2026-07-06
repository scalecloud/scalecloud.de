import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { of, Subject, throwError } from 'rxjs';
import { AddSeatPage } from './add-seat-page';
import { AddSeatReply } from '../seats-model';
import { Auth } from 'src/app/core/auth/auth';
import { Log } from 'src/app/core/logging/log';
import { ReturnUrl } from 'src/app/core/redirect/return-url';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';
import { AddSeatClient } from './add-seat-client';
import { Role } from 'src/app/core/permission-store/roles';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUBSCRIPTION_ID = 'sub-123';

function makeSuccessReply(email = 'user@example.com'): AddSeatReply {
  return { subscriptionID: SUBSCRIPTION_ID, success: true, email };
}

function makeFailReply(email = 'user@example.com'): AddSeatReply {
  return { subscriptionID: SUBSCRIPTION_ID, success: false, email };
}

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('AddSeatPage', () => {
  let component: AddSeatPage;
  let fixture: ComponentFixture<AddSeatPage>;

  // Mocks
  const addSeatClient = { addSeat: vi.fn() };
  const auth = { waitForAuth: vi.fn(() => Promise.resolve()) };
  const log = { warn: vi.fn(), error: vi.fn() };
  const snackBar = { info: vi.fn(), error: vi.fn() };
  const returnUrl = { openReturnURL: vi.fn() };

  const activatedRouteStub = {
    snapshot: { paramMap: { get: vi.fn(() => SUBSCRIPTION_ID) } },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [AddSeatPage],
      providers: [
        provideRouter([]),
        { provide: AddSeatClient, useValue: addSeatClient },
        { provide: Auth, useValue: auth },
        { provide: Log, useValue: log },
        { provide: SnackBar, useValue: snackBar },
        { provide: ReturnUrl, useValue: returnUrl },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddSeatPage);
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

  // ─── inviteUserRoles ────────────────────────────────────────────────────────

  it('should not include the Owner role', () => {
    expect(component.inviteUserRoles).not.toContain(Role.Owner);
  });

  it('should include Administrator, User and Billing roles', () => {
    expect(component.inviteUserRoles).toContain(Role.Administrator);
    expect(component.inviteUserRoles).toContain(Role.User);
    expect(component.inviteUserRoles).toContain(Role.Billing);
  });

  it('should expose Role string values (not numeric keys)', () => {
    for (const role of component.inviteUserRoles) {
      expect(typeof role).toBe('string');
    }
  });

  it('should contain exactly the non-Owner roles', () => {
    const expected = Object.values(Role).filter((r) => r !== Role.Owner);
    expect(component.inviteUserRoles).toEqual(expected);
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
    await component.addSeat();
    await fixture.whenStable();

    expect(component.email.touched).toBe(true);
    expect(addSeatClient.addSeat).not.toHaveBeenCalled();
  });

  // ─── isEmailInvalid signal ───────────────────────────────────────────────────
  // toSignal bridges FormControl.statusChanges into the signal graph so the
  // computed updates without Zone-based change detection.

  it('should be true initially (empty email)', () => {
    expect(component.isEmailInvalid()).toBe(true);
  });

  it('should be true for a malformed email', async () => {
    component.email.setValue('not-an-email');
    await fixture.whenStable();
    expect(component.isEmailInvalid()).toBe(true);
  });

  it('should be false for a valid email', async () => {
    component.email.setValue('ok@example.com');
    await fixture.whenStable();
    expect(component.isEmailInvalid()).toBe(false);
  });

  it('should transition from true to false as the email becomes valid', async () => {
    component.email.setValue('bad');
    await fixture.whenStable();
    expect(component.isEmailInvalid()).toBe(true);

    component.email.setValue('good@example.com');
    await fixture.whenStable();
    expect(component.isEmailInvalid()).toBe(false);
  });

  it('should transition from false back to true when email becomes invalid again', async () => {
    component.email.setValue('ok@example.com');
    await fixture.whenStable();
    expect(component.isEmailInvalid()).toBe(false);

    component.email.setValue('');
    await fixture.whenStable();
    expect(component.isEmailInvalid()).toBe(true);
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

  it('should not affect other selected roles when one is deselected', () => {
    component.toggleRoleSelection(Role.Administrator);
    component.toggleRoleSelection(Role.User);
    component.toggleRoleSelection(Role.Administrator);
    expect(component.selectedRoles()).toEqual([Role.User]);
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

  it('should not call preventDefault for non-activating keys', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    component.handleKeyDown(event, Role.Administrator);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  // ─── addSeat – success path ──────────────────────────────────────────────────

  it('should call addSeat service and show success snackbar on success', async () => {
    addSeatClient.addSeat.mockReturnValue(of(makeSuccessReply('invited@example.com')));
    component.email.setValue('invited@example.com');
    component.toggleRoleSelection(Role.Administrator);

    await component.addSeat();

    expect(addSeatClient.addSeat).toHaveBeenCalledWith({
      subscriptionID: SUBSCRIPTION_ID,
      email: 'invited@example.com',
      roles: [Role.Administrator],
    });
    expect(snackBar.info).toHaveBeenCalledWith('Invitation sent to invited@example.com.');
    expect(returnUrl.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  it('should call addSeat with an empty roles array when no roles are selected', async () => {
    addSeatClient.addSeat.mockReturnValue(of(makeSuccessReply()));
    component.email.setValue('user@example.com');

    await component.addSeat();

    expect(addSeatClient.addSeat).toHaveBeenCalledWith(
      expect.objectContaining({ roles: [] }),
    );
  });

  it('should reset isSubmitting to false after a successful request', async () => {
    addSeatClient.addSeat.mockReturnValue(of(makeSuccessReply()));
    component.email.setValue('user@example.com');

    await component.addSeat();

    expect(component.isSubmitting()).toBe(false);
  });

  it('should set isSubmitting to true while the request is in flight', async () => {
    const subject = new Subject<AddSeatReply>();
    addSeatClient.addSeat.mockReturnValue(subject.asObservable());
    component.email.setValue('user@example.com');

    const addSeatPromise = component.addSeat();

    // waitForAuth is synchronously resolved; the component is now awaiting firstValueFrom.
    await fixture.whenStable();
    expect(component.isSubmitting()).toBe(true);

    subject.next(makeSuccessReply());
    subject.complete();
    await addSeatPromise;

    expect(component.isSubmitting()).toBe(false);
  });

  // ─── addSeat – failure path ──────────────────────────────────────────────────

  it('should show error snackbar when reply.success is false', async () => {
    addSeatClient.addSeat.mockReturnValue(of(makeFailReply('fail@example.com')));
    component.email.setValue('fail@example.com');

    await component.addSeat();

    expect(snackBar.error).toHaveBeenCalledWith(
      'Could not send invitation to fail@example.com. Please retry.',
    );
    expect(returnUrl.openReturnURL).not.toHaveBeenCalled();
  });

  it('should reset isSubmitting to false after a failed reply', async () => {
    addSeatClient.addSeat.mockReturnValue(of(makeFailReply()));
    component.email.setValue('user@example.com');

    await component.addSeat();

    expect(component.isSubmitting()).toBe(false);
  });

  it('should show error snackbar and log when the HTTP request throws', async () => {
    addSeatClient.addSeat.mockReturnValue(throwError(() => new Error('Network error')));
    component.email.setValue('user@example.com');

    await component.addSeat();

    expect(snackBar.error).toHaveBeenCalledWith(
      'An unexpected error occurred. Please try again.',
    );
    expect(log.error).toHaveBeenCalled();
    expect(component.isSubmitting()).toBe(false);
  });

  it('should show generic error snackbar when no subscriptionID is present', async () => {
    activatedRouteStub.snapshot.paramMap.get.mockReturnValue(null);
    component.email.setValue('user@example.com');

    await component.addSeat();

    expect(snackBar.error).toHaveBeenCalledWith(
      'Currently not possible to invite a user. Please try again later.',
    );
    expect(returnUrl.openReturnURL).toHaveBeenCalledWith('/dashboard');
    expect(addSeatClient.addSeat).not.toHaveBeenCalled();

    activatedRouteStub.snapshot.paramMap.get.mockReturnValue(SUBSCRIPTION_ID);
  });

  it('should not set isSubmitting when subscriptionID is missing', async () => {
    activatedRouteStub.snapshot.paramMap.get.mockReturnValue(null);
    component.email.setValue('user@example.com');

    await component.addSeat();

    expect(component.isSubmitting()).toBe(false);

    activatedRouteStub.snapshot.paramMap.get.mockReturnValue(SUBSCRIPTION_ID);
  });

  it('should log error and reset isSubmitting when waitForAuth rejects', async () => {
    auth.waitForAuth.mockRejectedValueOnce(new Error('Auth failed'));
    component.email.setValue('user@example.com');

    await component.addSeat();

    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining('waitForAuth failed'),
    );
    expect(component.isSubmitting()).toBe(false);
    // HTTP call must not be made after auth failure
    expect(addSeatClient.addSeat).not.toHaveBeenCalled();
  });
});