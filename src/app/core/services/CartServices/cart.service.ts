import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  // getToken(): string | null {
  //   if (typeof localStorage !== 'undefined') {
  //     return localStorage.getItem('userToken');
  //   }
  //   return null;
  // }

  constructor(private _http: HttpClient) { }

  // myHeaders: any = { Token: this.getToken() };

  getCartItems():Observable<any> {
    return this._http.get(`${RouteUrl}/api/v1/cart`);
  }

  addCartItem(id: string):Observable<any> {
    return this._http.post(`${RouteUrl}/api/v1/cart`, {
      productId: id
    }
    );
  }
  
  deleteCartItem(id: string): Observable<any> {
    return this._http.delete(`${RouteUrl}/api/v1/cart/${id}`);
  }

  ClearCar(): Observable<any> {
    return this._http.delete(`${RouteUrl}/api/v1/cart`);
  }

  EditQuantity(id:string, QTY:number): Observable<any> {
    console.log(QTY )
    return this._http.put(`${RouteUrl}/api/v1/cart/${id}`,{
      count : QTY
    });
  }

}
