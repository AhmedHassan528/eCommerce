import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-reset-password',
    imports: [ReactiveFormsModule, TranslateModule],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit {
    servError: string | null = null;
    SucceedMesg: string | null = null;
    isLoading: boolean = false;
    userId: string = '';
    token: string = '';

    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _route: ActivatedRoute,
        private _toastrService: ToastrService
    ) { }

    ResetPasswordForm: FormGroup = this._formBuilder.group({
        newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]],
        confirmPassword: [null, [Validators.required]]
    }, { validators: this.confirmPass });

    ngOnInit() {
        this._route.queryParams.subscribe(params => {
            this.userId = params['UserId'];
            this.token = params['Token'];
            
            if (!this.userId || !this.token) {
                this._router.navigate(['/forget-password']);
                return;
            }
        });
    }

    confirmPass(g: AbstractControl) {
        if (g.get('newPassword')?.value === g.get('confirmPassword')?.value) {
            return null;
        } else {
            return { mismatch: true };
        }
    }

    ResetPassword() {
        if (this.ResetPasswordForm.invalid) {
            return;
        }

        this.isLoading = true;
        const resetData = {
            userId: this.userId,
            token: this.token,
            newPassword: this.ResetPasswordForm.get('newPassword')?.value,
            confirmPassword: this.ResetPasswordForm.get('confirmPassword')?.value
        };

        this._authService.ResetPassword(resetData).subscribe({
            next: (res) => {
                this.SucceedMesg = res;
                this._toastrService.success(res, 'Success', {
                    timeOut: 2000,
                });
                setTimeout(() => {
                    this._router.navigate(['/login']);
                }, 2000);
            },
            error: (err) => {
                const errorMessage = err.error || 'An error occurred while resetting your password';
                this.servError = errorMessage;
                this._toastrService.error(errorMessage, 'Error', {
                    timeOut: 2000,
                });
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }
} 