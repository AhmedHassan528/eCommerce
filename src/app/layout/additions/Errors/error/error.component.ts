import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-error',
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent {

  @Input() servError!:any;
  constructor() { }

  clearError() {
    this.servError = null;
  }

}
