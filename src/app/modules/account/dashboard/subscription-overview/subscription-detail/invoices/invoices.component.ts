import { Component, OnInit } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Invoice, InvoiceStatus, ListInvoicesReply, ListInvoicesRequest } from './invoices';
import { InvoicesService } from './invoices.service';

@Component({
    selector: 'app-invoices',
    templateUrl: './invoices.component.html',
    styleUrl: './invoices.component.scss',
    standalone: false
})
export class InvoicesComponent implements OnInit {
  reply: ListInvoicesReply | null;
  InvoiceStatus = InvoiceStatus;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  pageSize = 5;
  pageIndex = 0;

  hidePageSize = true;
  showFirstLastButtons = false;

  pageEvent: PageEvent;

  constructor(
    private readonly authService: AuthService,
    private readonly invoiceService: InvoicesService,
    private readonly logService: LogService,
    private readonly snackBarService: SnackBarService,
    private readonly permissionService: PermissionService,
    private readonly route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.checkPermissions();
  }

  async checkPermissions() {
    const subscriptionID = this.getSubscriptionID();
    if (!subscriptionID) {
      this.logService.error('SeatsComponent.checkPermissions: subscriptionID is null');
      this.serviceStatus = ServiceStatus.Error;
      return;
    }

    try {
      const hasPermission = await this.permissionService.isBilling(subscriptionID);
      if (hasPermission) {
        this.getInvoices();
      } else {
        this.serviceStatus = ServiceStatus.NoPermission;
      }
    } catch (error) {
      this.serviceStatus = ServiceStatus.Error;
      this.snackBarService.error('An error occurred while checking permissions.');
    }
  }

  getInvoices(startingAfter?: string, endingBefore?: string): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (!subscriptionID) {
        this.logService.error('SeatsComponent.getSeatsList: subscriptionID is null');
      } else {
        let request: ListInvoicesRequest = {
          subscriptionID: subscriptionID,
          pageSize: this.pageSize,
          startingAfter: startingAfter,
          endingBefore: endingBefore
        };
        this.invoiceService.getInvoices(request)
          .subscribe({
            next: reply => {
              this.reply = reply;
              this.serviceStatus = ServiceStatus.Success;
            },
            error: error => {
              this.serviceStatus = ServiceStatus.Error;
            }
          });
      }
    }).catch((error) => {
      this.logService.error("waitForAuth failed: " + error);
      this.serviceStatus = ServiceStatus.Error;
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    const previousPageIndex = this.pageIndex;
    this.pageIndex = e.pageIndex;

    if (this.pageIndex > previousPageIndex) {
      // Navigating to the right
      const lastInvoice = this.reply?.invoices[this.reply.invoices.length - 1];
      this.getInvoices(lastInvoice?.invoiceID, null);
    } else if (this.pageIndex < previousPageIndex) {
      // Navigating to the left
      const firstInvoice = this.reply?.invoices[0];
      this.getInvoices(null, firstInvoice?.invoiceID);
    }
  }

  handleKeyDown(event: KeyboardEvent, invoice: any) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.open(invoice);
    }
  }

  open(invoice: Invoice): void {
    let url = invoice.invoice_pdf
    if (url) {
      this.snackBarService.infoDuration('Downloading invoice', 2);
      window.open(url, '_self');
    }
    else {
      this.snackBarService.error('Could not download invoice, please contact support');
    }
  }

  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }

}
