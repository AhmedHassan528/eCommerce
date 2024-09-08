import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import RouteUrl from '../../../BaseUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishListService {
  // getToken(): string | null {
  //   if (typeof localStorage !== 'undefined') {
  //     return localStorage.getItem('userToken');
  //   }
  //   return null;
  // }


  // myHeaders: any = { Token: this.getToken() };



  constructor(private _http:HttpClient) { }

  getWishList():Observable<any>{
    return this._http.get(`${RouteUrl}/api/v1/wishlist`);
  }

  addToWishList(productId:string):Observable<any>{
    return this._http.post(`${RouteUrl}/api/v1/wishlist`,{
      productId
    });
  }

  removeFromWishList(productId:string):Observable<any>{
    return this._http.delete(`${RouteUrl}/api/v1/wishlist/${productId}`);
  }
  
}
