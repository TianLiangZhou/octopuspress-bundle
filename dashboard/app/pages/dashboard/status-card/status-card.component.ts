import { Component, Input } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DASHBOARD_SWITCH_STATUS} from "../../../@core/definition/dashboard/api";
import {ResponseBody} from "../../../@core/definition/common";

@Component({
  selector: 'app-status-card',
  styleUrls: ['./status-card.component.scss'],
  template: `
    <nb-card (click)="onSwitch()" [ngClass]="{'off': !on}">
      <div class="icon-container">
        <nb-icon [icon]="icon" [status]="color"></nb-icon>
      </div>
      <div class="details">
        <div class="title h5">{{ title }}</div>
        <div class="status paragraph-2">{{ on ? 'ON' : 'OFF' }}</div>
      </div>
    </nb-card>
  `,
  standalone: false,
})
export class StatusCardComponent {

  @Input() title: string = '';
  @Input() color: string = '';
  @Input() on = true;
  @Input() icon = '';
  @Input() id = '';

  constructor(private http: HttpClient) {
  }

  onSwitch() {
    this.http.post<ResponseBody>(DASHBOARD_SWITCH_STATUS, {id: this.id, value: !this.on}).subscribe(res => {
      this.on = !this.on;
    });
  }
}
