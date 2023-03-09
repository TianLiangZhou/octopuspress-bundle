import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OptionComponent} from './option.component';
import {ThemeModule} from '../../@theme/theme.module';
import {NbToggleModule} from '@nebular/theme';
import {RoleComponent} from './role.component';
import {GeneralComponent} from './setting/general/general.component';
import {MediaComponent} from './setting/media/media.component';
import {TreeViewModule} from "../../shared/treeview/tree-view.module";
import {ControlModule} from "../../shared/control/control.module";
import {ContentComponent} from "./setting/content/content.component";
import {Angular2SmartTableModule} from "angular2-smart-table";
import {RouterModule, Routes} from "@angular/router";
import {SettingComponent} from "./setting.component";

const routes: Routes = [
    {
      path: 'option',
      title: '选项',
      component: OptionComponent,
    },
    {
      path: 'setting',
      component: SettingComponent,
      children: [
        {
          path: '',
          redirectTo: 'general',
          pathMatch: 'full',
        },
        {
          path: 'general',
          component: GeneralComponent,
        },
        {
          path: 'content',
          component: ContentComponent,
        },
        {
          path: 'media',
          component: MediaComponent
        },
      ]
    },
    {
      path: 'role',
      title: '角色',
      component: RoleComponent,
    },
];

@NgModule({
  declarations: [
    OptionComponent,
    RoleComponent,
    SettingComponent,
    GeneralComponent,
    MediaComponent,
    ContentComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ThemeModule,
    Angular2SmartTableModule,
    NbToggleModule,
    TreeViewModule,
    ControlModule,
  ],
  providers: []
})
export class SystemModule {
}
