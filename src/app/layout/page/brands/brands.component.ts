import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BrandsService } from '../../../core/services/BrandsServices/brands.service';
import { IBrands } from '../../../core/Interfaces/ibrands';
import { ItemService } from '../../../core/services/Items-Service/item.service';
import { IProduct } from '../../../core/Interfaces/product';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalf, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, LowerCasePipe, TitleCasePipe } from '@angular/common';
import { TermtextPipe } from '../../../core/Pipes/termtext.pipe';
import { KMPSearchPipe } from '../../../core/Pipes/kmpsearch.pipe';
import { CartService } from '../../../core/services/CartServices/cart.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [FontAwesomeModule, KMPSearchPipe, RouterLink, CurrencyPipe, LowerCasePipe, TitleCasePipe, TermtextPipe],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {

  @ViewChild('product', { static: false }) productElement!: ElementRef;

  


  // Servier Message
  ServMessage!: string;
  succeed!: Boolean | null;


  // Font Awesome Icons
  faStar = faStar;
  faStarHalf = faStarHalf;
  faSpinner = faSpinner;

  // Variables
  AddLoading: Boolean = false
  itemId!: string;
  BandId!: string | null;

  // Subscribing to the BrandsService
  getAllBrandsSub!: any;
  getBrandByIdSub!: any;
  getItemsByBrandIdSub!: any;
  getAllProductsSub!: any;
  getCartSub!: any;


  // Brands Array
  AllBrands: IBrands[] = [];
  AllProduct: IProduct[] = [];

  // constructor
  constructor(private _cartService: CartService, private _brandsService: BrandsService, private _itemService: ItemService) { }



  // Component Lifecycle
  ngOnInit(): void {
    this.getAllBrands();
    this.getAllProducts();
  }
  ngOnDestroy(): void {
    this.getAllBrandsSub?.unsubscribe();
    this.getBrandByIdSub?.unsubscribe();
    this.getItemsByBrandIdSub?.unsubscribe();
    this.getAllProductsSub?.unsubscribe();
    this.getCartSub?.unsubscribe();
  }

  // Fetching all the brands
  getAllBrands() {
    this.getAllBrandsSub = this._brandsService.getAllBrands().subscribe({
      next: (response) => {
        this.AllBrands = response.data;
        console.log(this.AllBrands);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  // Fetching a brand by id
  getBrandById(id: any) {
    this.getBrandByIdSub = this._brandsService.getBrandById(id).subscribe({
      next: (response) => {
        this.BandId = id;

        this.getItemsByBrandId(response.data._id);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }


  // Fetching all items by brand id
  getItemsByBrandId(id: string) {
    this._itemService.getItems().subscribe({
      next: (response) => {

        this.AllProduct = response.data.filter((item: IProduct) => {
          return item.brand._id === id;
        })

        if (this.AllProduct.length === 0) {
          console.log('No items found');
          return;
        }

        this.scrollToProduct();


        console.log(this.AllProduct);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  // Get item
  getAllProducts() {
    this.getAllProductsSub = this._itemService.getItems().subscribe({
      next: (response) => {

        this.AllProduct = response.data;
        console.log(this.AllProduct);
      },
      error: (error) => {
        console.log(error);
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
        this.succeed = true;
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



  // Scroll to product
  scrollToProduct() {
    this.productElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


}
