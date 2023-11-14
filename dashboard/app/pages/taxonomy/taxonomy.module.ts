import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ThemeModule} from "../../@theme/theme.module";
import {ControlModule} from "../../shared/control/control.module";
import {Angular2SmartTableModule} from "angular2-smart-table";
import {RouterModule, Routes} from "@angular/router";
import {
  ConvertDialogComponent,
  TaxonomyActionsComponent,
  TaxonomyComponent
} from "./taxonomy.component";
import {TaxonomyModule as CommonTaxonomyModule} from "../../shared/taxonomy/taxonomy.module";
import {EditTaxonomyComponent} from "../../shared/taxonomy/taxonomy.component";



let routes: Routes = [
  {
    path: ':taxonomy',
    component: TaxonomyComponent,
  },
  {
    path: ':taxonomy/:id',
    component: EditTaxonomyComponent,
  }
];

@NgModule({
  declarations: [
    TaxonomyComponent,
    TaxonomyActionsComponent,
    ConvertDialogComponent,
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Angular2SmartTableModule,
    ThemeModule,
    CommonTaxonomyModule,
  ]
})
export class TaxonomyModule {
}
