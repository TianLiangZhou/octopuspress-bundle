import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ThemeModule} from "../../@theme/theme.module";
import {EditPostModule} from "../../shared/edit-post/edit-post.module";
import {ControlModule} from "../../shared/control/control.module";
import {
  PostComponent,
  EditPostComponent,
  PostActionsComponent,
  PostTaxonomyComponent,
  PostAuthorComponent
} from "./post.component";
import {Angular2SmartTableModule} from "angular2-smart-table";
import {RouterModule, Routes} from "@angular/router";



let routes: Routes = [
  {
    path: 'post-new',
    pathMatch: 'full',
    title: '新建文章',
    component: EditPostComponent,
  },
  {
    path: 'post-new/:type',
    title: '新建文章',
    component: EditPostComponent,
  },
  {
    path: 'edit-post/:id',
    title: '编辑文章',
    component: EditPostComponent,
  },
  {
    path: ':type',
    component: PostComponent,
  },
];

@NgModule({
  declarations: [
    PostComponent,
    EditPostComponent,
    PostActionsComponent,
    PostTaxonomyComponent,
    PostAuthorComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Angular2SmartTableModule,
    ThemeModule,
    EditPostModule,
    ControlModule,
  ]
})
export class ContentModule {
}
