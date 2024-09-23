import { Component, OnInit } from '@angular/core';
import { ServiceStatus } from 'src/app/shared/services/service-status';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LogService } from 'src/app/shared/services/log/log.service';
import { PermissionService } from 'src/app/shared/services/permission/permission.service';
import { ReturnUrlService } from 'src/app/shared/services/redirect/return-url.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { SeatsService } from '../seats/seats.service';
import { ListInvoicesReply, ListInvoicesRequest } from './invoices';
import { InvoicesService } from './invoices.service';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.scss'
})
export class InvoicesComponent implements OnInit {
  reply: ListInvoicesReply | null;
  ServiceStatus = ServiceStatus;
  serviceStatus = ServiceStatus.Initializing;

  pageSize = 5;
  pageIndex = 0;

  hidePageSize = true;
  showFirstLastButtons = false;

  pageEvent: PageEvent;

  constructor(
    public authService: AuthService,
    private invoiceService: InvoicesService,
    private logService: LogService,
    private snackBarService: SnackBarService,
    private returnUrlService: ReturnUrlService,
    private permissionService: PermissionService,
    private route: ActivatedRoute,
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
    }
  }

  getInvoices(): void {
    this.serviceStatus = ServiceStatus.Loading;
    this.authService.waitForAuth().then(() => {
      const subscriptionID = this.getSubscriptionID();
      if (!subscriptionID) {
        this.logService.error('SeatsComponent.getSeatsList: subscriptionID is null');
      } else {
        let request: ListInvoicesRequest = {
          subscriptionID: subscriptionID,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
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


  getSubscriptionID(): string {
    return this.route.snapshot.paramMap.get('subscriptionID') || '';
  }

}
