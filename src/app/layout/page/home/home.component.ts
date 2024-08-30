import { IProduct } from '../../../core/Interfaces/product';
import { ItemService } from './../../../core/services/Items-Service/item.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  Products: IProduct[] = [];

  constructor( private _Items: ItemService) {}

  

  ngOnInit(): void {
    this.getItems();
  }
  // Get all items
  getItems(): void {
    this._Items.getItems().subscribe({
      next: (res) => {
        this.Products = res.data;
        console.log(this.Products);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  
}
