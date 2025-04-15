import { Brand, IProduct } from './../../../core/Interfaces/product';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalf, faHeart, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemService } from '../../../core/services/Items-Service/item.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';
import { CartService } from '../../../core/services/CartServices/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/Auth-Service/auth.service';

@Component({
    selector: 'app-product-details',
    standalone: true,
    imports: [FontAwesomeModule, TranslateModule, CarouselModule, RouterLink],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.scss',
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  // wishList
  wishList: boolean = false;

  // Loading variables
  wishListLoading: boolean = false;
  AddingToCart: boolean = false;


  // icons
  faStar = faStar;
  faStarHalf = faStarHalf;
  faHeart = faHeart;
  faSpinner = faSpinner;



  // subscriptions
  getAtivatedSub!: Subscription;
  getItemServiceSub!: Subscription;
  getLoggedWishListSub!: Subscription;

  // product data
  getDetails:IProduct = {} as IProduct;

  // temp valriables
  Brand!: string ;
  imageList:string[] = [];

  
  constructor(private _activatedRoute: ActivatedRoute, private _itemService: ItemService, private _wishListService:WishListService, private _cartService:CartService, private _toastrService:ToastrService, private _authService:AuthService) { }

  // component life cycle
  ngOnInit(): void {
    this.getAtivatedSub = this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.getProductDetails(params.get('id')!);
      }
    });
    if (this._authService.getToken()) {
      this.getLoggedWishList();
    }
  }
  ngOnDestroy(): void {
    this.getAtivatedSub?.unsubscribe();
    this.getItemServiceSub?.unsubscribe();
  }

  // get product details
  getProductDetails(id: string) {
    this.getItemServiceSub = this._itemService.getItemDetails(id).subscribe({
      next: (data) => {
        this.getDetails = data;
        this.imageList = data.Images.$values;
        console.log(this.imageList);
        
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  //wishList function
  getLoggedWishList() {
    this.wishListLoading = true;
  this.getLoggedWishListSub = this._wishListService.getWishListIDs().subscribe({
    next: (data) => {
      data.ProductsIDs.$values.forEach((element: any) => {
        if (element._id === this.getDetails.Id) {
          this.wishList = true;
          this.wishListLoading = false
        }else{
          this.wishListLoading = false
        }
      });
    },
    error: (error) => {
      console.log(error);
    }
  });
  }

  // add to wishList
  addToWishList() {
    this.wishListLoading = true;
    this._wishListService.addToWishList(this.getDetails.Id).subscribe({
      next: (res) => {
        this.wishListLoading = false;
        this.wishList = true;
        this._toastrService.success(res.message, res.status, {
          timeOut: 3000
        });
      },
      error: () => {
        this.wishListLoading = false;
      }
    });
  }

  // remove from wishList
  removeFromWishList() {
    this.wishListLoading = true;

    this._wishListService.removeFromWishList(this.getDetails.Id).subscribe({
      next: (res) => {
        this.wishList = false;
        this.wishListLoading = false;
        this._toastrService.success(res.message, res.status, {
          timeOut: 3000
        });
      },
      error: () => {
        this.wishListLoading = false;
      }
    });
  }

  // add to cart
  addToCart() {
    this.AddingToCart = true;
    this._cartService.addCartItem(this.getDetails.Id).subscribe({
      next: (res) => {
        this._toastrService.success(res.message, res.status, {
          timeOut: 3000
        });
        this.AddingToCart = false;

      },
      error: () => {
        this.AddingToCart = false;
      }
    });
  }

  // carousel options
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
    rtl: true,
    autoplayTimeout: 2000,
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

}
