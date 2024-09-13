import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { IRegister } from '../../Interfaces/iregister';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData:any=null;

  constructor(private _httpClient: HttpClient) { }

  RegisterUser(user: object): Observable<any> {
    {
      return this._httpClient.post(`${RouteUrl}/api/v1/auth/signup`, user)
    }
  }

  LoginUser(user: object): Observable<any> {
    {
      return this._httpClient.post(`${RouteUrl}/api/v1/auth/signin`, user)
    }
  }

  forgotPasswords (user: object): Observable<any> {
    {
      return this._httpClient.post(`${RouteUrl}/api/v1/auth/forgotPasswords`, user)
    }
  }

  ResetCode(user: string): Observable<any> {
    return this._httpClient.post(`${RouteUrl}/api/v1/auth/verifyResetCode`, 
      {
        "resetCode": user 
      }
    );
  }


  ResetPassword (user: object): Observable<any> {

    {
      return this._httpClient.put(`${RouteUrl}/api/v1/auth/resetPassword`, user)
    }
  }


  SignOut(){
    {
      if (localStorage.getItem('userToken')) {
        localStorage.removeItem('userToken');
      }else{
        console.log('No token found');
    }
  }

}

  getToken(): string | null {
    if (typeof localStorage !== 'undefined'){
      return localStorage.getItem('userToken');
    }
    return null;
  }

  DecodeUserData(): void{
    if (localStorage.getItem('userToken')) {
      jwtDecode(localStorage.getItem('userToken')!);
      this.userData = jwtDecode(localStorage.getItem('userToken')!);
    }else{
      console.log('No token found');
    }
  }
}
