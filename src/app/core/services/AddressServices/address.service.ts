import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { Token } from '@angular/compiler';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

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

  constructor(private http: HttpClient) {}

  AddAddress(address: any): Observable<any> {
    console.log(address)
    return this.http.post(`${RouteUrl}/api/Address`,address, { headers: this.getHeaders() }
    );
  }

  GetAllAddresses(): Observable<any> {
    return this.http.get(`${RouteUrl}/api/Address`, { headers: this.getHeaders() });
  }

  GetSpciificAddresses(id:number): Observable<any> {
    return this.http.get(`${RouteUrl}/api/Address/GetAddressByID/${id}`, { headers: this.getHeaders() });
  }

  DeleteSpciificAddress(id: number): Observable<any> {
    return this.http.delete(`${RouteUrl}/api/Address/${id}`, { headers: this.getHeaders() }
    );
  }


}
