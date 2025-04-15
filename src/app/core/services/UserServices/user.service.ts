import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { IUser } from '../../Interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
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

  makeUserAdmin(userEmail: string): Observable<any> {
    const headers = this.getHeaders().set('userEmail', userEmail);
    return this._http.post(`${RouteUrl}/api/auth/AddRoleToUser`, null, { headers });
  }

  getAllUsers(): Observable<any> {
    return this._http.get(`${RouteUrl}/api/Auth/GetAllUsersAsync`, { headers: this.getHeaders() });
  }
} 