import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-forget-password',
    standalone: true,
    imports: [TranslateModule, ReactiveFormsModule, CommonModule],
    templateUrl: './forget-password.component.html',
    styleUrl: './forget-password.component.scss'
})
export class ForgetPasswordComponent {
  servError: string | null = null;
  SucceedMesg: string | null = null;
  isSuccess: boolean = false;
  isLoading: boolean = false;

  constructor(
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastrService: ToastrService,
    private translate: TranslateService
  ) { }

  ForgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email])
  });

  ForgetPassword() {
    if (this.ForgetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    this._authService.forgotPasswords(this.ForgetPasswordForm.get('email')?.value).subscribe({
      next: (res) => {
        this.isSuccess = true;
        this.SucceedMesg = this.translate.instant('Auth.Please check your email for the reset code');
        this._toastrService.success(this.translate.instant('Auth.Please check your email for the reset code'), this.translate.instant('Auth.Success'), {
          timeOut: 2000,
        });
      },
      error: (err) => {
        this.servError = err.error.message;
        this._toastrService.error(err.error.message, this.translate.instant('Auth.Error'), {
          timeOut: 2000,
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
