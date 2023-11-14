import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NavigationComponent} from './navigation/navigation.component';
import {WidgetComponent, WidgetItemComponent} from './widget/widget.component';
import {ThemeComponent} from './theme/theme.component';
import {ThemeModule} from "../../@theme/theme.module";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {UploadModule} from "../../shared/upload/upload.module";
import {CustomComponent} from "./custom/custom.component";
import {ControlModule} from "../../shared/control/control.module";
import {RouterModule, Routes} from "@angular/router";
import {MarketComponent} from "./theme/market.component";
import { NbContextMenuModule } from '@nebular/theme';


const routes: Routes = [
  {
    path: "navigation",
    title: '导航',
    component: NavigationComponent,
  },
  {
    path: "widget",
    title: '挂件',
    component: WidgetComponent,
  },
  {
    path: "theme",
    title: '主题',
    component: ThemeComponent,
  },
  {
    path: "theme/market",
    title: "主题市场",
    component: MarketComponent,
  },
  {
    path: "custom",
    title: '自定义',
    component: CustomComponent,
  },
];


@NgModule({
  declarations: [
    NavigationComponent,
    WidgetComponent,
    ThemeComponent,
    CustomComponent,
    WidgetItemComponent,
    MarketComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule.forChild(routes),
    DragDropModule,
    UploadModule,
    ControlModule,
    NbContextMenuModule,
  ]
})
export class DecorationModule {
}
