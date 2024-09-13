import { Component, OnDestroy, OnInit } from '@angular/core';
import { faTrash, faPlus, faMinus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { CartService } from '../../../core/services/CartServices/cart.service';
import { ICart } from '../../../core/Interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { TermtextPipe } from '../../../core/Pipes/termtext.pipe';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe, TranslateModule,FontAwesomeModule, TermtextPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {
typeof: any;
  constructor(private _cartService: CartService) { }

  // varibles ( loading handelers )
  qtyLoading: boolean = false
  DeleteLoading: boolean = false;
  cartId: string = '';



  // font aswsoms 
  faTrash = faTrash;
  faPlus= faPlus;
  faMinus = faMinus;
  faSpinner = faSpinner;


  //get Subscriptions 
  getCartItembSub!: any;
  getDeletespecificItemSub!: any;


  // Data
  cartItems: ICart = {} as ICart;


  // component life cycle
  ngOnInit() {
    this.getCartItems();
  }
  ngOnDestroy(): void {
    this.getCartItembSub?.unsubscribe();
    this.getDeletespecificItemSub?.unsubscribe();
  }


  // get Cart Items
  getCartItems() {
    this.getCartItembSub = this._cartService.getCartItems().subscribe({
      next: (response) => {
        this.cartItems = response.data;
      }
    });
  }

  // Remove specific  Item
  DeletespecificItem(id:string): void {
    this.DeleteLoading = true;
    this.cartId = id;

    this.getDeletespecificItemSub = this._cartService.deleteCartItem(id).subscribe({
      next: (res) => {
        this.cartItems = res.data;
        this.DeleteLoading = false;
        this.cartId = '';

        this.countOfCart(res.data.products.length);
      },
      error: () => {
        this.DeleteLoading = false;
        this.cartId = '';

      }
    })
  }

  // Clear all Cart
  ClearItems(): void {
    this.getDeletespecificItemSub = this._cartService.ClearCar().subscribe({
      next: (res) => {
        this.countOfCart(0);
        this.cartItems.products = [];
        this.cartItems.totalCartPrice = 0;
      }
    })
  }

  // Edit Cart QTY

  EditQuantity(id:string, QTY:number, plus:boolean): void {
    this.cartId = id;
    this.qtyLoading = true;
    if(plus==true){
      QTY +=1
    }else{
      QTY -= 1
    }
    this.getDeletespecificItemSub = this._cartService.EditQuantity(id, QTY).subscribe({
      next: (res) => {
        this.cartItems = res.data;
        this.qtyLoading = false
        this.cartId = '';

      },
      error: () => {
        this.qtyLoading = false
        this.cartId = '';
      }
    })
  }

  // Check Out
  CheckOut(id:string): void {
    console.log(id);
    console.log("Check Out");
  }


  // handel count of cart
  countOfCart(CountCart: number): void{
    this._cartService.cartCount.next(CountCart);
  }

}
