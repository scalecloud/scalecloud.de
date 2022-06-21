import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.scss']
})
export class PasswordStrengthComponent {

  @Input() password: string | undefined;

  containsLower(): boolean {
    let lower = false;
    if( this.password != undefined) {
      var regex = /[a-z]/
      lower = regex.test(this.password)
    }
    return lower;
  }

  getMessageLower(): string {
    return "Contains at least one lower character.";
  }

  containsUpper(): boolean {
    let upper = false;
    if( this.password != undefined) {
      var regex = /[A-Z]/
      upper = regex.test(this.password)
    }
    return upper;
  }

  getMessageUpper(): string {
    return "Contains at least one upper character.";
  }

  containsDigit(): boolean {
    let digit = false;
    if( this.password != undefined) {
      var regex = /\d/
      digit = regex.test(this.password)
    }
    return digit;
  }

  getMessageDigit(): string {
    return "Contains at least one digit character.";
  }

  containsSpecial(): boolean {
    let special = false;
    if( this.password != undefined) {
      var regex = /\W|_/g
      special = regex.test(this.password)
    }
    return special;
  }

  getMessageSpecial(): string {
    return "Contains at least one special character.";
  }

  isLength(): boolean {
    let length = false;
    if( this.password != undefined ) {
      length = this.password.length >= 8
    }
    return length;
  }

  getMessageLength(): string {
    return "Password is at least 8 characters long.";
  }

  isPasswordStrength(): boolean {
    return this.containsLower() 
    && this.containsUpper()
    && this.containsDigit()
    && this.containsSpecial()
    && this.isLength();
  }

}
