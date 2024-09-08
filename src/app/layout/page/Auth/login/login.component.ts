import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { ErrorComponent } from "../../../additions/Errors/error/error.component";
import { SucceedComponent } from "../../../additions/Errors/succeed/succeed.component";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, ErrorComponent, SucceedComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  servError: string | null = null;
  isLoading = false;

  setError(message: string) {
    this.servError = message;
  }
  clearError() {
    this.servError = null;
  }


  constructor(private _authService: AuthService,private _router:Router, private _formBuilder:FormBuilder) { }

  LoginForm : FormGroup = this._formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]]
  });


  LoginSubmit() {
    console.log(this.LoginForm); 
    this.isLoading = true;
    this._authService.LoginUser(this.LoginForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading = false;

        localStorage.setItem('userToken', res.token);
        
        this._authService.DecodeUserData();

        setTimeout(() => {
          this._router.navigate(['/']);
        }, 1000);
      },
      error: (err) => {

        this.setError(err.error.message);
        this.isLoading = false;
        console.log(err);
      }
    });
  }
}
