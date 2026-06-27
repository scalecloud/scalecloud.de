import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ProductType } from '../product-model';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-titel-card',
    templateUrl: './titel-card.component.html',
    styleUrls: ['./titel-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDivider]
})
export class TitelCardComponent {

  readonly productType = input<ProductType>(ProductType.Nextcloud);
  
  get isSynology() {
    return this.productType() === ProductType.Synology;
  }

  get isNextcloud() {
    return this.productType() === ProductType.Nextcloud;
  }

}
