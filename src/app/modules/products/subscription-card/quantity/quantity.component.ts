import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
    selector: 'app-quantity',
    templateUrl: './quantity.component.html',
    styleUrls: ['./quantity.component.scss'],
    standalone: false
})
export class QuantityComponent implements OnInit {

  quantityValidator = new UntypedFormControl(1, [Validators.required, Validators.min(1)]);

  constructor(
    private readonly snackBarService: SnackBarService,
    private readonly route: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.setQuantity(this.getParamMapQuantity());

    this.quantityValidator.valueChanges.subscribe(value => {
      if (value === null || value === undefined) return;
      if (value < 1) {
        this.quantityValidator.setValue(1, { emitEvent: false });
      } else if (value > 999) {
        this.quantityValidator.setValue(999, { emitEvent: false });
        this.snackBarService.info('If you need more than 999 users, please contact support.');
      }
    });
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

}
