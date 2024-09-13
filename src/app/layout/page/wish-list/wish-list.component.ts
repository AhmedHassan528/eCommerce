import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';
import { IWishList } from '../../../core/Interfaces/iwish-list';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, TranslateModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent implements OnInit, OnDestroy {

  //data
  GetWishListData:IWishList[] = [];

  private readonly _toastrService = inject(ToastrService);


  // get Subscriptions
  getWishListSub!:any;

  //Constructor
  constructor(private _wishListService:WishListService) { }

  //component lifecycle
  ngOnInit(): void {
    this.getWishList()
  }
  ngOnDestroy(): void {
    this.getWishListSub.unsubscribe();
  }

  getWishList(){
    this.getWishListSub = this._wishListService.getWishList().subscribe({
      next: (res)=>{
        this.GetWishListData = res.data;
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

  removeFromWishList(productId:string){
    this._wishListService.removeFromWishList(productId).subscribe({
      next: (res)=>{
        this.getWishList()
        this._toastrService.success("Product Removed from WishList", "Success", {
          timeOut: 3000
        })
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

}
