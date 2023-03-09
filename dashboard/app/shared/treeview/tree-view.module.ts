import { NgModule } from "@angular/core";
import {TreeViewComponent, TreeViewItemComponent} from "./tree-view.component";
import {CommonModule} from "@angular/common";
import {ThemeModule} from "../../@theme/theme.module";

@NgModule({
  declarations: [
    TreeViewComponent,
    TreeViewItemComponent,
  ],
  exports: [
    TreeViewComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
  ]
})
export class TreeViewModule{ }
