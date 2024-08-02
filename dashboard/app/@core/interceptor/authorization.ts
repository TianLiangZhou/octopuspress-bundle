import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse, HttpStatusCode, HttpContextToken
} from '@angular/common/http';
import {NbAuthService, NbAuthToken, NbTokenService} from '@nebular/auth';

import {finalize, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from "../../../environments/environment";
import {SharedService} from "../services/shared.service";
import {UserService} from "../services/user.service";
import {OnSpinner} from "../definition/common";
import {NbToastrService} from "@nebular/theme";

export const SPINNER = new HttpContextToken<OnSpinner | undefined>(() => undefined);


/** Inject With Credentials into the request */
@Injectable({
  providedIn: 'root'
})
export class Authorization implements HttpInterceptor {
  private token: string = '';
  public constructor(
    private router: Router,
    private authService: NbAuthService,
    private sharedService: SharedService,
    private toastService: NbToastrService,
    private menuService: UserService,
    protected tokenService: NbTokenService
  ) {
    this.authService
      .onTokenChange()
      .subscribe((token: NbAuthToken) => {
        this.token = token.toString()
      });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let url = req.url.startsWith('http') || req.url.startsWith('/authorize/') ? req.url : environment.gateway + req.url
    let matchVars = url.matchAll(new RegExp('\{([a-zA-Z]+)\}', 'g'));
    let formatUrl  = url;
    for (let matchVar of matchVars) {
      if (matchVar.length !== 2) {
        continue;
      }
      if (req.body && req.body.hasOwnProperty(matchVar[1])) {
        formatUrl = formatUrl.replace(matchVar[0], req.body[matchVar[1]]);
      } else if (req.params && req.params.has(matchVar[1])) {
        formatUrl = formatUrl.replace(matchVar[0], req.params.get(matchVar[1]) || matchVar[0]);
      }
    }
    req = req.clone({
      url: formatUrl,
      withCredentials: false,
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': this.token,
      },
      responseType: "json"
    });
    let spinner = req.context.get(SPINNER);
    if (spinner !== undefined) {
      spinner.onSpinner(true)
    } else {
      this.sharedService.loading(true);
    }
    return next
      .handle(req)
      .pipe(
        finalize(() => {
          spinner ? spinner.onSpinner(false) : this.sharedService.loading(false);
        }),
        tap({
          error: (error) => {
            if (!(error instanceof HttpErrorResponse)) {
              return
            }
            if (error.status === HttpStatusCode.Unauthorized) {
              this.tokenService.clear();
              this.sharedService.lastPage = this.router.url;
              this.router.navigate(['/auth/login']).then(_ => {});
              return;
            }
            let menu = this.menuService.find(url);
            this.toastService.danger(
              error.error.message ? error.error.message : error.message,
              menu ? menu.name : "未知主题",
            );
          },
          next: (response) => {
            if (response instanceof HttpResponse) {
              if (!['POST', 'PUT', 'DELETE'].includes(req.method)) {
                return;
              }
              let menu = this.menuService.find(url);
              if (!menu) {
                return;
              }
              this.toastService.success((response.body && response.body.message) ? response.body.message  : "操作成功", menu.name);
            }
          }
        })
      );
  }
}
