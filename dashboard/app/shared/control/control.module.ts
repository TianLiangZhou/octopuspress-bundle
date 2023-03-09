import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NbListModule, NbToggleModule
} from "@nebular/theme";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {ThemeModule} from "../../@theme/theme.module";
import {ControlComponent} from "./control.component";
import {NgxColorsModule} from "ngx-colors";
import {GroupControlComponent, GroupControlDialogComponent} from "./group-control.component";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {ControlContainerComponent} from "./control-container.component";


@NgModule({
  declarations: [
    ControlComponent,
    GroupControlComponent,
    ControlContainerComponent,
    GroupControlDialogComponent
  ],
  exports: [
    ControlComponent,
    GroupControlComponent,
    ControlContainerComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    CKEditorModule,
    NbListModule,
    NgxColorsModule,
    NbToggleModule,
    DragDropModule,
  ]
})
export class ControlModule {
}
