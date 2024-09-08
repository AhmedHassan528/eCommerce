import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { get } from 'http';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private _httpClint:HttpClient) {}



  getCategories():Observable<any>{
    {
      return this._httpClint.get(`${RouteUrl}/api/v1/categories`)
    }
  }
  // getSpecificCategory(id:string):Observable<any>{
  //   {
  //     return this._httpClint.get(`${RouteUrl}/api/v1/subcategories/${id}`)
  //   }
  // }



}

