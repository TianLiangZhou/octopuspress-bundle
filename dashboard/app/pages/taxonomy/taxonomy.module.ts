import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ThemeModule} from "../../@theme/theme.module";
import {ControlModule} from "../../shared/control/control.module";
import {Angular2SmartTableModule} from "angular2-smart-table";
import {RouterModule, Routes} from "@angular/router";
import {EditTaxonomyComponent, TaxonomyComponent} from "./taxonomy.component";



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
    TaxonomyComponent, EditTaxonomyComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Angular2SmartTableModule,
    ThemeModule,
    ControlModule,
  ]
})
export class TaxonomyModule {
}
