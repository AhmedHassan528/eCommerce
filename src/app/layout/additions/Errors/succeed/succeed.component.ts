import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-succeed',
  standalone: true,
  imports: [],
  templateUrl: './succeed.component.html',
  styleUrl: './succeed.component.scss'
})
export class SucceedComponent {

  @Input() SucceedMesg!:any;

}
