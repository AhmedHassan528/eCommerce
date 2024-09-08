import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import RouteUrl from '../../../BaseUrl';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor(private _http:HttpClient) { }

  getAllBrands():Observable<any>{
    return this._http.get(`${RouteUrl}/api/v1/brands`);
  }

  getBrandById(id:any):Observable<any>{
    return this._http.get(`${RouteUrl}/api/v1/brands/${id}`);
  }

}
