import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './core/services/FlowBite/flowbite-service.service';
import { NavBarComponent } from "./layout/additions/nav-bar/nav-bar.component";
import { FooterComponent } from "./layout/additions/footer/footer.component";
import RouteUrl from './BaseUrl';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  constructor(){
    console.log(RouteUrl)
  }
  
}
