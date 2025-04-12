import {Component} from '@angular/core';
import {ConfigurationService} from "../../@core/services/configuration.service";
import {SharedService} from "../../@core/services/shared.service";

@Component({
  selector: 'app-layout',
  template: `
    <nb-spinner *ngIf="isLoading | async"></nb-spinner>
    <nb-layout>
      <nb-layout-header style="z-index: 999;" fixed>
        <app-header [url]="url" [sidebarState]="sidebarState" [name]="name"></app-header>
      </nb-layout-header>

      <nb-sidebar style="z-index: 998" class="menu-sidebar" (stateChange)="onSidebarState($event)" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="main-content">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer style="z-index: 999" fixed>
        <div class="d-flex align-items-center">
          <span class="created-by">Created with by <b><a href="#" target="_blank">OctopusPress</a></b> 2022</span>
          <nb-actions size="medium">
              <nb-action icon="github-outline"></nb-action>
          </nb-actions>
        </div>
      </nb-layout-footer>
    </nb-layout>
  `,
  styles: [
    `
      ::ng-deep nb-layout-footer nav {
        justify-content: right !important;
      }
    `
  ],
  standalone: false
})
export class LayoutComponent {

  name: string = '';
  url: string = 'http://localhost:8080';

  sidebarState!: "compacted" | "expanded";

  constructor(private configService: ConfigurationService,
              private loadingService: SharedService
  ) {
    this.name = this.configService.config.name;
    this.url  = this.configService.config.siteUrl;
  }

  onSidebarState($event: 'compacted' | 'expanded' | any) {
    this.sidebarState = $event;
  }


  get isLoading() {
    return this.loadingService.isLoading;
  }

}
