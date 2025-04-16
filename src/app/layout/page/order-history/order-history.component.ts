import { Component, inject } from '@angular/core';
import { IorderHostory } from '../../../core/Interfaces/iorder-history';
import { OrdersService } from '../../../core/services/OrdersServices/orders.service';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TermtextPipe } from '../../../core/Pipes/termtext.pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-order-history',
    imports: [TranslateModule, CurrencyPipe, TermtextPipe, DatePipe],
    templateUrl: './order-history.component.html',
    styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  // orders
  orders: IorderHostory[] = [];

  sessionId: string | null = null;
    
  getAtivatedSub! : any




  constructor(private _activatedRoute: ActivatedRoute, private _orders:OrdersService) { }

  ngOnInit(): void {


    this.getAtivatedSub = this._activatedRoute.queryParamMap.subscribe({
      next: (params) => {
        this.sessionId = params.get('session_id'); // Use queryParamMap for ?session_id=...
        if (this.sessionId) {
          console.log(this.sessionId);
          this.verifySession(this.sessionId);;
        }
      },
      error: (err) => console.error('Error in queryParamMap subscription', err)
    });
    this.getOrders();
  }

  // get orders
  getOrders(): void {
    this._orders.getOrders().subscribe({
      next: (data) => {
        this.orders = data.$values.sort((a: IorderHostory, b: IorderHostory) => {
          return new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime();
        });
        console.log(this.orders);
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  verifySession(id: string): void {
    this._orders.verifySession(id).subscribe({
      next: (data) => {
        this.orders = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
