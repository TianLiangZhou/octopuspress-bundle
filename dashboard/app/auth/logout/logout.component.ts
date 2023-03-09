import { Component, OnInit } from '@angular/core';
import {NbLogoutComponent} from "@nebular/auth";

@Component({
  selector: 'app-logout',
  template: `
    <div>正在退出账号, 请稍后...</div>
  `
})
export class LogoutComponent extends NbLogoutComponent {

}
