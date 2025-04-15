import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import RouteUrl from '../../../BaseUrl';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCount: BehaviorSubject<number> = new BehaviorSubject(0);

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

  constructor(private _http: HttpClient) {
    // Initialize cart count on service creation
    this.getCartItems().subscribe({
      next: (response) => {
        this.cartCount.next(response.Products.$values.length);
      }
    });
  }

  getCartItems(): Observable<any> {
    if (typeof localStorage !== 'undefined') {
      return this._http.get(`${RouteUrl}/api/cart`, { headers: this.getHeaders() });
    }
    return new Observable();
  }

  addCartItem(id: number): Observable<any> {
    return this._http.post(`${RouteUrl}/api/Cart/add/${id}`, null, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Update cart count after successful addition
          this.getCartItems().subscribe({
            next: (response) => {
              this.cartCount.next(response.Products.$values.length);
            }
          });
        })
      );
  }

  deleteCartItem(id: number): Observable<any> {
    return this._http.delete(`${RouteUrl}/api/Cart/Remove/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Update cart count after successful deletion
          this.getCartItems().subscribe({
            next: (response) => {
              this.cartCount.next(response.Products.$values.length);
            }
          });
        })
      );
  }

  ClearCar(): Observable<any> {
    return this._http.delete(`${RouteUrl}/api/Cart/clear`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.cartCount.next(0);
        })
      );
  }

  IncreaseItemCount(id: number): Observable<any> {
    return this._http.put(`${RouteUrl}/api/Cart/increase/${id}`, null, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Update cart count after successful increase
          this.getCartItems().subscribe({
            next: (response) => {
              this.cartCount.next(response.Products.$values.length);
            }
          });
        })
      );
  }

  DecreaseItemCount(id: number): Observable<any> {
    return this._http.put(`${RouteUrl}/api/Cart/decrease/${id}`, null, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Update cart count after successful decrease
          this.getCartItems().subscribe({
            next: (response) => {
              this.cartCount.next(response.Products.$values.length);
            }
          });
        })
      );
  }

}
