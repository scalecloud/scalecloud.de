import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { Invoice, InvoiceStatus, ListInvoicesReply, ListInvoicesRequest } from './invoices';
import { InvoicesService } from './invoices.service';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatList, MatListItem } from '@angular/material/list';
import { NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader';
import { MatChip } from '@angular/material/chips';
import { TitleCasePipe, CurrencyPipe, DatePipe } from '@angular/common';
import { LoadingFailedComponent } from '../../../../../../shared/components/loading-failed/loading-failed.component';

@Component({
    selector: 'app-invoices',
    templateUrl: './invoices.component.html',
    styleUrl: './invoices.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatCard, MatProgressBar, MatCardTitle, MatIcon, MatDivider, MatCardContent, MatList, MatListItem, NgxSkeletonLoaderComponent, MatChip, MatPaginator, LoadingFailedComponent, TitleCasePipe, CurrencyPipe, DatePipe]
})
export class InvoicesComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly invoiceService = inject(InvoicesService);
  private readonly logService = inject(LogService);
  private readonly snackBarService = inject(SnackBarService);
  private readonly permissionService = inject(PermissionService);
  private readonly route = inject(ActivatedRoute);

  readonly InvoiceStatus = InvoiceStatus;
  readonly ServiceStatus = ServiceStatus;

  readonly reply = signal<ListInvoicesReply | null>(null);
  readonly serviceStatus = signal<ServiceStatus>(ServiceStatus.Initializing);

  readonly pageSize = signal(5);
  readonly pageIndex = signal(0);

  readonly hidePageSize = true;
  readonly showFirstLastButtons = false;

  ngOnInit(): void {
    this.checkPermissions();
  }

  async checkPermissions(): Promise<void> {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('InvoicesComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    try {
      const hasPermission = await this.permissionService.isBilling(subscriptionID);
      if (hasPermission) {
        await this.getInvoices();
      } else {
        this.serviceStatus.set(ServiceStatus.NoPermission);
      }
    } catch {
      this.serviceStatus.set(ServiceStatus.Error);
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  async getInvoices(startingAfter?: string, endingBefore?: string): Promise<void> {
    this.serviceStatus.set(ServiceStatus.Loading);

    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('InvoicesComponent.getInvoices: subscriptionID is null');
      this.serviceStatus.set(ServiceStatus.Error);
      return;
    }

    try {
      await this.authService.waitForAuth();

      const request: ListInvoicesRequest = {
        subscriptionID,
        pageSize: this.pageSize(),
        startingAfter,
        endingBefore
      };

      const reply = await firstValueFrom(this.invoiceService.getInvoices(request));
      this.reply.set(reply);
      this.serviceStatus.set(ServiceStatus.Success);
    } catch (error) {
      this.logService.error('InvoicesComponent.getInvoices failed: ' + error);
      this.serviceStatus.set(ServiceStatus.Error);
    }
  }

  handlePageEvent(e: PageEvent): void {
    const previousPageIndex = this.pageIndex();
    this.pageIndex.set(e.pageIndex);

    const invoices = this.reply()?.invoices;

    if (e.pageIndex > previousPageIndex) {
      // Navigating to the right
      const lastInvoice = invoices?.[invoices.length - 1];
      this.getInvoices(lastInvoice?.invoiceID, undefined);
    } else if (e.pageIndex < previousPageIndex) {
      // Navigating to the left
      const firstInvoice = invoices?.[0];
      this.getInvoices(undefined, firstInvoice?.invoiceID);
    }
  }

  handleKeyDown(event: KeyboardEvent, invoice: Invoice): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.open(invoice);
    }
  }

  open(invoice: Invoice): void {
    const url = invoice.invoice_pdf;
    if (url) {
      this.snackBarService.infoDuration('Downloading invoice', 2);
      window.open(url, '_self');
    } else {
      this.snackBarService.error('Could not download invoice, please contact support');
    }
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }
}