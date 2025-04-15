import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


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


  constructor(private _http: HttpClient) {}

  getCategories():Observable<any>{
    return this._http.get(`${RouteUrl}/api/Category`, { headers: this.getHeaders()  });
  }
  
  deleteCategory(id:number):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'tenant': "linkedIn"
    });
    return this._http.delete(`${RouteUrl}/api/Category/${id}`, { 
      headers,
      responseType: 'text'
    });
  }

  createCategory(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'tenant': "linkedIn"
    });
    return this._http.post(`${RouteUrl}/api/Category`, formData, { headers });
  }

  updateCategory(id: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'tenant': "linkedIn"
    });
    return this._http.put(`${RouteUrl}/api/Category/${id}`, formData, {  headers });
  }
}

