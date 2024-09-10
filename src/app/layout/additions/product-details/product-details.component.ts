import { Brand, IProduct } from './../../../core/Interfaces/product';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ItemService } from '../../../core/services/Items-Service/item.service';
import { IProductDetails } from '../../../core/Interfaces/iproduct-details';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FontAwesomeModule, TranslateModule ,CarouselModule,RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  // icons
  faStar = faStar;
  faStarHalf = faStarHalf;

  test!:string ;
  getAtivatedSub!: Subscription;
  getItemServiceSub!: Subscription;

  getDetails:IProduct = {} as IProduct;

  // temp valriables
  Brand!: string ;

  
  constructor(private _activatedRoute: ActivatedRoute, private _itemService: ItemService) { }

  ngOnInit(): void {
    this.getAtivatedSub = this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.getProductDetails(params.get('id')!);
      }
    });
  }

  ngOnDestroy(): void {
    this.getAtivatedSub?.unsubscribe();
    this.getItemServiceSub?.unsubscribe();
  }

  getProductDetails(id: string) {
    this.getItemServiceSub = this._itemService.getItemDetails(id).subscribe({
      next: (data) => {
        this.getDetails = data.data;
        this.Brand = this.getDetails.brand.name;

      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    autoplay: true,
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
