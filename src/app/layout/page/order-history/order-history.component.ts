import { Component, inject } from '@angular/core';
import { IorderHostory } from '../../../core/Interfaces/iorder-history';
import { OrdersService } from '../../../core/services/OrdersServices/orders.service';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TermtextPipe } from '../../../core/Pipes/termtext.pipe';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [TranslateModule, CurrencyPipe, TermtextPipe, DatePipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  // orders
  orders: IorderHostory[] = [];

  private readonly _orders = inject(OrdersService);

  constructor() { }

  ngOnInit(): void {
    this.getOrders();
  }

  // get orders
  getOrders(): void {
    this._orders.getOrders("id").subscribe({
      next: (data) => {
        this.orders = data;
        console.log(this.orders);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
