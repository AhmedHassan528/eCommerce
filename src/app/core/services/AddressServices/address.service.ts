import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { Token } from '@angular/compiler';

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

  myHeaders: any = { token: this.getToken() };

  constructor(private http: HttpClient) { }

  AddAddress(address: any): Observable<any> {
    return this.http.post(`${RouteUrl}/api/v1/addresses`,address,
      {
        headers: this.myHeaders
      }
    );
  }

  GetAllAddresses(): Observable<any> {
    return this.http.get(`${RouteUrl}/api/v1/addresses`, {
      headers: this.myHeaders
    });
  }

  GetSpciificAddresses(id:string): Observable<any> {
    return this.http.get(`${RouteUrl}/api/v1/addresses/${id}`, {
      headers: this.myHeaders
    });
  }

  DeleteSpciificAddress(id: string): Observable<any> {
    return this.http.delete(`${RouteUrl}/api/v1/addresses/${id}`,
      {
        headers: this.myHeaders
      }
    );
  }

}
