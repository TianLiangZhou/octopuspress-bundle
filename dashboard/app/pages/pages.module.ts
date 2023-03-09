import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesComponent } from './pages.component';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      title: "Dashboard",
      component: DashboardComponent,
    },
    {
      path: 'system',
      title: "设置",
      loadChildren: () => import('./system/system.module').then(m => m.SystemModule),
    },
    {
      path: 'user',
      title: "用户",
      loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    },
    {
      path: 'content',
      title: "内容",
      loadChildren: () => import('./content/content.module').then(m => m.ContentModule),
    },
    {
      path: 'taxonomy',
      title: "内容",
      loadChildren: () => import('./taxonomy/taxonomy.module').then(m => m.TaxonomyModule),
    },
    {
      path: 'decoration',
      title: "外观",
      loadChildren: () => import('./decoration/decoration.module').then(m => m.DecorationModule),
    },
    {
      path: 'media',
      title: "媒体",
      loadChildren: () => import('./media/media.module').then(m => m.MediaModule),
    },
    {
      path: 'plugin',
      title: "插件",
      loadChildren: () => import('./plugin/plugin.module').then(m => m.PluginModule),
    },
    {
      path: 'comment',
      title: "评论",
      loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
    }
  ],
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardModule,
    ThemeModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule { }
