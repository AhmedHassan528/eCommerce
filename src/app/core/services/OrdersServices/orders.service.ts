import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {




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


  getOrders(): Observable<any> {
    return this._http.get(`${RouteUrl}/api/Order/GetUserOrders`, { headers: this.getHeaders() });
  }
  getOrdersDetails(id: number): Observable<any> {
    return this._http.get(`${RouteUrl}/api/Order/${id}`, { headers: this.getHeaders() });
  }
  updateOrderStatus(id: number, status: string): Observable<any> {
    return this._http.put(`${RouteUrl}/api/Order/updateOrderStatus/${id}/${status}`, null,{ headers: this.getHeaders() });
  }

  getAllUserOrders(): Observable<any> {
    return this._http.get(`${RouteUrl}/api/Order/AdminGetAllOrdersl`, { headers: this.getHeaders() });
  }

  verifySession(id: string): Observable<any> {
    return this._http.get(`${RouteUrl}/api/Order/verify-session/${id}`, { headers: this.getHeaders() });
  }


}

