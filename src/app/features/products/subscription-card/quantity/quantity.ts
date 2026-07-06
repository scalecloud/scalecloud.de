import {
  Component,
  ChangeDetectionStrategy,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatInput } from '@angular/material/input';
import { SnackBar } from 'src/app/core/snackbar/snack-bar';

const MIN = 1;
const MAX = 999;

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.html',
  styleUrl: './quantity.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatInput, ReactiveFormsModule],
})
export class Quantity implements OnInit {
  private readonly snackBar = inject(SnackBar);
  private readonly route           = inject(ActivatedRoute);

  readonly quantityControl = new FormControl<number>(MIN, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(MIN)],
  });

  /** Reactive mirror of the control value for use in the template. */
  readonly quantity = signal<number>(MIN);

  readonly min = MIN;
  readonly max = MAX;

  // takeUntilDestroyed() needs an injection context (constructor, field
  // initializer, or factory function) because, with no arguments, it calls
  // inject(DestroyRef) internally. ngOnInit() runs later, outside that
  // context, which is what caused NG0203. A field initializer is always a
  // valid injection context, so we grab the DestroyRef here instead and
  // pass it explicitly to takeUntilDestroyed() in ngOnInit — passing it
  // explicitly means takeUntilDestroyed() no longer needs to call inject()
  // itself, so it's safe to use outside an injection context. This also
  // keeps takeUntilDestroyed()'s generic type parameter inferred correctly
  // from the observable it's piped onto, instead of collapsing to
  // `unknown` the way pre-building the operator on its own did.
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.setQuantity(this.getParamMapQuantity());

    // takeUntilDestroyed() unsubscribes automatically when this component is
    // destroyed. Without it, this subscription outlives the component for as
    // long as the FormControl itself is referenced (e.g. from a parent's
    // viewChild), which is a classic subscription-leak antipattern —
    // search "rxjs subscription memory leak angular" if you want more on this.
    this.quantityControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        if (value == null) return;

        if (value < MIN) {
          this.quantityControl.setValue(MIN, { emitEvent: false });
          this.quantity.set(MIN);
        } else if (value > MAX) {
          this.quantityControl.setValue(MAX, { emitEvent: false });
          this.quantity.set(MAX);
          this.snackBar.info('If you need more than 999 users, please contact support.');
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