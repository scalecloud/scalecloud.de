import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ProductType } from '../product-model';
import { MatDivider } from '@angular/material/divider';

@Component({
    selector: 'app-title-card',
    templateUrl: './title-card.html',
    styleUrls: ['./title-card.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDivider]
})
export class TitleCard {

  readonly productType = input<ProductType>(ProductType.Nextcloud);
  
  get isSynology() {
    return this.productType() === ProductType.Synology;
  }

  get isNextcloud() {
    return this.productType() === ProductType.Nextcloud;
  }

}
