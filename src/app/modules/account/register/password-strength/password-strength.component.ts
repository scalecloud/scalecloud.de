import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface PasswordStrengthCheck {
  readonly passed: boolean;
  readonly message: string;
}

@Component({
    selector: 'app-password-strength',
    templateUrl: './password-strength.component.html',
    styleUrls: ['./password-strength.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon]
})
export class PasswordStrengthComponent {
  readonly password = input<string | undefined>(undefined);

  readonly containsLower = computed(() => /[a-z]/.test(this.password() ?? ''));
  readonly containsUpper = computed(() => /[A-Z]/.test(this.password() ?? ''));
  readonly containsDigit = computed(() => /\d/.test(this.password() ?? ''));
  readonly containsSpecial = computed(() => /[\W_]/.test(this.password() ?? ''));
  readonly isLength = computed(() => (this.password() ?? '').length >= 8);

  readonly isPasswordStrength = computed(() =>
    this.containsLower()
    && this.containsUpper()
    && this.containsDigit()
    && this.containsSpecial()
    && this.isLength()
  );

  readonly checks = computed<readonly PasswordStrengthCheck[]>(() => [
    { passed: this.containsLower(), message: 'Contains at least one lower character.' },
    { passed: this.containsUpper(), message: 'Contains at least one upper character.' },
    { passed: this.containsDigit(), message: 'Contains at least one digit character.' },
    { passed: this.containsSpecial(), message: 'Contains at least one special character.' },
    { passed: this.isLength(), message: 'Password is at least 8 characters long.' },
  ]);
}