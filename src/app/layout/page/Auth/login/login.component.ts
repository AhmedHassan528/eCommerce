import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    imports: [RouterLink, ReactiveFormsModule, TranslateModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading = false;

  private readonly _toastrService = inject(ToastrService);

  constructor(private _authService: AuthService,private _router:Router, private _formBuilder:FormBuilder) { }

  LoginForm : FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]]
  });


  LoginSubmit() {
    if (this.LoginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this._authService.LoginUser(this.LoginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        localStorage.setItem('userToken', res.Token);
        this._authService.DecodeUserData();

        this._toastrService.success(res.message, 'Success', {
          timeOut: 2000,
        });

        this._router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this._toastrService.error(err.error.message || 'Login failed', 'Error', {
          timeOut: 2000,
        });
      }
    });
  }
}
