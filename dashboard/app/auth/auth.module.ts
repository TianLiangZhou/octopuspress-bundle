import { NgModule } from '@angular/core';
import {LoginComponent } from './login/login.component';
import {AuthRoutingModule} from "./auth-routing.module";
import {ThemeModule} from "../@theme/theme.module";
import {NbAuthModule} from "@nebular/auth";
import {AuthComponent} from "./auth.component";
import { LogoutComponent } from './logout/logout.component';
import { ForgotComponent } from './forgot/forgot.component';
import {ResetComponent} from "./reset/reset.component";

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    LogoutComponent,
    ForgotComponent,
    ResetComponent,
  ],
  imports: [
    ThemeModule,
    NbAuthModule,
    AuthRoutingModule
  ],
})
export class AuthModule {

}
