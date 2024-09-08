import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor( private _http:HttpClient) { }


  // Get all items
  getItems(): Observable<any>{
    return this._http.get(`${RouteUrl}/api/v1/products`);
  }
  
  getItemDetails(id:string | null): Observable<any>{
    return this._http.get(`${RouteUrl}/api/v1/products/${id}`);
  }
}
