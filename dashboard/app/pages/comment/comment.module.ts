import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CommentContentComponent,
  CommentComponent,
  CommentEditComponent,
  CommentPostComponent
} from './comment.component';
import {RouterModule} from "@angular/router";
import {ThemeModule} from "../../@theme/theme.module";
import {Angular2SmartTableModule} from "angular2-smart-table";



@NgModule({
  declarations: [
    CommentComponent, CommentContentComponent, CommentEditComponent,CommentPostComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CommentComponent,
        pathMatch: "full"
      },
      {
        path: ':id',
        title: '编辑评论',
        component: CommentEditComponent,
      }
    ]),
    ThemeModule,
    Angular2SmartTableModule,
  ]
})
export class CommentModule { }
