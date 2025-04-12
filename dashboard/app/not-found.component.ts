import {Component} from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-not-found',
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-card>
          <nb-card-body>
            <div class="container d-flex justify-content-center">
              <div class="row justify-content-center align-self-center">
                <div class="col col-md-6">
                  <h1>404</h1>
                  <h2>UH OH! You're lost.</h2>
                  <p>
                    The page you are looking for does not exist.
                    How you got here is a mystery. But you can click the button below
                    to go back to the homepage.
                  </p>
                  <button nbButton shape="round" size="small" status="success" outline (click)="back()">Back</button>
                </div>
              </div>
            </div>
          </nb-card-body>
        </nb-card>
      </nb-layout-column>
    </nb-layout>
  `,
  styleUrls: [
    '../../node_modules/@nebular/auth/components/auth.component.scss',
  ],
  styles: [
    `
      :host {
        h1 {
          font-size: 7.5em;
          margin: 15px 0px;
          font-weight: bold;
          line-height: 1;
        }

        h2 {
          font-weight: bold;
        }
      }
    `
  ],
  standalone: false,
})
export class NotFoundComponent {
  constructor(private location: Location) {

  }

  back() {
    this.location.back();
  }
}
