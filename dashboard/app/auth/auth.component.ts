import {Component, Inject, OnInit} from '@angular/core';
import {NbAuthComponent, NbAuthService} from "@nebular/auth";
import {DOCUMENT, Location} from '@angular/common';
import {ConfigurationService} from "../@core/services/configuration.service";
import {Router} from "@angular/router";
@Component({
  selector: 'app-auth',
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-card>
          <nb-card-header>
            <nav class="navigation d-flex align-items-center">
              <a href="#" (click)="back()" class="link back-link" aria-label="Back">
                <nb-icon icon="arrow-back"></nb-icon>
              </a>
              <h1 class="py-0 my-0 flex-fill text-center" style="padding-right:32px;">{{name}}</h1>
            </nav>
          </nb-card-header>
          <nb-card-body>
            <nb-auth-block>
              <router-outlet></router-outlet>
            </nb-auth-block>
          </nb-card-body>
        </nb-card>
      </nb-layout-column>
    </nb-layout>
  `,
  styleUrls: [
    '../../../node_modules/@nebular/auth/components/auth.component.scss'
  ]
})
export class AuthComponent extends NbAuthComponent implements OnInit {

  name: string = "";

  constructor(@Inject(DOCUMENT) private document: Document,
              protected configService: ConfigurationService,
              protected override auth: NbAuthService,
              protected override location: Location) {
    super(auth, location);
  }

  ngOnInit(): void {
    if (!this.configService.config.siteUrl) {
      const protocol = this.document.location.protocol;
      const host = this.document.location.host;
      const split = host.split(".");
      if (split.length < 3) {
        this.document.location.href = protocol + "//" + host.replace("4200", "8080") + '/install';
        return ;
      }
      this.document.location.href = protocol + "//" + split[split.length - 2] + "." + split[split.length-1] + "/install";
      return ;
    }
    this.name = this.configService.config.name;
  }

}
