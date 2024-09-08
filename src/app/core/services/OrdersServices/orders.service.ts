import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { IAddress } from '../../Interfaces/iaddress';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  HostUrl = 'localhost:4200';

  // getToken(): string | null {
  //   if (typeof localStorage !== 'undefined') {
  //     return localStorage.getItem('userToken');
  //   }
  //   return null;
  // }

  // myHeaders: any = { token: this.getToken() };


  constructor( private _http:HttpClient) { }

  checkoutSession(cartId:string, address:IAddress):Observable<any>{

    return this._http.post(`${RouteUrl}/api/v1/orders/checkout-session/${cartId}?${this.HostUrl}`,
      {
        shippingAddress:{
          details: address.details,
          phone: address.phone,
          city: address.city
        }
      }
      )
  }
}
