import { Component, OnInit } from '@angular/core';

import {UserService} from '../@core/services/user.service';
import {NbMenuItem} from "@nebular/theme";
import {SharedService} from "../@core/services/shared.service";

@Component({
  selector: 'app-module',
  template: `
    <app-layout>
      <nb-menu tag="main" [items]="menus"></nb-menu>
      <router-outlet></router-outlet>
    </app-layout>
  `,
})
export class PagesComponent implements OnInit {
  menus: NbMenuItem[] = [];
  constructor(private userService: UserService) {
  }
  ngOnInit() {
    this.userService.onMenuChange().subscribe(menus => {
      this.menus = menus;
    });
    this.userService.request().subscribe();
  }

}
