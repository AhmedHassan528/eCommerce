import { stringify } from 'querystring';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { ErrorComponent } from "../../../additions/Errors/error/error.component";
import { SucceedComponent } from "../../../additions/Errors/succeed/succeed.component";
import { json } from 'stream/consumers';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [RouterLink, TranslateModule ,RouterLinkActive, ReactiveFormsModule, ErrorComponent, SucceedComponent],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  servError: string | null = null;
  SucceedMesg: string | null = null;

  isLoading: boolean = false;
  steps: number = 1;

  constructor(private _authService: AuthService, private _formBuilder:FormBuilder , private _router:Router) { }

  ForgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  verifyCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required])
  })


  ResetPasswordForm : FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    newPassword: [null, [Validators.required]]
  });


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

    const resetCode = this.verifyCodeForm.get('resetCode')?.value;

    this._authService.ResetCode(resetCode.toString()).subscribe({
      next: (res) => {
        this.steps = 3;
        console.log(res);
      },
      error: (err) => {
        this.servError = err.error.message;
        console.log(err);
      }
    });
  }

  ResetPassword() {

    this.isLoading = true;
    this._authService.ResetPassword(this.ResetPasswordForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('userToken', res.token);
        this._authService.DecodeUserData();

        setTimeout(() => {
          this._router.navigate(['/']);
        }, 1000);      
      },
      error: (err) => {
        this.servError = err.error.message;
        console.log(err);
      }
    });
  }

}
