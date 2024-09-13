import { Subscription } from 'rxjs';
import { Component, inject } from '@angular/core';
import { FlowbiteService } from '../../../core/services/FlowBite/flowbite-service.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {faLinkedin,faFacebook, faXTwitter, faInstagram, faTiktok, faYoutube, } from '@fortawesome/free-brands-svg-icons';
import { faCartShopping, faHouse, faAddressBook, faLayerGroup, faStore, faHeart, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/Auth-Service/auth.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../../core/services/TransslateServices/my-translate.service';
import { CartService } from '../../../core/services/CartServices/cart.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, RouterOutlet, RouterLinkActive, FontAwesomeModule, TranslateModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  faFacbook= faFacebook;
  faXTwitter = faXTwitter;
  faInstagram = faInstagram;
  faTiktok = faTiktok;
  faYoutube = faYoutube;
  faLinkedin = faLinkedin;
  faCartShopping = faCartShopping;

  faHouse = faHouse
  faAddressBook = faAddressBook
  faLayerGroup = faLayerGroup
  faStore = faStore
  faHeart = faHeart
  faBagShopping = faBagShopping



  readonly _MyTranslateService = inject(MyTranslateService);


  Logged!: boolean;

  CartCount: number = 0;

  constructor(private flowbiteService: FlowbiteService, private _auth:AuthService, private _cartService:CartService) {
  }

  
  ngOnInit(): void {

    this._cartService.getCartItems().subscribe({
      next: (response) => {
        
        this._cartService.cartCount.next(response.data.products.length);
      }
    });

    this._cartService.cartCount.subscribe({
      next: (res) => {
        this.CartCount = res;
      }
    })

    this.flowbiteService.loadFlowbite(flowbite => {});

    if (this._auth.getToken() != null) {
      this.Logged = true
    }
  }

  SighOut(){
    this._auth.SignOut();
    this.Logged = false;
  }


  change(lang: string) : void{

    this._MyTranslateService.changeLang(lang);
  }
}
