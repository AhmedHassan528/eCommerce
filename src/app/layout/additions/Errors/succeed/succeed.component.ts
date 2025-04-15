import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-succeed',
    imports: [],
    templateUrl: './succeed.component.html',
    styleUrl: './succeed.component.scss'
})
export class SucceedComponent {

  @Input() SucceedMesg!:any;

}
