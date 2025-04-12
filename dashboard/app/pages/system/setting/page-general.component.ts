import {Component} from '@angular/core';

@Component({
  selector: 'app-site-page-general',
  template: `
    <app-plugin-feature></app-plugin-feature>
  `,
  styles: [
    `
      :host ::ng-deep app-plugin-feature nb-card {
        border: none;
      }
      :host ::ng-deep app-plugin-feature nb-card-header {
        display: none;
      }
    `
  ],
  standalone: false
})
export class PageGeneralComponent {

}
