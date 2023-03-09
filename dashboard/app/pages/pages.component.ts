import { Component, OnInit } from '@angular/core';

import {MenuService} from '../@core/services/menu.service';
import {NbMenuItem} from "@nebular/theme";
import {SharedService} from "../@core/services/shared.service";

@Component({
  selector: 'app-module',
  template: `
    <app-layout>
      <nb-menu tag="main" [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </app-layout>
  `,
})
export class PagesComponent implements OnInit {
  menu: NbMenuItem[] = [];
  constructor(private menuService: MenuService) {
  }
  ngOnInit() {
    this.menuService.menuChange().subscribe(res => {
      this.menu = res;
    });
    this.menuService.get();
  }

}
