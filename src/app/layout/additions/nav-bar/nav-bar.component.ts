import { Subscription } from 'rxjs';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FlowbiteService } from '../../../core/services/FlowBite/flowbite-service.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {faLinkedin,faFacebook, faXTwitter, faInstagram, faTiktok, faYoutube, } from '@fortawesome/free-brands-svg-icons';
import { faCartShopping, faHouse, faAddressBook, faLayerGroup, faStore, faHeart, faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/Auth-Service/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../../core/services/TransslateServices/my-translate.service';
import { CartService } from '../../../core/services/CartServices/cart.service';

@Component({
    selector: 'app-nav-bar',
    imports: [RouterLink, RouterLinkActive, FontAwesomeModule, TranslateModule],
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {
  faFacbook= faFacebook;
  faXTwitter = faXTwitter;
  faInstagram = faInstagram;
  faTiktok = faTiktok;
  faYoutube = faYoutube;
  faLinkedin = faLinkedin;
  faCartShopping = faCartShopping;
  faHouse = faHouse;
  faAddressBook = faAddressBook;
  faLayerGroup = faLayerGroup;
  faStore = faStore;
  faHeart = faHeart;
  faBagShopping = faBagShopping;

  readonly _MyTranslateService = inject(MyTranslateService);
  Logged: boolean = false;
  CartCount: number = 0;
  private authSubscription: Subscription = new Subscription();
  private cartSubscription: Subscription = new Subscription();

  constructor(
    private flowbiteService: FlowbiteService, 
    private _auth: AuthService, 
    private _cartService: CartService
  ) {
    this.authSubscription = this._auth.isAuthenticated$.subscribe(
      isAuthenticated => {
        this.Logged = isAuthenticated;
      }
    );
  }

  ngOnInit(): void {
    // Subscribe to cart count updates
    this.cartSubscription = this._cartService.cartCount.subscribe({
      next: (count) => {
        this.CartCount = count;
      }
    });

    this.flowbiteService.loadFlowbite(flowbite => {});
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  SighOut() {
    this._auth.SignOut();
  }

  change(lang: string): void {
    this._MyTranslateService.changeLang(lang);
  }
}
