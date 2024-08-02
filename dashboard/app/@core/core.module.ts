import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbAuthJWTToken,
  NbAuthModule,
  NbPasswordAuthStrategy,
} from '@nebular/auth';
import {
  AUTHORIZE_FORGOT,
  AUTHORIZE_LOGIN,
  AUTHORIZE_LOGOUT,
  AUTHORIZE_REGISTER,
  AUTHORIZE_RESET
} from "./definition/open/api";

export const NB_CORE_PROVIDERS: any[] = [
  ...NbAuthModule.forRoot({
    strategies: [
      NbPasswordAuthStrategy.setup({
        name: 'email',
        token: {
          class: NbAuthJWTToken,
          key: 'token'
        },
        baseEndpoint: "",
        login: {
          endpoint: AUTHORIZE_LOGIN,
          method: 'post',
          redirect: {
            success: null,
            failure: null,
          },
          defaultMessages: ['登录成功'],
        },
        register: {
          endpoint: AUTHORIZE_REGISTER,
          method: 'post',
          redirect: {
            success: '/app/dashboard',
            failure: null,
          },
        },
        logout: {
          endpoint: AUTHORIZE_LOGOUT,
          method: 'post',
          redirect: {
            success: '/auth/login',
            failure: null,
          }
        },
        requestPass: {
          endpoint: AUTHORIZE_FORGOT,
          method: 'post',
          defaultMessages: ['重置密码说明已发送至您的电子邮箱。']
        },
        resetPass: {
          endpoint: AUTHORIZE_RESET,
          method: 'post',
          redirect: {
            success: '/auth/login',
            failure: null,
          },
          defaultMessages: ['您的密码已重置成功。']
        },
        errors: {
          key: 'message',
        },
        messages: {
          key: 'message',
        }
      }),
    ],
    forms: {
    },
  }).providers || [],
];

function throwIfAlreadyLoaded(parentModule: any, moduleName: string) {
  if (parentModule) {
    throw new Error(`${moduleName} has already been loaded. Import Core modules in the AppModule only.`);
  }
}

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    NbAuthModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: NB_CORE_PROVIDERS,
    };
  }
}
