import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { privateDecrypt } from 'crypto';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../services/ToasterServices/toaster.service';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {

  const loading = inject(NgxSpinnerService);

  return next(req).pipe(catchError((error) => {


    console.log("interceptors ", error);
    loading.hide();
    return throwError(() => "error");
  }));

};
