import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(NgxSpinnerService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      loading.hide();
      
      // Only log errors in development mode
      if (!environment.production) {
        console.log('Error intercepted:', error);
      }

      // Skip error handling for certain URLs or conditions
      if (req.url.includes('background') || req.url.includes('health-check')) {
        return throwError(() => error);
      }

      // Handle specific error codes
      switch (error.status) {
        case 404:
          toastr.error('Resource not found', 'Not Found');
          router.navigate(['/not-found']);
          break;

        case 403:
          // For 403 errors, only show toastr and navigate if it's a page request
          if (req.url.includes('/api/')) {
            toastr.error('You do not have permission to access this resource', 'Access Denied');
            router.navigate(['/unauthorized']);
          }
          break;

        case 401:
          toastr.error('Please login to continue', 'Unauthorized');
          router.navigate(['/login']);
          break;

        default:
          // For other errors, only show toastr for critical errors (500+)
          if (error.status >= 500) {
            const errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
            const errorTitle = error.error?.statusMsg || 'Error';
            toastr.error(errorMessage, errorTitle, {
              timeOut: 3000,
            });
          }
      }

      return throwError(() => error);
    })
  );
};
