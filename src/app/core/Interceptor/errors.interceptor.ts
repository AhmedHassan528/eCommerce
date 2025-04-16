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
        console.log('Error intercepted:', error); // Log to inspect exact error
      }

      // Skip error handling for certain URLs or conditions
      if (req.url.includes('background') || req.url.includes('health-check')) {
        return throwError(() => error);
      }

      // Block specific errors: fetch failed, aborted, and admin.users.error
      if (
        error.message?.toLowerCase().includes('fetch failed') ||
        error.message?.includes('aborted') ||
        error.error?.message === 'admin.users.error' // Exact match for admin.users.error
      ) {
        console.log('Blocked error:', error.message || error.error?.message); // Temporary log to verify
        return throwError(() => error);
      }

      // Handle custom error format
      if (error.error) {
        // Handle case with $id, message, and StatusCode
        if (error.error.$id && error.error.message && error.error.StatusCode) {
          toastr.error(error.error.message, 'Error!', {
            timeOut: 3000,
          });
          return throwError(() => error);
        }
        // Handle case with just message
        else if (error.error.message) {
          toastr.error(error.error.message, 'Error!', {
            timeOut: 3000,
          });
          return throwError(() => error);
        }
      }

      // Handle network errors (status 0, excluding fetch failures handled above)
      if (error.status === 0) {
        if (!req.url.includes('background')) {
          toastr.error('Network error. Please check your connection and try again.', 'Error!', {
            timeOut: 3000,
          });
        }
        return throwError(() => error);
      }

      // Handle specific error codes
      switch (error.status) {
        case 404:
          toastr.error('Resource not found', 'Not Found');
          router.navigate(['/not-found']);
          break;

        case 403:
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