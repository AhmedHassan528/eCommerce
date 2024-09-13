import { Category, IProduct } from '../../../core/Interfaces/product';
import { ItemService } from './../../../core/services/Items-Service/item.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { KMPSearchPipe } from '../../../core/Pipes/kmpsearch.pipe';
import { FormsModule } from '@angular/forms';
import { SucceedComponent } from "../../additions/Errors/succeed/succeed.component";
import { ErrorComponent } from "../../additions/Errors/error/error.component";
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardComponent } from "../../global/product-card/product-card.component";
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TranslateModule, FormsModule, KMPSearchPipe, SucceedComponent, ErrorComponent, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  // Variables
  SearchWords: string = '';
  WishListIDs!: any


  // Servier Message
  ServMessage!: string;
  succeed!: Boolean | null;

  // Data
  Products: IProduct[] = [];

  // Subscriptions
  getItemSub!: Subscription;

  constructor(private _Items: ItemService, private _wishListService:WishListService) { }


  // component Lifecycle Hooks
  ngOnInit(): void {
    this.getProducts();
  }
  ngAfterViewInit() {
    this.getWishList();

    console.log(this.WishListIDs);
  }


  
  ngOnDestroy(): void {
    this.getItemSub?.unsubscribe();
  }


  // Get Products
  getProducts(): void {
    this.getItemSub = this._Items.getItems().subscribe({
      next: (res) => {
        this.Products = res.data;
      }
    });
  }

    // get WishLists
    getWishList(): void {
      this._wishListService.getWishList().subscribe({
        next: (res) => {
          this.WishListIDs = res.data.map((item: { _id: string; }) => item._id);;
        }
      });
    }
}
