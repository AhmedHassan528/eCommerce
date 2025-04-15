import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import RouteUrl from '../../../BaseUrl';
import { jwtDecode } from 'jwt-decode';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripePromise: Promise<any> | null = null;
  private stripePublishableKey = 'pk_test_51R23Ds4Fqtfdl7NOSKNRgJE4LEY4rGm84g8ISaZsLV1oUtLj308Wl3DfgiVhr77P4TddRC3Sh7rBtKHxkUpcdvYP00ZTofsFQk';

  getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userToken');
    }
    return null;
  }
  userData:any=null;


  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`,
      'userID': this.userData.uid,
      'tenant': "linkedIn"
    });
  }

  constructor(private http: HttpClient) {
    this.DecodeUserData();
  }

  getPublishableKey(): Observable<any> {
    return this.http.get(`${RouteUrl}/api/payment/publishable-key`, { headers: this.getHeaders() });
  }

  createPaymentIntent(amount: number): Observable<any> {
    console.log('Creating PaymentIntent with amount:', amount);
    return this.http.post(`${RouteUrl}/api/payment/create-checkout-session`, { amount }, { headers: this.getHeaders() });
  }

  createPayment(cartId: number, addressId : number, HostUrl:string): Observable<any> {
    return this.http.post(`${RouteUrl}/api/Order/create`, { 
      cartId, 
      addressId,
      HostUrl
     }, { headers: this.getHeaders() });
  }

  async initializeStripe(): Promise<any> {
    if (!this.stripePromise) {
      this.stripePromise = loadStripe(this.stripePublishableKey);
    }
    return this.stripePromise;
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