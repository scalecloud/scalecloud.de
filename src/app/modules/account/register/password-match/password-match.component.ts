import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-password-match',
    templateUrl: './password-match.component.html',
    styleUrls: ['./password-match.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIcon]
})
export class PasswordMatchComponent {
  readonly password = input<string | undefined>(undefined);
  readonly confirmPassword = input<string | undefined>(undefined);

  isMatching(): boolean {
    let matches = false;
    if (this.password != undefined && this.confirmPassword != undefined) {
      matches = this.password().length > 0 && this.password() === this.confirmPassword()
    }
    return matches;
  }

  getMessageMatching(): string {
    return "Passwords must match.";
  }

}
