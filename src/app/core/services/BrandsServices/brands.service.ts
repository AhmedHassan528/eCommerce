import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import RouteUrl from '../../../BaseUrl';
import { Observable, catchError, throwError } from 'rxjs';
import { IBrands } from '../../Interfaces/ibrands';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userToken');
    }
    return null;
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'tenant': "linkedIn"
    });
  }

  private getJsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
      'tenant': "linkedIn"
    });
  }

  constructor(private _http:HttpClient) {}

  getAllBrands():Observable<any>{
    return this._http.get(`${RouteUrl}/api/Brand`, { headers: this.getJsonHeaders() });
  }

  getBrandById(id:any):Observable<any>{
    return this._http.get(`${RouteUrl}/api/Brand/${id}`,{ headers: this.getJsonHeaders() });
  }

  createBrand(formData: FormData): Observable<HttpResponse<IBrands>> {

    return this._http.post<IBrands>(`${RouteUrl}/api/Brand`, formData, {
      observe: 'response',
      headers: this.getHeaders()
    });
  }

  updateBrand(id: number, formData: FormData): Observable<HttpResponse<IBrands>> {
    return this._http.put<IBrands>(`${RouteUrl}/api/Brand/${id}`, formData, {
      observe: 'response',
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Update brand error:', error);
        return throwError(() => error);
      })
    );
  }

  deleteBrand(id: number): Observable<HttpResponse<any>> {
    return this._http.delete(`${RouteUrl}/api/Brand/${id}`, {
      observe: 'response',
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      catchError(error => {
        console.error('Delete brand error:', error);
        return throwError(() => error);
      })
    );
  }

}
