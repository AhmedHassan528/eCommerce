import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './core/services/FlowBite/flowbite-service.service';
import { NavBarComponent } from "./layout/additions/nav-bar/nav-bar.component";
import { FooterComponent } from "./layout/additions/footer/footer.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { ChatComponent } from "./layout/additions/chat/chat.component";
import { pageTransition, fadeIn } from './shared/animations/animations';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NavBarComponent, FooterComponent, NgxSpinnerComponent, ChatComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    animations: [pageTransition, fadeIn]
})
export class AppComponent {
  title = 'Ecommerce';
}
