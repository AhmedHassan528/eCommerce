import { IProduct } from '../../../core/Interfaces/product';
import { ItemService } from './../../../core/services/Items-Service/item.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../../core/services/Categories/category.service';
import { ICategories } from '../../../core/Interfaces/icategories';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { KMPSearchPipe } from '../../../core/Pipes/kmpsearch.pipe';
import { FormsModule } from '@angular/forms';
import { SucceedComponent } from "../../additions/Errors/succeed/succeed.component";
import { ErrorComponent } from "../../additions/Errors/error/error.component";
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardComponent } from "../../global/product-card/product-card.component";
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';
import { NgxSpinnerService, Spinner } from 'ngx-spinner';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule, FormsModule, CarouselModule, KMPSearchPipe, SucceedComponent, ErrorComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../app.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {


  // Variables
  SearchWords: string = '';
  AddLoading: Boolean = false
  WishListIDs!: any


  // Servier Message
  ServMessage!: string;
  succeed!: Boolean | null;

  // Data
  Products: IProduct[] = [];
  Categories: ICategories[] = [];

  // Subscriptions
  getItemSub!: Subscription;
  getCategorySub!: Subscription;


  constructor( private spinner: NgxSpinnerService, private _Items: ItemService, private _Categories: CategoryService, private _wishListService:WishListService) { }


  // component Lifecycle Hooks
  ngOnInit(): void {
    this.spinner.show();
    this.getProducts();
    this.getCategories();
  }
  ngAfterViewInit() {
    this.getWishList();
    this.spinner.hide();
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
    this._wishListService.getWishList().subscribe({
      next: (res) => {
        this.WishListIDs = res.data.map((item: { _id: string; }) => item._id);;
      }
    });
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
        items: 1
      },
      400: {
        items: 2
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
