import { Component } from '@angular/core';
import { FlowbiteService } from '../../../core/services/FlowBite/flowbite-service.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { faLinkedin,faFacebook, faXTwitter, faInstagram, faTiktok, faYoutube, } from '@fortawesome/free-brands-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../core/services/Auth-Service/auth.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule],
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


  Logged!: boolean;

  constructor(private flowbiteService: FlowbiteService, private _auth:AuthService) {
    
  }

  
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {});

    if (this._auth.getToken() != null) {
      this.Logged = true
    }
  }

  SighOut(){
    this._auth.SignOut();
    this.Logged = false;
  }
}
