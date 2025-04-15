import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BrandsService } from '../../../core/services/BrandsServices/brands.service';
import { IBrands } from '../../../core/Interfaces/ibrands';
import { ItemService } from '../../../core/services/Items-Service/item.service';
import { IProduct } from '../../../core/Interfaces/product';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardComponent } from "../../global/product-card/product-card.component";
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';

@Component({
    selector: 'app-brands',
    imports: [TranslateModule, ProductCardComponent],
    templateUrl: './brands.component.html',
    styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {

  @ViewChild('product', { static: false }) productElement!: ElementRef;
  WishListIDs!: any



  // Servier Message
  ServMessage!: string;
  succeed!: Boolean | null;


  // Variables
  BandId!: string | null;

  // Subscribing to the BrandsService
  getAllBrandsSub!: any;
  getBrandByIdSub!: any;
  getItemsByBrandIdSub!: any;
  getAllProductsSub!: any;


  // Brands Array
  AllBrands: IBrands[] = [];
  AllProduct: IProduct[] = [];

  // constructor
  constructor(private _brandsService: BrandsService, private _itemService: ItemService, private _wishListService:WishListService) { }



  // Component Lifecycle
  ngOnInit(): void {
    this.getAllBrands();
    this.getAllProducts();
  }
  ngAfterViewInit() {
    this.getWishList();
  }
  ngOnDestroy(): void {
    this.getAllBrandsSub?.unsubscribe();
    this.getBrandByIdSub?.unsubscribe();
    this.getItemsByBrandIdSub?.unsubscribe();
    this.getAllProductsSub?.unsubscribe();
  }

  // Fetching all the brands
  getAllBrands() {
    this.getAllBrandsSub = this._brandsService.getAllBrands().subscribe({
      next: (response) => {
        this.AllBrands = response.$values;
        console.log(this.AllBrands);
      }
    })
  }

  // Fetching a brand by id
  getBrandById(id: any) {
    this.getBrandByIdSub = this._brandsService.getBrandById(id).subscribe({
      next: (response) => {
        this.BandId = id;

        this.getItemsByBrandId(response.data._id);
      }
    })
  }


  // Fetching all items by brand id
  getItemsByBrandId(id: number) {
    this._itemService.getItems().subscribe({
      next: (response) => {
        this.AllProduct = response.$values.filter((item: IProduct) => {
          return item.Brand?.Id === id;
        })
        this.scrollToProduct();
      }
    })
  }

  // Get item
  getAllProducts() {
    this.getAllProductsSub = this._itemService.getItems().subscribe({
      next: (response) => {
        this.AllProduct = response.$values;
        console.log(response.$values)
      }
    })
  }

  
  // get WishLists
  getWishList(): void {
    this._wishListService.getWishListIDs().subscribe({
      next: (res) => {
        this.WishListIDs = res.ProductsIDs.$values;
      }
    });
  }

  // Scroll to product
  scrollToProduct() {
    this.productElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }


}
