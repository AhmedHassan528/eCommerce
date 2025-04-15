import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { IRegister } from '../../Interfaces/iregister';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any = null;
  tenant: string = "linkedIn"
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private _httpClient: HttpClient) {
    // Initialize authentication state
    this.isAuthenticatedSubject.next(!!this.getToken());
  }


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
      'tenant': "linkedIn"
    });
  }

  RegisterUser(user: object): Observable<any> {
    {
      const headers = new HttpHeaders({
        'tenant': this.tenant,
        'ReqUrl': 'http://localhost:4200'
      });
      return this._httpClient.post(`${RouteUrl}/api/auth/Register`, user, { headers })
    }
  }

  LoginUser(user: object): Observable<any> {
    {
      const headers = new HttpHeaders({
        'tenant': this.tenant
      });
      return this._httpClient.post(`${RouteUrl}/api/auth/Login`, user, { headers })
    }
  }

  forgotPasswords(user: object): Observable<any> {
    {
      return this._httpClient.post(`${RouteUrl}/api/auth/ForgotPassword`, user, { headers: this.getHeaders() })
    }
  }

  ResetCode(user: string): Observable<any> {
    return this._httpClient.post(`${RouteUrl}/api/auth/verifyResetCode`,
      {
        "resetCode": user
      }
    );
  }


  ResetPassword(user: object): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': this.tenant
    });
    return this._httpClient.put(`${RouteUrl}/api/auth/resetPassword`, user, { headers });
  }

  confirmEmail(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': this.tenant
    });
    const params = new HttpParams()
      .set('UserId', userId)
      .set('Token', token);

    return this._httpClient.post(`${RouteUrl}/api/Auth/ConfirmEmail?UserId=${userId}&Token=${token}`,null, {headers});
  }


  SignOut() {
    {
      if (localStorage.getItem('userToken')) {
        localStorage.removeItem('userToken');
        this.isAuthenticatedSubject.next(false);
        this.userData = null;
      } else {
        console.log('No token found');
      }
    }

  }

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userToken');
    }
    return null;
  }

  DecodeUserData(): void {
    if (localStorage.getItem('userToken')) {
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
      this.isAuthenticatedSubject.next(true);
    } else {
      console.log('No token found');
      this.isAuthenticatedSubject.next(false);
    }
  }
}
