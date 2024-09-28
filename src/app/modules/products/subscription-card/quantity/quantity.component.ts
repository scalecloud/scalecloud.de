import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss']
})
export class QuantityComponent {

  quantityValidator = new UntypedFormControl(1, [Validators.required, Validators.min(1)]);

  constructor(
    private snackBarService: SnackBarService,
  ) { }

  formatLabel(value: number) {
    return value;
  }

  setQuantity(quantity: number): void {
    this.quantityValidator.setValue(quantity);
  }

  getQuantity(): number {
    let ret = this.quantityValidator.value
    if (ret < 1) {
      ret = 1;
    }
    return ret;
  }

  checkValidators(): void {
    if( this.quantityValidator.hasError('required') || this.quantityValidator.hasError('min') ) {
      this.quantityValidator.setValue(1)
    }
    else if (this.quantityValidator.hasError('max')) {
      this.quantityValidator.setValue(999)
      this.snackBarService.info('If you need more than 999 users, please contact support.')
    }
  }

}
