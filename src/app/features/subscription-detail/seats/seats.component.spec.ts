import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import { SeatsComponent } from './seats.component';
import { SeatsService } from './seats.service';
import { LogService } from 'src/app/core/logging/log.service';
import { SnackBarService } from 'src/app/core/snackbar/snack-bar.service';
import { PermissionService } from 'src/app/core/permission/permission.service';
import { ServiceStatus } from 'src/app/shared/service-status';
import { ListSeatReply } from './seats';
import { of, throwError } from 'rxjs';
import { ReturnUrlService } from 'src/app/core/redirect/return-url.service';
import { Auth } from 'src/app/core/auth/auth';

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeReply(overrides: Partial<ListSeatReply> = {}): ListSeatReply {
  return {
    subscriptionID: 'sub-1',
    maxSeats: 5,
    seats: [
      { subscriptionID: 'sub-1', uid: 'u1', email: 'alice@example.com', emailVerified: true, roles: [] },
      { subscriptionID: 'sub-1', uid: 'u2', email: 'bob@example.com', emailVerified: false, roles: [] },
    ],
    pageIndex: 0,
    totalResults: 2,
    ...overrides,
  };
}

// ── Mocks ─────────────────────────────────────────────────────────────────────

function buildMocks() {
  return {
    seatsService: { getListSeats: vi.fn() },
    auth: { waitForAuth: vi.fn().mockResolvedValue(undefined) },
    logService: { error: vi.fn() },
    snackBarService: { error: vi.fn(), info: vi.fn() },
    returnUrlService: { openUrlAddReturnUrl: vi.fn() },
    permissionService: { isAdministrator: vi.fn().mockResolvedValue(true) },
    route: { snapshot: { paramMap: { get: vi.fn().mockReturnValue('sub-1') } } },
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('SeatsComponent', () => {
  let component: SeatsComponent;
  let fixture: ComponentFixture<SeatsComponent>;
  let mocks: ReturnType<typeof buildMocks>;

  beforeEach(async () => {
    mocks = buildMocks();
    mocks.seatsService.getListSeats.mockReturnValue(of(makeReply()));

    await TestBed.configureTestingModule({
      imports: [SeatsComponent],
      providers: [
        { provide: SeatsService, useValue: mocks.seatsService },
        { provide: Auth, useValue: mocks.auth },
        { provide: LogService, useValue: mocks.logService },
        { provide: SnackBarService, useValue: mocks.snackBarService },
        { provide: ReturnUrlService, useValue: mocks.returnUrlService },
        { provide: PermissionService, useValue: mocks.permissionService },
        { provide: ActivatedRoute, useValue: mocks.route },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SeatsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => vi.clearAllMocks());

  // ── Creation ────────────────────────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Initial state ───────────────────────────────────────────────────────────
  it('starts in Initializing state', () => {
    expect(component.serviceStatus()).toBe(ServiceStatus.Initializing);
  });

  // ── checkPermissions ────────────────────────────────────────────────────────
  it('sets Error when subscriptionID is missing', async () => {
    mocks.route.snapshot.paramMap.get.mockReturnValue(null);
    await component.checkPermissions();
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  it('sets NoPermission when user is not an administrator', async () => {
    mocks.permissionService.isAdministrator.mockResolvedValue(false);
    await component.checkPermissions();
    expect(component.serviceStatus()).toBe(ServiceStatus.NoPermission);
  });

  it('sets Error and shows snackbar when permission check throws', async () => {
    mocks.permissionService.isAdministrator.mockRejectedValue(new Error('network'));
    await component.checkPermissions();
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
    expect(mocks.snackBarService.error).toHaveBeenCalledOnce();
  });

  // ── loadSeats ───────────────────────────────────────────────────────────────
  it('transitions Loading → Success and stores reply', async () => {
    mocks.seatsService.getListSeats.mockReturnValue(of(makeReply()));
    component.loadSeats();
    await fixture.whenStable();
    expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    expect(component.seatListReply()).not.toBeNull();
  });

  it('transitions Loading → Error when API fails', async () => {
    mocks.seatsService.getListSeats.mockReturnValue(throwError(() => new Error('500')));
    component.loadSeats();
    await fixture.whenStable();
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  it('sets Error when subscriptionID missing during loadSeats', async () => {
    mocks.route.snapshot.paramMap.get.mockReturnValue(null);
    component.loadSeats();
    await fixture.whenStable();
    expect(component.serviceStatus()).toBe(ServiceStatus.Error);
  });

  // ── Computed values ─────────────────────────────────────────────────────────
  it('usedSeats returns totalResults', async () => {
    mocks.seatsService.getListSeats.mockReturnValue(of(makeReply({ totalResults: 3 })));
    component.loadSeats();
    await fixture.whenStable();
    expect(component.usedSeats()).toBe(3);
  });

  it('maxSeats returns maxSeats from reply', async () => {
    mocks.seatsService.getListSeats.mockReturnValue(of(makeReply({ maxSeats: 10 })));
    component.loadSeats();
    await fixture.whenStable();
    expect(component.maxSeats()).toBe(10);
  });

  it('isAddSeatPossible is true when seats < maxSeats', async () => {
    mocks.seatsService.getListSeats.mockReturnValue(of(makeReply({
      maxSeats: 5,
      seats: [{ subscriptionID: 'sub-1', uid: 'u1', email: 'a@b.com', emailVerified: true, roles: [] }],
      totalResults: 1,
    })));
    component.loadSeats();
    await fixture.whenStable();
    expect(component.isAddSeatPossible()).toBe(true);
  });

  it('isAddSeatPossible is false when seats === maxSeats', async () => {
    const seats = Array.from({ length: 5 }, (_, i) => ({
      subscriptionID: 'sub-1', uid: `u${i}`, email: `u${i}@x.com`, emailVerified: true, roles: [],
    }));
    mocks.seatsService.getListSeats.mockReturnValue(of(makeReply({ maxSeats: 5, seats, totalResults: 5 })));
    component.loadSeats();
    await fixture.whenStable();
    expect(component.isAddSeatPossible()).toBe(false);
  });

  it('usedSeats / maxSeats default to 0 before data loads', () => {
    expect(component.usedSeats()).toBe(0);
    expect(component.maxSeats()).toBe(0);
  });

  // ── Pagination ──────────────────────────────────────────────────────────────
  it('handlePageEvent updates pageIndex and re-fetches', () => {
    const loadSpy = vi.spyOn(component, 'loadSeats');
    component.handlePageEvent({ pageIndex: 2, pageSize: 5, length: 20 } as any);
    expect(component.pageIndex()).toBe(2);
    expect(loadSpy).toHaveBeenCalledOnce();
  });

  // ── Navigation helpers ──────────────────────────────────────────────────────
  it('addSeat navigates to add-seat URL', () => {
    component.addSeat();
    expect(mocks.returnUrlService.openUrlAddReturnUrl).toHaveBeenCalledWith(
      '/dashboard/subscription/sub-1/add-seat'
    );
  });

  it('addSeat shows error when subscriptionID is missing', () => {
    mocks.route.snapshot.paramMap.get.mockReturnValue(null);
    component.addSeat();
    expect(mocks.snackBarService.error).toHaveBeenCalledOnce();
    expect(mocks.returnUrlService.openUrlAddReturnUrl).not.toHaveBeenCalled();
  });

  it('openSeatDetail navigates to seat-detail URL', () => {
    const seat = { uid: 'u1', email: 'a@b.com' } as any;
    component.openSeatDetail(seat);
    expect(mocks.returnUrlService.openUrlAddReturnUrl).toHaveBeenCalledWith(
      '/dashboard/subscription/sub-1/u1/seat-detail'
    );
  });

  it('openSeatDetail shows error when subscriptionID is missing', () => {
    mocks.route.snapshot.paramMap.get.mockReturnValue(null);
    component.openSeatDetail({ uid: 'u1' } as any);
    expect(mocks.snackBarService.error).toHaveBeenCalledOnce();
  });
});