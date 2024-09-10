import { Category, IProduct } from '../../../core/Interfaces/product';
import { ItemService } from './../../../core/services/Items-Service/item.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalf, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../core/services/Categories/category.service';
import { ICategories } from '../../../core/Interfaces/icategories';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { TermtextPipe } from '../../../core/Pipes/termtext.pipe';
import { KMPSearchPipe } from '../../../core/Pipes/kmpsearch.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/CartServices/cart.service';
import { SucceedComponent } from "../../additions/Errors/succeed/succeed.component";
import { ErrorComponent } from "../../additions/Errors/error/error.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule ,FormsModule, RouterLink, CurrencyPipe, LowerCasePipe, TitleCasePipe, TermtextPipe, KMPSearchPipe, SucceedComponent, ErrorComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  // Font Awesome Icons
  faStar = faStar;
  faStarHalf = faStarHalf;
  faSpinner = faSpinner;

  // Variables
  SearchWords: string = '';
  AddLoading: Boolean = false
  itemId!: string;


  // Servier Message
  ServMessage!: string;
  succeed!: Boolean | null;

  // Data
  Products: IProduct[] = [];
  Categories: ICategories[] = [];

  // Subscriptions
  getItemSub!: Subscription;
  getCategorySub!: Subscription;
  getCartSub!: Subscription;

  constructor(private _Items: ItemService, private _Categories: CategoryService, private _cartService: CartService) { }


  // component Lifecycle Hooks
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }
  ngOnDestroy(): void {
    this.getItemSub?.unsubscribe();
    this.getCategorySub?.unsubscribe();
  }


  // Get Products
  getProducts(): void {
    this.getItemSub = this._Items.getItems().subscribe({
      next: (res) => {
        this.Products = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Get Categories
  getCategories(): void {
    this.getCategorySub = this._Categories.getCategories().subscribe({

      next: (res) => {
        this.Categories = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  // Add to Cart
  addToCart(id: string): void {
    this.itemId = id;

    this.AddLoading = true

    this.getCartSub = this._cartService.addCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.ServMessage = res.message;
        this.AddEffect();
      },
      error: (err) => {
        console.log(err);
        this.succeed = false;
        this.AddEffect();
      }
    });
  }


  AddEffect(): void {
    setTimeout(() => {
      this.succeed = null;
      this.AddLoading = false
      this.itemId = ''
    }, 3000);
  }


}
