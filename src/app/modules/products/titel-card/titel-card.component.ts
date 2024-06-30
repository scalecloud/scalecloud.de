import { Component, Input } from '@angular/core';
import { ProductType } from '../product-model';

@Component({
  selector: 'app-titel-card',
  templateUrl: './titel-card.component.html',
  styleUrls: ['./titel-card.component.scss']
})
export class TitelCardComponent {

  @Input() productType: ProductType = ProductType.Nextcloud;
  
  get isSynology() {
    return this.productType === ProductType.Synology;
  }

  get isNextcloud() {
    return this.productType === ProductType.Nextcloud;
  }

}
