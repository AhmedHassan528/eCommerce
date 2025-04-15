import { Component } from '@angular/core';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";
import { OrdersService } from '../../../core/services/OrdersServices/orders.service';
import { CategoryService } from '../../../core/services/Categories/category.service';
import { BrandsService } from '../../../core/services/BrandsServices/brands.service';
import { IorderHostory } from '../../../core/Interfaces/iorder-history';
import { ICategories } from '../../../core/Interfaces/icategories';
import { IBrands } from '../../../core/Interfaces/ibrands';
import { TranslateModule } from '@ngx-translate/core';
import { ProductVisitsComponent } from './product-visits/product-visits.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { OrderStatusMessagesComponent } from './order-status-messages/order-status-messages.component';
import { OrderTrendComponent } from './order-trend/order-trend.component';

@Component({
    selector: 'app-dashboard',
    imports: [SidebarComponent, TranslateModule, ProductVisitsComponent, OrderStatusComponent, OrderStatusMessagesComponent, OrderTrendComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  orders: IorderHostory [] = [];
  categories: ICategories[] = [];
  brands: IBrands[] = [];

  constructor(
    private orderService: OrdersService,
    private categoryService: CategoryService,
    private brandService: BrandsService
  ) {}

  ngOnInit(): void {
    this.orderService.getAllUserOrders().subscribe((data) => (this.orders = data.$values));
    this.categoryService.getCategories().subscribe((data) => (this.categories = data.$values));
    this.brandService.getAllBrands().subscribe((data) => (this.brands = data.$values));
  }
}
