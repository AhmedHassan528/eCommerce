import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { privateDecrypt } from 'crypto';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, throwError } from 'rxjs';
import { ToasterService } from '../services/ToasterServices/toaster.service';
import { ToastrService } from 'ngx-toastr';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {

  const loading = inject(NgxSpinnerService);
  const _toastrService = inject(ToastrService);


  return next(req).pipe(catchError((error) => {


    console.log("interceptors ", error);
    loading.hide();
    
    _toastrService.error( error.error.message , error.error.statusMsg, {
      timeOut: 3000,
    });

    return throwError(() => "error");
  }));

};
