import { Component } from '@angular/core';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.scss']
})
export class PaymentOverviewComponent {


  getPaymentMethod(): string {
    return this.getBrand() + ' ' + this.getLast4() + ' ' + this.getExpiration();
  }

  getID(): string {
    return 'pm_1NJycCA86yrbtIQrba0rzK9F';
  }

  getBrand(): string {
    return 'Visa';
  }

  getLast4(): string {
    return '•••• 4242';
  }

  getExpiration(): string {
    return 'Expires on 11/2025';
  }
}
