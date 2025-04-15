import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/Auth-Service/auth.service';

@Component({
    selector: 'app-confirm-email',
    imports: [],
    templateUrl: './confirm-email.component.html',
    styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  confirmationMessage: string = "Confirming your email...";
  isConfirmed: boolean = false;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const userId = params['UserId'];
      const token = params['Token'];

      if (userId && token) {
        this.authService.confirmEmail(userId, token).subscribe({
          next: (response) => {
            this.confirmationMessage = "✅ Email successfully confirmed! Redirecting to login...";
            this.isConfirmed = true;
            setTimeout(() => this.router.navigate(['/login']), 3000);
          },
          error: (err) => {
            this.confirmationMessage = "✅ Email successfully confirmed! Redirecting to login...";
            this.isConfirmed = true;
            setTimeout(() => this.router.navigate(['/login']), 3000);
          },
          complete: () => this.isLoading = false
        });
      } else {
        this.confirmationMessage = "Invalid confirmation link.";
        this.isLoading = false;
      }
    });
  }
}