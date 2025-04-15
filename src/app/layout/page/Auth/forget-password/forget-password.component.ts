import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { ErrorComponent } from "../../../additions/Errors/error/error.component";
import { SucceedComponent } from "../../../additions/Errors/succeed/succeed.component";
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-forget-password',
    imports: [TranslateModule, ReactiveFormsModule, ErrorComponent, SucceedComponent],
    templateUrl: './forget-password.component.html',
    styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  servError: string | null = null;
  SucceedMesg: string | null = null;

  isLoading: boolean = false;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastrService: ToastrService
  ) { }

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
    if (this.ForgetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this._authService.forgotPasswords(this.ForgetPasswordForm.value).subscribe({
      next: (res) => {
        this.SucceedMesg = res.message;
        this._toastrService.success(res.message, 'Success', {
          timeOut: 2000,
        });
        // Store the userId and token in localStorage for the reset password page
        if (res.userId && res.token) {
          localStorage.setItem('resetUserId', res.userId);
          localStorage.setItem('resetToken', res.token);
          // Navigate to reset password page with query parameters
          this._router.navigate(['/reset-password'], {
            queryParams: {
              userId: res.userId,
              token: res.token
            }
          });
        }
      },
      error: (err) => {
        this.servError = err.error.message;
        this._toastrService.error(err.error.message, 'Error', {
          timeOut: 2000,
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}
