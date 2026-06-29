import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { MatInput } from '@angular/material/input';

const MIN = 1;
const MAX = 999;

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrl: './quantity.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatInput, ReactiveFormsModule],
})
export class QuantityComponent implements OnInit {
  private readonly snackBarService = inject(SnackBarService);
  private readonly route           = inject(ActivatedRoute);

  readonly quantityControl = new FormControl<number>(MIN, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(MIN)],
  });

  /** Reactive mirror of the control value for use in the template. */
  readonly quantity = signal<number>(MIN);

  readonly min = MIN;
  readonly max = MAX;

  ngOnInit(): void {
    this.setQuantity(this.getParamMapQuantity());

    this.quantityControl.valueChanges.subscribe(value => {
      if (value == null) return;

      if (value < MIN) {
        this.quantityControl.setValue(MIN, { emitEvent: false });
        this.quantity.set(MIN);
      } else if (value > MAX) {
        this.quantityControl.setValue(MAX, { emitEvent: false });
        this.quantity.set(MAX);
        this.snackBarService.info('If you need more than 999 users, please contact support.');
      } else {
        this.quantity.set(value);
      }
    });
  }

  getParamMapQuantity(): number {
    const queryParamMap = this.route.snapshot.queryParamMap;
    return queryParamMap.has('quantity')
      ? Number(queryParamMap.get('quantity'))
      : MIN;
  }

  increment(): void {
    const current = this.quantityControl.value;
    if (current < MAX) {
      this.quantityControl.setValue(current + 1);
    }
  }

  decrement(): void {
    const current = this.quantityControl.value;
    if (current > MIN) {
      this.quantityControl.setValue(current - 1);
    }
  }

  setQuantity(quantity: number): void {
    this.quantityControl.setValue(quantity);
    this.quantity.set(quantity);
  }

  getQuantity(): number {
    return Math.max(MIN, this.quantityControl.value);
  }

  formatLabel(value: number): number {
    return value;
  }
}