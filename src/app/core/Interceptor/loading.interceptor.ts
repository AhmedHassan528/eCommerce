import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  const loading = inject(NgxSpinnerService);
  const router = inject(Router);

  if (req.url.includes('wishlist') || req.url.includes('cart')) {
    return next(req);
  }
  loading.show();


  return next(req).pipe( finalize(() => loading.hide()));
};
