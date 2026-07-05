import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-password-match',
    templateUrl: './password-match.html',
    styleUrls: ['./password-match.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon]
})
export class PasswordMatch {
  readonly password = input<string | undefined>(undefined);
  readonly confirmPassword = input<string | undefined>(undefined);

  readonly isMatching = computed(() => {
    const password = this.password();
    const confirmPassword = this.confirmPassword();
    return password != undefined
      && confirmPassword != undefined
      && password.length > 0
      && password === confirmPassword;
  });

  getMessageMatching(): string {
    return 'Passwords must match.';
  }
}