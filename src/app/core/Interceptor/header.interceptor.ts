import { HttpInterceptorFn } from '@angular/common/http';
import { get } from 'http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {



  if ( typeof localStorage !== 'undefined') {
    if(req.url.includes('orders') || req.url.includes('wishlist')|| req.url.includes('cart')){
      req = req.clone({
        setHeaders: { token: localStorage.getItem('userToken')! }
      })
    }

  }

  return next(req);
};


