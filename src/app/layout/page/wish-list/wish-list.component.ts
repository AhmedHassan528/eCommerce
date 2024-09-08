import { Component, OnDestroy, OnInit } from '@angular/core';
import { WishListService } from '../../../core/services/WishListServices/wish-list.service';
import { IWishList } from '../../../core/Interfaces/iwish-list';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.scss'
})
export class WishListComponent implements OnInit, OnDestroy {

  //data
  GetWishListData:IWishList[] = [];

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
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }

}
