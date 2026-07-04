import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';
import { of, Subject } from 'rxjs';

import { SeatDetailComponent } from './seat-detail.component';
import { SeatDetailService } from './seat-detail.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { Role } from 'src/app/shared/roles/roles';
import { SeatDetailReply } from '../seats';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeSeat(overrides = {}) {
  return {
    subscriptionID: 'sub-1',
    uid: 'u1',
    email: 'alice@example.com',
    emailVerified: true,
    roles: [Role.Administrator],
    ...overrides,
  };
}

function makeReply(overrides: Partial<SeatDetailReply> = {}): SeatDetailReply {
  return {
    selectedSeat: makeSeat(),
    mySeat: makeSeat({ uid: 'me', email: 'me@example.com', roles: [Role.Administrator, Role.Owner] }),
    ...overrides,
  };
}

// ── Mocks ─────────────────────────────────────────────────────────────────────

function buildMocks() {
  return {
    seatDetailService: {
      getSeat: vi.fn(),
      updateSeat: vi.fn(),
      deleteSeat: vi.fn(),
    },
    authService: { waitForAuth: vi.fn().mockResolvedValue(undefined) },
    logService: { error: vi.fn() },
    snackBarService: { error: vi.fn(), info: vi.fn() },
    returnUrlService: { openReturnURL: vi.fn() },
    dialog: { open: vi.fn() },
    route: {
      snapshot: {
        paramMap: { get: vi.fn((key: string) => key === 'subscriptionID' ? 'sub-1' : 'u1') },
      },
    },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SeatDetailComponent', () => {
  let component: SeatDetailComponent;
  let fixture: ComponentFixture<SeatDetailComponent>;
  let mocks: ReturnType<typeof buildMocks>;

  beforeEach(async () => {
    mocks = buildMocks();
    mocks.seatDetailService.getSeat.mockReturnValue(of(makeReply()));

    await TestBed.configureTestingModule({
      imports: [SeatDetailComponent],
      providers: [
        { provide: SeatDetailService, useValue: mocks.seatDetailService },
        { provide: AuthService, useValue: mocks.authService },
        { provide: LogService, useValue: mocks.logService },
        { provide: SnackBarService, useValue: mocks.snackBarService },
        { provide: ReturnUrlService, useValue: mocks.returnUrlService },
        { provide: MatDialog, useValue: mocks.dialog },
        { provide: ActivatedRoute, useValue: mocks.route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeatDetailComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => vi.clearAllMocks());

  // ── Creation ────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── loadSeatDetail ──────────────────────────────────────────────────────────
  it('loads seat detail and stores reply', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.seatDetailReply()).not.toBeNull();
    expect(component.loading()).toBe(false);
  });

  it('sets error to true when subscriptionID is missing', async () => {
    mocks.route.snapshot.paramMap.get.mockReturnValue(null);
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.error()).toBe(true);
  });

  it('sets error to true when uid is missing', async () => {
    mocks.route.snapshot.paramMap.get.mockImplementation((key: string) =>
      key === 'subscriptionID' ? 'sub-1' : null
    );
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.error()).toBe(true);
  });

  // ── pendingRoles (linkedSignal) ─────────────────────────────────────────────
  it('pendingRoles initialises from reply', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.pendingRoles()).toEqual([Role.Administrator]);
  });

  it('pendingRoles resets when reply changes', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    component.pendingRoles.set([Role.Owner]);
    // Simulate a reload: new reply → linkedSignal resets
    component.seatDetailReply.set(makeReply());
    expect(component.pendingRoles()).toEqual([Role.Administrator]);
  });

  // ── toggleRoleSelection ─────────────────────────────────────────────────────
  it('adds a role when it is not already selected', async () => {
    mocks.seatDetailService.getSeat.mockReturnValue(
      of(makeReply({ selectedSeat: makeSeat({ roles: [] }) }))
    );
    component.loadSeatDetail();
    await fixture.whenStable();

    // Administrator is not an Owner toggle so no dialog opens
    component.toggleRoleSelection(Role.Administrator);
    expect(component.pendingRoles()).toContain(Role.Administrator);
  });

  it('removes a role when it is already selected', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    component.toggleRoleSelection(Role.Administrator);
    expect(component.pendingRoles()).not.toContain(Role.Administrator);
  });

  it('rolls back Owner role when transfer dialog is rejected', async () => {
    const afterClosedSubject = new Subject<boolean>();
    mocks.dialog.open.mockReturnValue({
      afterClosed: () => afterClosedSubject.asObservable(),
    } as MatDialogRef<any>);

    mocks.seatDetailService.getSeat.mockReturnValue(
      of(makeReply({ selectedSeat: makeSeat({ roles: [] }) }))
    );
    component.loadSeatDetail();
    await fixture.whenStable();

    component.toggleRoleSelection(Role.Owner); // adds Owner → opens dialog
    expect(component.pendingRoles()).toContain(Role.Owner);

    afterClosedSubject.next(false); // user clicks "No"
    afterClosedSubject.complete();

    expect(component.pendingRoles()).not.toContain(Role.Owner);
  });

  it('keeps Owner role when transfer dialog is confirmed', async () => {
    const afterClosedSubject = new Subject<boolean>();
    mocks.dialog.open.mockReturnValue({
      afterClosed: () => afterClosedSubject.asObservable(),
    } as MatDialogRef<any>);

    mocks.seatDetailService.getSeat.mockReturnValue(
      of(makeReply({ selectedSeat: makeSeat({ roles: [] }) }))
    );
    component.loadSeatDetail();
    await fixture.whenStable();

    component.toggleRoleSelection(Role.Owner);
    afterClosedSubject.next(true);
    afterClosedSubject.complete();

    expect(component.pendingRoles()).toContain(Role.Owner);
  });

  // ── rolesChanged / canUpdate ────────────────────────────────────────────────
  it('rolesChanged is false when pending matches original', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.rolesChanged()).toBe(false);
    expect(component.canUpdate()).toBe(false);
  });

  it('rolesChanged is true after a role is toggled', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    component.toggleRoleSelection(Role.Administrator); // remove it
    expect(component.rolesChanged()).toBe(true);
    expect(component.canUpdate()).toBe(true);
  });

  it('rolesChanged is true when role count differs', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    component.pendingRoles.set([]);
    expect(component.rolesChanged()).toBe(true);
  });

  // ── canDelete ───────────────────────────────────────────────────────────────
  it('canDelete is true when I am admin and selected is not owner', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.canDelete()).toBe(true);
  });

  it('canDelete is false when selected seat has Owner role', async () => {
    mocks.seatDetailService.getSeat.mockReturnValue(
      of(makeReply({ selectedSeat: makeSeat({ roles: [Role.Owner] }) }))
    );
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.canDelete()).toBe(false);
  });

  it('canDelete is false when I am not an administrator', async () => {
    mocks.seatDetailService.getSeat.mockReturnValue(
      of(makeReply({ mySeat: makeSeat({ uid: 'me', roles: [] }) }))
    );
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.canDelete()).toBe(false);
  });

  // ── shouldOwnerBeDisabled ───────────────────────────────────────────────────
  it('owner chip is enabled when I am owner and selected is not owner', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.shouldOwnerBeDisabled(Role.Owner)).toBe(false);
  });

  it('owner chip is disabled when I am not owner', async () => {
    mocks.seatDetailService.getSeat.mockReturnValue(
      of(makeReply({ mySeat: makeSeat({ uid: 'me', roles: [Role.Administrator] }) }))
    );
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.shouldOwnerBeDisabled(Role.Owner)).toBe(true);
  });

  it('owner chip is disabled when selected seat is already owner', async () => {
    mocks.seatDetailService.getSeat.mockReturnValue(
      of(makeReply({ selectedSeat: makeSeat({ roles: [Role.Owner] }) }))
    );
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.shouldOwnerBeDisabled(Role.Owner)).toBe(true);
  });

  it('non-owner roles are never disabled by shouldOwnerBeDisabled', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    expect(component.shouldOwnerBeDisabled(Role.Administrator)).toBe(false);
  });

  // ── updateSeat ──────────────────────────────────────────────────────────────
  it('shows info snack when nothing changed', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    component.updateSeat();
    expect(mocks.snackBarService.info).toHaveBeenCalledWith('Nothing to update.');
    expect(mocks.seatDetailService.updateSeat).not.toHaveBeenCalled();
  });

  it('calls updateSeat and redirects on success', async () => {
    mocks.seatDetailService.updateSeat.mockReturnValue(of({ seat: makeSeat() }));
    component.loadSeatDetail();
    await fixture.whenStable();

    component.pendingRoles.set([]); // change roles so canUpdate = true
    component.updateSeat();
    await fixture.whenStable();

    expect(mocks.seatDetailService.updateSeat).toHaveBeenCalledOnce();
    expect(mocks.returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  // ── deleteSeat ──────────────────────────────────────────────────────────────
  it('calls deleteSeat and redirects on success', async () => {
    const seat = makeSeat();
    mocks.seatDetailService.deleteSeat.mockReturnValue(of({ success: true, deletedSeat: seat }));
    component.loadSeatDetail();
    await fixture.whenStable();

    component.deleteSeat(seat);
    await fixture.whenStable();

    expect(mocks.seatDetailService.deleteSeat).toHaveBeenCalledOnce();
    expect(mocks.returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  it('shows error when deleteSeat fails (success: false)', async () => {
    const seat = makeSeat();
    mocks.seatDetailService.deleteSeat.mockReturnValue(of({ success: false, deletedSeat: seat }));
    component.loadSeatDetail();
    await fixture.whenStable();

    component.deleteSeat(seat);
    await fixture.whenStable();

    expect(mocks.snackBarService.error).toHaveBeenCalledOnce();
  });

  it('shows error and redirects when subscriptionID is missing on delete', () => {
    mocks.route.snapshot.paramMap.get.mockReturnValue(null);
    component.deleteSeat(makeSeat());
    expect(mocks.snackBarService.error).toHaveBeenCalledOnce();
    expect(mocks.returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  // ── cancel ───────────────────────────────────────────────────────────────────
  it('cancel navigates to dashboard', () => {
    component.cancel();
    expect(mocks.returnUrlService.openReturnURL).toHaveBeenCalledWith('/dashboard');
  });

  // ── Keyboard accessibility ────────────────────────────────────────────────────
  it('handleKeyDown toggles role on Enter', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    const preventSpy = vi.spyOn(event, 'preventDefault');
    component.handleKeyDown(event, Role.Administrator);

    expect(preventSpy).toHaveBeenCalled();
    expect(component.pendingRoles()).not.toContain(Role.Administrator);
  });

  it('handleKeyDown toggles role on Space', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();

    const event = new KeyboardEvent('keydown', { key: ' ' });
    component.handleKeyDown(event, Role.Administrator);
    expect(component.pendingRoles()).not.toContain(Role.Administrator);
  });

  it('handleKeyDown does nothing on other keys', async () => {
    component.loadSeatDetail();
    await fixture.whenStable();
    const before = [...component.pendingRoles()];
    component.handleKeyDown(new KeyboardEvent('keydown', { key: 'Tab' }), Role.Administrator);
    expect(component.pendingRoles()).toEqual(before);
  });
});