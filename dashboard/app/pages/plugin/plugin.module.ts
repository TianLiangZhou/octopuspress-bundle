import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ThemeModule} from "../../@theme/theme.module";
import {UploadModule} from "../../shared/upload/upload.module";
import {InstalledComponent} from "./installed/installed.component";
import {MarketComponent} from "./market/market.component";
import {NbListModule} from "@nebular/theme";
import {FeatureComponent} from "./feature/feature.component";
import {ControlModule} from "../../shared/control/control.module";
import {Angular2SmartTableModule} from "angular2-smart-table";
import {RouterModule, Routes} from "@angular/router";

const routes: Routes = [
  {
    path: "market",
    title: '插件市场',
    component: MarketComponent,
  },
  {
    path: "installed",
    title: '已安装插件',
    component: InstalledComponent,
  },
  {
    path: ":plugin/:page",
    component: FeatureComponent,
  },
];

@NgModule({
  declarations: [
    InstalledComponent, MarketComponent, FeatureComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ThemeModule,
    UploadModule,
    NbListModule,
    Angular2SmartTableModule,
    ControlModule,
  ]
})
export class PluginModule {
}
