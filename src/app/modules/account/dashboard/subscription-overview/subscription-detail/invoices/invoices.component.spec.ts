import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { describe, beforeEach, afterEach, it, expect, vi } from 'vitest';

import { InvoicesComponent } from './invoices.component';
import { InvoicesService } from './invoices.service';
import { InvoiceStatus, ListInvoicesReply } from './invoices';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;

  let invoicesServiceMock: { getInvoices: ReturnType<typeof vi.fn> };
  let authServiceMock: { waitForAuth: ReturnType<typeof vi.fn> };
  let logServiceMock: { error: ReturnType<typeof vi.fn> };
  let permissionServiceMock: { isBilling: ReturnType<typeof vi.fn> };
  let snackBarServiceMock: { error: ReturnType<typeof vi.fn>; infoDuration: ReturnType<typeof vi.fn> };

  const subscriptionID = 'sub_123';

  const buildReply = (overrides: Partial<ListInvoicesReply> = {}): ListInvoicesReply => ({
    subscriptionID,
    totalResults: 1,
    invoices: [
      {
        invoiceID: 'inv_1',
        subscriptionID,
        created: 1700000000,
        total: 1999,
        currency: 'usd',
        status: InvoiceStatus.Paid,
        invoice_pdf: 'https://example.test/inv_1.pdf'
      }
    ],
    ...overrides
  });

  function configureTestBed(paramMapValue: Record<string, string> = { subscriptionID }) {
    // Mocks (esp. spies on globals like window.open) persist their call
    // history across `vi.spyOn` re-application, so clear it before every test.
    vi.clearAllMocks();

    invoicesServiceMock = { getInvoices: vi.fn().mockReturnValue(of(buildReply())) };
    authServiceMock = { waitForAuth: vi.fn().mockResolvedValue(undefined) };
    logServiceMock = { error: vi.fn() };
    permissionServiceMock = { isBilling: vi.fn().mockResolvedValue(true) };
    snackBarServiceMock = { error: vi.fn(), infoDuration: vi.fn() };

    TestBed.configureTestingModule({
      imports: [InvoicesComponent],
      providers: [
        { provide: InvoicesService, useValue: invoicesServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: LogService, useValue: logServiceMock },
        { provide: PermissionService, useValue: permissionServiceMock },
        { provide: SnackBarService, useValue: snackBarServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap(paramMapValue) }
          }
        }
      ]
    });

    fixture = TestBed.createComponent(InvoicesComponent);
    component = fixture.componentInstance;
  }

  afterEach(() => {
    // Fully unpatch globals (e.g. window.open) so other spec files start clean.
    vi.restoreAllMocks();
  });

  describe('basic creation', () => {
    beforeEach(() => {
      configureTestBed();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('permission checks', () => {
    it('should set status to Error and log when subscriptionID is missing', async () => {
      configureTestBed({});
      await fixture.whenStable();

      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(logServiceMock.error).toHaveBeenCalled();
      expect(permissionServiceMock.isBilling).not.toHaveBeenCalled();
    });

    it('should load invoices when the user has billing permission', async () => {
      configureTestBed();
      await fixture.whenStable();

      expect(permissionServiceMock.isBilling).toHaveBeenCalledWith(subscriptionID);
      expect(component.serviceStatus()).toBe(ServiceStatus.Success);
      expect(component.reply()).toEqual(buildReply());
    });

    it('should set status to NoPermission when the user lacks billing permission', async () => {
      configureTestBed();
      permissionServiceMock.isBilling.mockResolvedValue(false);
      await fixture.whenStable();

      expect(component.serviceStatus()).toBe(ServiceStatus.NoPermission);
      expect(invoicesServiceMock.getInvoices).not.toHaveBeenCalled();
    });

    it('should set status to Error and show a snackbar when the permission check throws', async () => {
      configureTestBed();
      permissionServiceMock.isBilling.mockRejectedValue(new Error('boom'));
      await fixture.whenStable();

      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(snackBarServiceMock.error).toHaveBeenCalledWith('An error occurred while checking permissions.');
    });
  });

  describe('getInvoices', () => {
    beforeEach(() => {
      configureTestBed();
    });

    it('should set status to Loading while the request is in flight', async () => {
      // Hold the invoices call open so we can observe the transitional
      // Loading state before resolving it — mirrors the isSubmitting
      // pattern used in AddSeatComponent's spec.
      const subject = new Subject<ListInvoicesReply>();
      invoicesServiceMock.getInvoices.mockReturnValue(subject.asObservable());

      await fixture.whenStable();

      expect(component.serviceStatus()).toBe(ServiceStatus.Loading);

      subject.next(buildReply());
      subject.complete();
      await fixture.whenStable();
    });

    it('should populate reply and set status to Success on a successful response', async () => {
      const reply = buildReply({ totalResults: 42 });
      invoicesServiceMock.getInvoices.mockReturnValue(of(reply));
      await fixture.whenStable();

      expect(component.reply()).toEqual(reply);
      expect(component.serviceStatus()).toBe(ServiceStatus.Success);
    });

    it('should set status to Error when the request fails', async () => {
      invoicesServiceMock.getInvoices.mockReturnValue(throwError(() => new Error('network error')));
      await fixture.whenStable();

      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(logServiceMock.error).toHaveBeenCalled();
    });

    it('should set status to Error when waitForAuth rejects', async () => {
      authServiceMock.waitForAuth.mockRejectedValue(new Error('auth failed'));
      await fixture.whenStable();

      expect(component.serviceStatus()).toBe(ServiceStatus.Error);
      expect(invoicesServiceMock.getInvoices).not.toHaveBeenCalled();
    });

    it('should pass pageSize and subscriptionID in the request', async () => {
      await fixture.whenStable();

      expect(invoicesServiceMock.getInvoices).toHaveBeenCalledWith(
        expect.objectContaining({ subscriptionID, pageSize: component.pageSize() })
      );
    });
  });

  describe('pagination', () => {
    beforeEach(async () => {
      configureTestBed();
      await fixture.whenStable();
      invoicesServiceMock.getInvoices.mockClear();
    });

    it('should request the next page using the last invoice ID when paging forward', async () => {
      const reply = buildReply();
      component['reply'].set(reply);

      component.handlePageEvent({ pageIndex: 1, pageSize: 5, length: 10 } as any);
      await fixture.whenStable();

      const lastInvoiceID = reply.invoices[reply.invoices.length - 1].invoiceID;
      expect(invoicesServiceMock.getInvoices).toHaveBeenCalledWith(
        expect.objectContaining({ startingAfter: lastInvoiceID, endingBefore: undefined })
      );
      expect(component.pageIndex()).toBe(1);
    });

    it('should request the previous page using the first invoice ID when paging backward', async () => {
      const reply = buildReply();
      component['reply'].set(reply);
      component.pageIndex.set(2);

      component.handlePageEvent({ pageIndex: 1, pageSize: 5, length: 10 } as any);
      await fixture.whenStable();

      const firstInvoiceID = reply.invoices[0].invoiceID;
      expect(invoicesServiceMock.getInvoices).toHaveBeenCalledWith(
        expect.objectContaining({ endingBefore: firstInvoiceID, startingAfter: undefined })
      );
      expect(component.pageIndex()).toBe(1);
    });

    it('should not request invoices when the page index is unchanged', async () => {
      component.handlePageEvent({ pageIndex: 0, pageSize: 5, length: 10 } as any);
      await fixture.whenStable();

      expect(invoicesServiceMock.getInvoices).not.toHaveBeenCalled();
    });
  });

  describe('open', () => {
    beforeEach(() => {
      configureTestBed();
      fixture.detectChanges();
      vi.spyOn(window, 'open').mockImplementation(() => null);
    });

    it('should open the invoice PDF and show an info snackbar when invoice_pdf is present', () => {
      const invoice = buildReply().invoices[0];

      component.open(invoice);

      expect(snackBarServiceMock.infoDuration).toHaveBeenCalledWith('Downloading invoice', 2);
      expect(window.open).toHaveBeenCalledWith(invoice.invoice_pdf, '_self');
    });

    it('should show an error snackbar when invoice_pdf is missing', () => {
      const invoice = { ...buildReply().invoices[0], invoice_pdf: '' };

      component.open(invoice);

      expect(snackBarServiceMock.error).toHaveBeenCalledWith('Could not download invoice, please contact support');
      expect(window.open).not.toHaveBeenCalled();
    });
  });

  describe('handleKeyDown', () => {
    beforeEach(() => {
      configureTestBed();
      fixture.detectChanges();
      vi.spyOn(window, 'open').mockImplementation(() => null);
    });

    it('should trigger open() on Enter', () => {
      const invoice = buildReply().invoices[0];
      const openSpy = vi.spyOn(component, 'open');
      const event = new KeyboardEvent('keydown', { key: 'Enter' });

      component.handleKeyDown(event, invoice);

      expect(openSpy).toHaveBeenCalledWith(invoice);
    });

    it('should trigger open() on Space and prevent default scrolling', () => {
      const invoice = buildReply().invoices[0];
      const openSpy = vi.spyOn(component, 'open');
      const event = new KeyboardEvent('keydown', { key: ' ' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.handleKeyDown(event, invoice);

      expect(openSpy).toHaveBeenCalledWith(invoice);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not trigger open() on other keys', () => {
      const invoice = buildReply().invoices[0];
      const openSpy = vi.spyOn(component, 'open');
      const event = new KeyboardEvent('keydown', { key: 'Tab' });

      component.handleKeyDown(event, invoice);

      expect(openSpy).not.toHaveBeenCalled();
    });
  });
});