import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss']
})
export class QuantityComponent {

  quantity = new UntypedFormControl(1, [Validators.required, Validators.min(1)]);

  formatLabel(value: number) {
    return value;
  }

  getQuantity(): number {
    let ret = this.quantity.value
    if (ret < 1) {
      ret = 1;
    }
    return ret;
  }

  checkValidators(): void {
    if( this.quantity.hasError('required') || this.quantity.hasError('min') ) {
      this.quantity.setValue(1)
    }
  }

}
