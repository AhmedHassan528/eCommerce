import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import RouteUrl from '../../../BaseUrl';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class WishListService {
  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userToken');
    }
    return null;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
      'tenant': "linkedIn"
    });
  }

  constructor(private _http:HttpClient) {}

  getWishListIDs():Observable<any>{
    if(typeof localStorage !== 'undefined'){
      return this._http.get(`${RouteUrl}/api/WishList`, { headers: this.getHeaders() });
    }
    return new Observable();
  }
  getWishListProducts():Observable<any>{
      return this._http.get(`${RouteUrl}/api/WishList/Product`, { headers: this.getHeaders() });

  }

  addToWishList(productId:number):Observable<any>{
    return this._http.post(`${RouteUrl}/api/WishList/add/${productId}`,null, { headers: this.getHeaders() });
  }

  removeFromWishList(productId:number):Observable<any>{
    return this._http.delete(`${RouteUrl}/api/WishList/remove/${productId}`, { headers: this.getHeaders() });
  }

 
}
