import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {zhCN} from 'date-fns/locale';

import {
  NbAccordionModule,
  NbActionsModule,
  NbAlertModule,
  NbAutocompleteModule,
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbDialogModule,
  NbFormFieldModule,
  NbGlobalLogicalPosition,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbListModule,
  NbMenuModule,
  NbPopoverModule,
  NbRadioModule,
  NbRouteTabsetModule,
  NbSelectModule,
  NbSidebarModule,
  NbSpinnerModule,
  NbTabsetModule,
  NbTagModule,
  NbThemeModule,
  NbTimepickerModule,
  NbToastrModule,
  NbUserModule,
  NbWindowModule,
} from '@nebular/theme';

import {NbEvaIconsModule} from '@nebular/eva-icons';

import {LayoutComponent} from './layouts/layout.component';
import {HeaderComponent} from './layouts/header/header.component';
import {NbDateFnsDateModule} from '@nebular/date-fns';
import {CookieService} from 'ngx-cookie-service';
import {DynamicResourceLoaderService} from '../@core/services/dynamic-resource-loader.service';
import {DEFAULT_THEME} from './styles/theme.default';
import {COSMIC_THEME} from './styles/theme.cosmic';
import {CORPORATE_THEME} from './styles/theme.corporate';
import {DARK_THEME} from './styles/theme.dark';
import {CKFinderService} from "../@core/services/ckfinder.service";
import {SharedService} from "../@core/services/shared.service";
import {UserService} from "../@core/services/user.service";
import {RouterLink} from "@angular/router";


const BASE_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
];

const NB_MODULES = [
  NbCardModule,
  NbLayoutModule,
  NbTabsetModule,
  NbRouteTabsetModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSidebarModule,
  NbCheckboxModule,
  NbPopoverModule,
  NbButtonModule,
  NbToastrModule,
  NbInputModule,
  NbAccordionModule,
  NbDatepickerModule,
  NbDialogModule,
  NbWindowModule,
  NbAlertModule,
  NbSpinnerModule,
  NbRadioModule,
  NbSelectModule,
  NbBadgeModule,
  NbIconModule,
  NbEvaIconsModule,
  NbDateFnsDateModule,
  NbAutocompleteModule,
  NbTagModule,
  NbFormFieldModule,
  NbListModule,
];

const COMPONENTS = [
  LayoutComponent,
  HeaderComponent,
];

const PIPES: any[] = [

];



let NB_THEME_PROVIDERS: any[] = [
  CookieService,
  DynamicResourceLoaderService,
  CKFinderService,
  SharedService,
  UserService,
  ...NbThemeModule.forRoot({name: 'default',}, [DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME],).providers || [],
  ...NbSidebarModule.forRoot().providers || [],
  ...NbMenuModule.forRoot().providers || [],
  ...NbDatepickerModule.forRoot().providers || [],
  ...NbTimepickerModule.forRoot({
    format: 'HH:mm',
    twelveHoursFormat: false,
  }).providers || [],
  ...NbDialogModule.forRoot().providers || [],
  ...NbWindowModule.forRoot().providers || [],
  ...NbToastrModule.forRoot({
    destroyByClick: true,
    duration: 3500,
    hasIcon: true,
    position: NbGlobalLogicalPosition.TOP_END,
    preventDuplicates: false,
  }).providers || [],
  ...NbDateFnsDateModule.forRoot({
    format: 'yyyy-MM-dd HH:mm:ss',
    parseOptions: {awareOfUnicodeTokens: true, locale: zhCN},
    formatOptions: {awareOfUnicodeTokens: true, locale: zhCN},
  }).providers || [],
];

@NgModule({
    imports: [...BASE_MODULES, ...NB_MODULES, NbContextMenuModule, RouterLink],
  exports: [...BASE_MODULES, ...NB_MODULES, ...COMPONENTS, ...PIPES],
  declarations: [...COMPONENTS, ...PIPES],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: NB_THEME_PROVIDERS,
    };
  }
}
