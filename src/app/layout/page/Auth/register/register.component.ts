import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { ErrorComponent } from '../../../additions/Errors/error/error.component';
import { SucceedComponent } from "../../../additions/Errors/succeed/succeed.component";
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-register',
    imports: [ReactiveFormsModule, ErrorComponent, SucceedComponent, TranslateModule],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss', '../../../../app.component.scss']
})
export class RegisterComponent {
  servError: string | null = null;
  succeed: boolean = false;
  isLoading = false;
    private readonly _toastrService = inject(ToastrService);
  

  setError(message: string) {
    this.servError = message;
  }



  constructor(private _authService: AuthService, private _Router:Router) { }

  registerForm: FormGroup = new FormGroup({
    UserName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    FirstName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    LastName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),

    Email: new FormControl(null, [Validators.required, Validators.email]),

    Password: new FormControl(null, [Validators.required,   Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]),
    rePassword: new FormControl(null, [Validators.required,   Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)]),
  }, this.confirmPass);

  registerSubmit() {
    this.isLoading = true;
    console.log(this.registerForm.value)
    this._authService.RegisterUser(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(res);

        this._toastrService.success(res.message, 'Success', {
          timeOut: 10000,
        });

        this.isLoading = false;
      },
      error: (err) => {
        this.succeed = false;
        this.setError(err.error.message);
        this.isLoading = false;
        console.log(err);
      }
    });
    this.isLoading = false;

  }

  confirmPass(g : AbstractControl) {
    if (g.get('Password')?.value == g.get('rePassword')?.value) {
      return null;
    }else {
      return {mismatch: true};
    }
  }

}

