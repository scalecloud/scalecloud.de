import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-password-match',
    templateUrl: './password-match.component.html',
    styleUrls: ['./password-match.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatIcon]
})
export class PasswordMatchComponent {
  @Input() password: string | undefined;
  @Input() confirmPassword: string | undefined;

  isMatching(): boolean {
    let matches = false;
    if (this.password != undefined && this.confirmPassword != undefined) {
      matches = this.password.length > 0 && this.password === this.confirmPassword
    }
    return matches;
  }

  getMessageMatching(): string {
    return "Passwords must match.";
  }

}
