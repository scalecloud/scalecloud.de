import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")]);
  passwordConfirm = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")]);

  ngOnInit(): void {
  }

  getErrorMessageEMail() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassword() {
    var ret = "";
    if (this.password.hasError('required')) {
      ret = 'You must enter a value';
    }
    else if (this.password.hasError('minlength')) {
      ret = 'Password must be at least 8 characters long';
    }
    else if (this.password.hasError('pattern')) {
      ret = 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }
    return ret;
  }

  getErrorMessagePasswordConfirm() {
    var ret = "";
    if (this.passwordConfirm.hasError('required')) {
      ret = 'You must enter a value';
    }
    else if (this.passwordConfirm.hasError('minlength')) {
      ret = 'Password must be at least 8 characters long';
    }
    else if (this.passwordConfirm.hasError('pattern')) {
      ret = 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }
    else if (this.password.value !== this.passwordConfirm.value) {
      ret = 'Passwords did not match';
    }
    return ret;
  }

}
