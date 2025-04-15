import { Component, inject, input, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IProduct } from '../../../core/Interfaces/product';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TermtextPipe } from '../../../core/Pipes/termtext.pipe';
import { CurrencyPipe, LowerCasePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { CartService } from '../../../core/services/CartServices/cart.service';
import { faStar, faStarHalf, faSpinner, faHeart } from '@fortawesome/free-solid-svg-icons';
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-product-card',
    standalone: true,
    imports: [RouterLink, CurrencyPipe, TranslateModule, TermtextPipe, LowerCasePipe, TitleCasePipe, FontAwesomeModule],
    templateUrl: './product-card.component.html',
    styleUrl: './product-card.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCardComponent {

  @Input() product: any = {};
  @Input() WishListIDs!: any;
  @Input() productId: any;

  // Font Awesome Icons
  faStar = faStar;
  faStarHalf = faStarHalf;
  faSpinner = faSpinner;
  faHeart = faHeart;

  // Variables
  SearchWords: string = '';
  AddLoading: Boolean = false
  wishListLoading: Boolean = false;
  itemId!: number;



  // subscriptions
  getAddWishListSub!: Subscription;
  getWishListSub!: Subscription;
  getCartSub!: Subscription;

  private readonly _toastrService = inject(ToastrService);

  constructor(private _wishListService: WishListService, private _cartService: CartService) {
    console.log(this.product)
  }


  // Add to WishList
  addToWishList(id: number): void {

    this.wishListLoading = true;

    this._wishListService.addToWishList(id).subscribe({
      next: (res) => {
        this.WishListIDs = res.wishlist.ProductsIDs.$values
        this.wishListLoading = false;

        this._toastrService.success(res.message, 'Success', {
          timeOut: 3000,
        });
      },
      error: () => {
        this.wishListLoading = false;
      }
    });
  }

  // Remove from WishList
  removeFromWishList(id: number): void {

    this.wishListLoading = true;

    this._wishListService.removeFromWishList(id).subscribe({
      next: (res) => {
        this.WishListIDs = res.wishlist.ProductsIDs.$values
        this.wishListLoading = false;
        this._toastrService.success(res.message, 'Success', {
          timeOut: 3000,
        });
      },
      error: (err) => {
        this.wishListLoading = false;
      }
    });
  }

  // Add to Cart
  addToCart(id: number): void {
    this.itemId = id;
    this.AddLoading = true

    this.getCartSub = this._cartService.addCartItem(id).subscribe({
      next: (res) => {
        this._cartService.cartCount.next(res.numOfCartItems);
        this._toastrService.success('Item Added to Cart', 'Success', {
          timeOut: 5000,});
          this.AddLoading = false
        setTimeout(() => {
          this.AddLoading = false
          this.itemId = 0
        }, 3000);
      }


    });
  }




}
