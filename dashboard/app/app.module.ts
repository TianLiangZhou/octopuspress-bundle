import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, LOCALE_ID, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {ThemeModule} from "./@theme/theme.module";
import {CoreModule} from "./@core/core.module";
import {ConfigurationService, getBaseHref, initializeAppFactory} from "./@core/services/configuration.service";
import {APP_BASE_HREF, PlatformLocation} from "@angular/common";
import {Authorization} from "./@core/interceptor/authorization";
import {NotFoundComponent} from "./not-found.component";
import {NbIconLibraries} from "@nebular/theme";

@NgModule({
  bootstrap: [
    AppComponent,
  ],
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ThemeModule.forRoot(),
    CoreModule.forRoot()
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'zh' },
    {
      provide: HTTP_INTERCEPTORS, useClass: Authorization, multi: true
    },
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [HttpClient, ConfigurationService],
      multi: true
    },
    {provide: APP_BASE_HREF, useFactory: getBaseHref, deps: [PlatformLocation]},
  ],
})
export class AppModule {
  constructor(protected nbIconService: NbIconLibraries) {
    nbIconService.registerFontPack('fa', {
      packClass: "fa-regular",
    });
  }
}
