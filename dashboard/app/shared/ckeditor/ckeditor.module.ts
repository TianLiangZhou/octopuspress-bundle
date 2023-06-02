import { NgModule } from '@angular/core';
import {CkeditorComponent} from "./ckeditor.component";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {FormsModule} from "@angular/forms";



@NgModule({
  imports: [
    CKEditorModule,
    FormsModule
  ],
  exports: [
    CkeditorComponent
  ],
  declarations: [
    CkeditorComponent
  ]
})
export class CkeditorModule{

}
