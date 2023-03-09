import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {NbCardModule} from "@nebular/theme";
import {RouterModule, Routes} from "@angular/router";
import {MediaComponent} from "./media.component";

const routes: Routes = [
  {
    path: "",
    component: MediaComponent,
  },
];

@NgModule({
  declarations: [MediaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NbCardModule
  ]
})
export class MediaModule { }
