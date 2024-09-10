import { Category, IProduct } from '../../../core/Interfaces/product';
import { ItemService } from './../../../core/services/Items-Service/item.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalf, faSpinner, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../core/services/Categories/category.service';
import { ICategories } from '../../../core/Interfaces/icategories';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, LowerCasePipe, NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import { TermtextPipe } from '../../../core/Pipes/termtext.pipe';
import { KMPSearchPipe } from '../../../core/Pipes/kmpsearch.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/CartServices/cart.service';
import { SucceedComponent } from "../../additions/Errors/succeed/succeed.component";
import { ErrorComponent } from "../../additions/Errors/error/error.component";
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../core/Pipes/custom-currency.pipe';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule,CustomCurrencyPipe,TranslateModule, FormsModule, CarouselModule, RouterLink, CurrencyPipe, LowerCasePipe, TitleCasePipe, TermtextPipe, KMPSearchPipe, SucceedComponent, ErrorComponent,NgClass, NgStyle],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../app.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  // Font Awesome Icons
  faStar = faStar;
  faStarHalf = faStarHalf;
  faSpinner = faSpinner;
  faHeart = faHeart;

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
  WishListIDs!:any

  // Subscriptions
  getItemSub!: Subscription;
  getCategorySub!: Subscription;
  getCartSub!: Subscription;
  getAddWishListSub!: Subscription;
  getWishListSub!: Subscription;

  constructor(private spinner:NgxSpinnerService ,private _wishListService: WishListService, private _Items: ItemService, private _Categories: CategoryService, private _cartService: CartService) { }


  // component Lifecycle Hooks
  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.getWishList();

  }
  ngOnDestroy(): void {
    this.getItemSub?.unsubscribe();
    this.getCategorySub?.unsubscribe();
    this.getAddWishListSub?.unsubscribe();
    this.getCartSub?.unsubscribe();
  }



  // Get Products
  getProducts(): void {
    this.getItemSub = this._Items.getItems().subscribe({
      next: (res) => {
        this.Products = res.data;
      }
    });
  }

  // Get Categories
  getCategories(): void {
    this.getCategorySub = this._Categories.getCategories().subscribe({

      next: (res) => {
        this.Categories = res.data;
      }
    })
  }

  // get WishLists
  getWishList(): void {
    this.getWishListSub = this._wishListService.getWishList().subscribe({
      next: (res) => {
        this.WishListIDs = res.data.map((item: { _id: any; }) => item._id);;
      }
    });
  }

  // Add to WishList
  addToWishList(id: string): void {

    this.spinner.show();

    this._wishListService.addToWishList(id).subscribe({
      next: (res) => {
        this.WishListIDs = res.data
        this.spinner.hide();
      }
    });
  }

  // Remove from WishList
  removeFromWishList(id: string): void {

    this.spinner.show();

    this._wishListService.removeFromWishList(id).subscribe({
      next: (res) => {
        this.WishListIDs = res.data

        this.spinner.hide();
      }
    });
  }

  // Add to Cart
  addToCart(id: string): void {
    this.itemId = id;

    this.AddLoading = true

    this.getCartSub = this._cartService.addCartItem(id).subscribe({
      next: (res) => {
        this.succeed = true;
        this.ServMessage = res.message;
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



  // Owl Carousel Options
  MaincustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    rtl: true,

    autoplay: true,
    autoplayTimeout: 5000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    rtl: true,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    autoplayTimeout: 5000,
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }
}
