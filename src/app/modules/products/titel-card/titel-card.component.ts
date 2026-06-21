import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { ProductType } from '../product-model';

@Component({
    selector: 'app-titel-card',
    templateUrl: './titel-card.component.html',
    styleUrls: ['./titel-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
