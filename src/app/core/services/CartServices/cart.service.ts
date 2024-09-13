import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCount:BehaviorSubject<number> = new BehaviorSubject(0);


  constructor(private _http: HttpClient) { }


  getCartItems():Observable<any> {
    if(typeof localStorage !== 'undefined'){
      return this._http.get(`${RouteUrl}/api/v1/cart`);
    }
    return new Observable();
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
