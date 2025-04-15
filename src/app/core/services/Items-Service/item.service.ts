import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { IProduct } from '../../Interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor( private _http:HttpClient) { }

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

  // Get all items
  getItems(): Observable<any>{

    return this._http.get(`${RouteUrl}/api/products`, { headers: this.getHeaders() });
  }

  getAdminItems(): Observable<any>{
    return this._http.get(`${RouteUrl}/api/products/AdminGetAllAsync`, { headers: this.getHeaders() });
  }
  
  createProduct(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': 'linkedIn',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this._http.post(`${RouteUrl}/api/products`, formData, { headers });
  }
  
  getItemDetails(id:string | null): Observable<any>{
    const headers = new HttpHeaders({
      'tenant': 'linkedIn'
    });
    return this._http.get(`${RouteUrl}/api/products/${id}`, { headers });
  }

  deleteProduct(id: number): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': 'linkedIn',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this._http.delete(`${RouteUrl}/api/products/${id}`, { 
      headers,
      observe: 'response',
      responseType: 'text'
    });
  }

  // Update a product using FormData with custom tenant header
  updateProduct(id: number, formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': 'linkedIn',
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this._http.put(`${RouteUrl}/api/products/${id}`, formData, { headers });
  }
}
