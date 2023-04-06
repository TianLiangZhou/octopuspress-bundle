import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, share} from 'rxjs';
import {NbMenuItem} from '@nebular/theme';
import {SESSION_USER} from "../definition/open/api";
import {Capability} from "../definition/open/type";
import {environment} from "../../../environments/environment";
import {SessionUser} from "../definition/common";
import {map, switchMap} from "rxjs/operators";

@Injectable()
export class UserService {

  private menu$: BehaviorSubject<NbMenuItem[]> = new BehaviorSubject<NbMenuItem[]>([]);

  private capabilities: Record<string, Capability>  = {};

  private _isRichEditor = true;

  get isRichEditor(): boolean {
    return this._isRichEditor;
  }

  constructor(private http: HttpClient) {

  }

  onMenuChange(): Observable<NbMenuItem[]> {
    return this.menu$
      .pipe(
        share(),
      );
  }

  request(): Observable<SessionUser> {
    return this.http.get<SessionUser>(SESSION_USER).pipe(
      map((response: SessionUser) => {
        let menus: NbMenuItem[] = [];
        response.capabilities.forEach((item) => {
          const nbMenuItem = this.menuHandle(item)
          if (nbMenuItem) {
            menus.push(nbMenuItem);
          }
        });
        this.menu$.next(menus);
        this._isRichEditor = response.isRichEditor;
        return response;
      }),
    );
  }

  public find(path: string, addPrefix: boolean = false): Capability | undefined {
    let fullPath = addPrefix ? environment.gateway + path : path
    if (this.capabilities.hasOwnProperty(fullPath)) {
      return this.capabilities[fullPath];
    }
    return undefined;
  }

  private menuHandle(item: Capability): NbMenuItem | undefined {
    if ((item.children === undefined || item.children.length === 0) && !item.link) {
        return undefined;
    }
    const child: NbMenuItem = {
      title: item.name,
      icon: item.icon,
      home: item.home || false,
      children: [],
      link: item.link,
      queryParams: item.queryParams,
    };
    this.capabilities[item.path] = {name: item.name, route: item.route, path: item.path};
    if (item.children && item.children.length > 0) {
      item.children.forEach((menu) => {
        const parent = this.menuHandle(menu);
        if (parent) {
          child.children!.push(parent);
        }
        this.capabilities[menu.path] = {name: menu.name, route: menu.route, path: menu.path};
      });
    }
    if (child.children!.length < 1) {
      delete child.children; // 如果有这个字段，URL不会显示出来
    }
    return child;
  }
}
