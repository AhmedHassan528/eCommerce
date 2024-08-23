import { Component } from '@angular/core';
import { FlowbiteService } from '../../../services/flowbite.service.ts.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  myLinkedin = faLinkedin;

  constructor(private flowbiteService: FlowbiteService) {}

  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      // Your custom code here
      console.log('Flowbite loaded', flowbite);
    });
  }
}
