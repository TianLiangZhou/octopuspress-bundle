import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import {MemberActionComponent, MemberComponent} from './member.component';
import {ThemeModule} from '../../@theme/theme.module';
import {Angular2SmartTableModule} from "angular2-smart-table";
import {RouterModule, Routes} from "@angular/router";
import {NewComponent} from "./new.component";
import {ControlModule} from "../../shared/control/control.module";
import {UploadModule} from "../../shared/upload/upload.module";


const routes: Routes = [
  {
    path: '',
    title: '所有用户',
    component: MemberComponent,
  },
  {
    path: 'new',
    title: '添加新用户',
    pathMatch: 'full',
    component: NewComponent,
  },
  {
    path: 'profile',
    title: '个人资料',
    component: NewComponent,
  },
  {
    path: ':id',
    title: '编辑用户',
    component: NewComponent,
  },
];



@NgModule({
  declarations: [
    MemberComponent,
    NewComponent,
    MemberActionComponent,
  ],
  imports: [
    CommonModule,
    ThemeModule,
    RouterModule.forChild(routes),
    Angular2SmartTableModule,
    ControlModule,
    UploadModule,
    NgOptimizedImage,
  ],
})
export class UserModule { }
