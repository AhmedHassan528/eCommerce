import { stringify } from 'querystring';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { ErrorComponent } from "../../../additions/Errors/error/error.component";
import { SucceedComponent } from "../../../additions/Errors/succeed/succeed.component";
import { json } from 'stream/consumers';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, ErrorComponent, SucceedComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  servError: string | null = null;
  SucceedMesg: string | null = null;

  isLoading: boolean = false;
  steps: number = 1;

  constructor(private _authService: AuthService) { }

  ForgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required])
  })

  ResetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
  })


  confirmPass(g: AbstractControl) {
    if (g.get('newPassword')?.value == g.get('confirmPassword')?.value) {
      return null;
    } else {
      return { mismatch: true };
    }
  }


  ForgetPassword() {
    this.isLoading = true;
    this._authService.forgotPasswords(this.ForgetPasswordForm.value).subscribe({
      next: (res) => {
        this.SucceedMesg = res.message;
        this.steps = 2;
        this.isLoading = false;
        console.log(res);
      },
      error: (err) => {
        this.servError = err.error.message;
        this.isLoading = false;
        console.log(err);
      }
    });
    this.isLoading = false;
  }

  verifyResetCode() {
    this.isLoading = true;

    this._authService.ResetCode(this.verifyCodeForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.steps = 3;
        console.log(res);
      },
      error: (err) => {
        this.servError = err.error.message;
        this.isLoading = false;
        console.log(err);
      }
    });
  }

  ResetPassword() {
    this.isLoading = true;

    this._authService.ResetPassword(this.ResetPasswordForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log(res);
      },
      error: (err) => {
        this.servError = err.error.message;
        this.isLoading = false;
        console.log(err);
      }
    });
  }

}
