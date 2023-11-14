import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ThemeModule} from "../../@theme/theme.module";
import {ControlModule} from "../control/control.module";
import {
  CreateTaxonomyComponent,
  EditTaxonomyComponent,
} from "./taxonomy.component";


@NgModule({
  declarations: [
    CreateTaxonomyComponent,
    EditTaxonomyComponent,
  ],
  exports: [
    CreateTaxonomyComponent,
    EditTaxonomyComponent
  ],
  imports: [
    CommonModule,
    ThemeModule,
    ControlModule,
  ]
})
export class TaxonomyModule {
}
