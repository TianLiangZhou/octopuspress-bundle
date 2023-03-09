import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EditPostComponent, FlatTermSelectorComponent, HierarchicalTermSelectorComponent} from "./edit-post.component";
import {
  NbListModule
} from "@nebular/theme";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {ControlModule} from "../control/control.module";
import {ThemeModule} from "../../@theme/theme.module";
import {CKFinderService} from "../../@core/services/ckfinder.service";
import {CkeditorModule} from "../ckeditor/ckeditor.module";



@NgModule({
  declarations: [
    EditPostComponent,
    HierarchicalTermSelectorComponent,
    FlatTermSelectorComponent,
  ],
  exports: [
    EditPostComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    CKEditorModule,
    NbListModule,
    ControlModule,
    CkeditorModule
  ],
  providers: [
    CKFinderService
  ]
})
export class EditPostModule { }
