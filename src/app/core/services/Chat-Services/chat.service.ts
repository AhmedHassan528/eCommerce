import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  constructor(private _httpClint:HttpClient) {}

  setMessage(message: string): Observable<any> {
    const headers = new HttpHeaders({
      'tenant': 'linkedIn'
    });
    return this._httpClint.post(`${RouteUrl}/api/Chat`, { message }, { headers });
  }
}
