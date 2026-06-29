import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, ActivatedRoute }  from '@angular/router';
import { ComponentFixture, TestBed }      from '@angular/core/testing';
import { By }                             from '@angular/platform-browser';

import { describe, beforeEach, it, expect, vi } from 'vitest';

import { QuantityComponent } from './quantity.component';
import { SnackBarService }   from 'src/app/shared/services/snackbar/snack-bar.service';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a minimal ActivatedRoute stub with optional query params. */
function makeRoute(params: Record<string, string> = {}) {
  return {
    snapshot: {
      queryParamMap: {
        has: (key: string) => key in params,
        get: (key: string) => params[key] ?? null,
      },
    },
  };
}

function clickDecrement(fixture: ComponentFixture<QuantityComponent>): void {
  fixture.debugElement.query(By.css('button[aria-label="Decrease quantity"]'))
    .nativeElement.click();
}

function clickIncrement(fixture: ComponentFixture<QuantityComponent>): void {
  fixture.debugElement.query(By.css('button[aria-label="Increase quantity"]'))
    .nativeElement.click();
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('QuantityComponent', () => {
  let component: QuantityComponent;
  let fixture:   ComponentFixture<QuantityComponent>;
  const snackBarService = { info: vi.fn(), error: vi.fn() };

  async function setup(queryParams: Record<string, string> = {}): Promise<void> {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports:   [QuantityComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: SnackBarService, useValue: snackBarService },
        { provide: ActivatedRoute,  useValue: makeRoute(queryParams) },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(QuantityComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  }

  // ── Creation ──────────────────────────────────────────────────────────────

  describe('creation', () => {
    beforeEach(async () => setup());

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('defaults to quantity 1 when no query param is present', () => {
      expect(component.getQuantity()).toBe(1);
      expect(component.quantity()).toBe(1);
    });
  });

  // ── Query-param initialisation ─────────────────────────────────────────────

  describe('initialisation from query param', () => {
    it('reads quantity from the query param', async () => {
      await setup({ quantity: '5' });
      expect(component.getQuantity()).toBe(5);
      expect(component.quantity()).toBe(5);
    });

    it('defaults to 1 when query param is absent', async () => {
      await setup();
      expect(component.getQuantity()).toBe(1);
    });
  });

  // ── increment ─────────────────────────────────────────────────────────────

  describe('increment()', () => {
    beforeEach(async () => setup());

    it('increases quantity by 1', async () => {
      component.increment();
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(2);
    });

    it('does not exceed 999', async () => {
      component.setQuantity(999);
      component.increment();
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(999);
    });

    it('stops at exactly 999', async () => {
      component.setQuantity(998);
      component.increment();
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(999);
    });
  });

  // ── decrement ─────────────────────────────────────────────────────────────

  describe('decrement()', () => {
    beforeEach(async () => setup());

    it('decreases quantity by 1', async () => {
      component.setQuantity(5);
      component.decrement();
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(4);
    });

    it('does not go below 1', async () => {
      component.decrement();
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(1);
    });

    it('stops at exactly 1', async () => {
      component.setQuantity(2);
      component.decrement();
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(1);
    });
  });

  // ── Value clamping via valueChanges ───────────────────────────────────────

  describe('value clamping', () => {
    beforeEach(async () => setup());

    it('clamps values below 1 up to 1', async () => {
      component.quantityControl.setValue(0);
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(1);
      expect(component.quantity()).toBe(1);
    });

    it('clamps values above 999 down to 999', async () => {
      component.quantityControl.setValue(1000);
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(999);
      expect(component.quantity()).toBe(999);
    });

    it('shows a snackbar when the value exceeds 999', async () => {
      component.quantityControl.setValue(1000);
      await fixture.whenStable();
      expect(snackBarService.info).toHaveBeenCalledWith(
        'If you need more than 999 users, please contact support.',
      );
    });

    it('does not show a snackbar for valid values', async () => {
      component.quantityControl.setValue(500);
      await fixture.whenStable();
      expect(snackBarService.info).not.toHaveBeenCalled();
    });

    it('does not show a snackbar when clamping below 1', async () => {
      component.quantityControl.setValue(0);
      await fixture.whenStable();
      expect(snackBarService.info).not.toHaveBeenCalled();
    });
  });

  // ── setQuantity ───────────────────────────────────────────────────────────

  describe('setQuantity()', () => {
    beforeEach(async () => setup());

    it('updates the control value', () => {
      component.setQuantity(42);
      expect(component.quantityControl.value).toBe(42);
    });

    it('updates the quantity signal', () => {
      component.setQuantity(42);
      expect(component.quantity()).toBe(42);
    });
  });

  // ── getQuantity ───────────────────────────────────────────────────────────

  describe('getQuantity()', () => {
    beforeEach(async () => setup());

    it('returns the current control value', () => {
      component.setQuantity(7);
      expect(component.getQuantity()).toBe(7);
    });

    it('returns at least 1 even if the control holds a lower value', () => {
      component.quantityControl.setValue(0, { emitEvent: false });
      expect(component.getQuantity()).toBe(1);
    });
  });

  // ── formatLabel ───────────────────────────────────────────────────────────

  describe('formatLabel()', () => {
    beforeEach(async () => setup());

    it('returns the value unchanged', () => {
      expect(component.formatLabel(42)).toBe(42);
    });
  });

  // ── DOM ───────────────────────────────────────────────────────────────────

  describe('DOM', () => {
    beforeEach(async () => setup());

    it('decrement button is disabled at quantity 1', async () => {
      component.setQuantity(1);
      await fixture.whenStable();
      const btn = fixture.debugElement.query(By.css('button[aria-label="Decrease quantity"]'));
      expect(btn.nativeElement.disabled).toBe(true);
    });

    it('decrement button is enabled above quantity 1', async () => {
      component.setQuantity(2);
      await fixture.whenStable();
      const btn = fixture.debugElement.query(By.css('button[aria-label="Decrease quantity"]'));
      expect(btn.nativeElement.disabled).toBe(false);
    });

    it('increment button is disabled at quantity 999', async () => {
      component.setQuantity(999);
      await fixture.whenStable();
      const btn = fixture.debugElement.query(By.css('button[aria-label="Increase quantity"]'));
      expect(btn.nativeElement.disabled).toBe(true);
    });

    it('increment button is enabled below quantity 999', async () => {
      component.setQuantity(998);
      await fixture.whenStable();
      const btn = fixture.debugElement.query(By.css('button[aria-label="Increase quantity"]'));
      expect(btn.nativeElement.disabled).toBe(false);
    });

    it('clicking increment updates the displayed value', async () => {
      clickIncrement(fixture);
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(2);
    });

    it('clicking decrement updates the displayed value', async () => {
      component.setQuantity(5);
      await fixture.whenStable();
      clickDecrement(fixture);
      await fixture.whenStable();
      expect(component.getQuantity()).toBe(4);
    });
  });
});