import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {ThemeModule} from '../../@theme/theme.module';
import {StatusCardComponent} from "./status-card/status-card.component";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {Angular2SmartTableModule} from "angular2-smart-table";

@NgModule({
  declarations: [
    DashboardComponent,
    StatusCardComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    Angular2SmartTableModule,
    NgxChartsModule
  ],
  providers: []
})
export class DashboardModule {
}
