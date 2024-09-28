import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.scss']
})
export class QuantityComponent implements OnInit {

  quantityValidator = new UntypedFormControl(1, [Validators.required, Validators.min(1)]);

  constructor(
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.setQuantity(this.getParamMapQuantity());
  }

  getParamMapQuantity(): number {
    let quantity = 1;
    const queryParamMap = this.route.snapshot.queryParamMap;
    if (queryParamMap.has('quantity')) {
      quantity = Number(queryParamMap.get('quantity'));
    }
    return quantity;
  }

  increment(): void {
    let currentValue = this.quantityValidator.value;
    if (currentValue < 999) {
      this.quantityValidator.setValue(currentValue + 1);
    }
  }
  
  decrement(): void {
    let currentValue = this.quantityValidator.value;
    if (currentValue > 1) {
      this.quantityValidator.setValue(currentValue - 1);
    }
  }

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
