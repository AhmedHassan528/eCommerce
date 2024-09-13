import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';
import { ErrorComponent } from '../../../additions/Errors/error/error.component';
import { SucceedComponent } from "../../../additions/Errors/succeed/succeed.component";
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, ErrorComponent, SucceedComponent, TranslateModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../../app.component.scss']
})
export class RegisterComponent {
  servError: string | null = null;
  succeed: boolean = false;
  isLoading = false;

  setError(message: string) {
    this.servError = message;
  }



  constructor(private _authService: AuthService, private _Router:Router) { }

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),

    email: new FormControl(null, [Validators.required, Validators.email]),

    password: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
    rePassword: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),

    phone: new FormControl(null, [Validators.required]),
  }, this.confirmPass);

  registerSubmit() {
    this.isLoading = true;
    this._authService.RegisterUser(this.registerForm.value).subscribe({
      next: (res) => {
        console.log(res);

        setTimeout(() => {
          this._Router.navigate(['/login']);
        }, 2000);
        this.succeed = true;
        this.isLoading = false;
      },
      error: (err) => {
        this.succeed = false;
        this.setError(err.error.message);
        this.isLoading = false;
        console.log(err);
      }
    });
  }

  confirmPass(g : AbstractControl) {
    if (g.get('password')?.value == g.get('rePassword')?.value) {
      return null;
    }else {
      return {mismatch: true};
    }
  }

}

