import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { LoginComponent } from './login/login.component';
import { AuthComponent } from "./auth.component";
import { LogoutComponent } from './logout/logout.component';
import {ForgotComponent} from "./forgot/forgot.component";
import {NbResetPasswordComponent} from "@nebular/auth";
import {ResetComponent} from "./reset/reset.component";

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forgot',
        component: ForgotComponent,
      },
      {
        path: 'logout',
        component: LogoutComponent,
      },
      {
        path: 'reset-password/:token',
        component: ResetComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule{ }
