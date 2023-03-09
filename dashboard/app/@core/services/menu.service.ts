import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, share} from 'rxjs';
import {NbMenuItem} from '@nebular/theme';
import {AUTHORIZED_MENU} from "../definition/open/api";
import {Menu} from "../definition/open/type";
import {environment} from "../../../environments/environment";
import {Menus} from "../definition/common";

@Injectable()
export class MenuService {

  private menu$: BehaviorSubject<NbMenuItem[]> = new BehaviorSubject<NbMenuItem[]>([]);

  private permission: Map<string, Menu> = new Map<string, Menu>();

  private permission$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  menuChange(): Observable<NbMenuItem[]> {
    return this.menu$
      .pipe(
        share(),
      );
  }
  permissionChange(): Observable<boolean> {
    return this.permission$
      .pipe(
        share(),
      );
  }

  get() {
    this.http.get<Menus>(AUTHORIZED_MENU)
      .subscribe(res => {
        if (Array.isArray(res.menus) && res.menus.length > 0) {
          let menu: NbMenuItem[] = [];
          let permission: Menu[] =[];
          res.menus.forEach((item: Menu) => {
            const nbMenuItem = this.menuHandle(item);
            this.flatMap(item, permission);
            if (nbMenuItem) {
              menu.push(nbMenuItem);
            }
          });
          this.permission = new Map(permission.map(m => [m.path, m]));
          this.permission$.next(true);
          this.menu$.next(menu);
        }
    });
  }

  public find(path: string, addPrefix: boolean = false): Menu | undefined {
    let fullPath = addPrefix ? environment.gateway + path : path
    if (this.permission.has(fullPath)) {
      return this.permission.get(fullPath);
    }
    return undefined;
  }

  private flatMap(item: Menu, permission: Menu[]): any {
    if (item.children &&  item.children.length > 0) {
      item.children.map((item) => {
        this.flatMap(item, permission);
      });
    }
    delete item.children;
    permission.push(item);
  }

  private menuHandle(item: Menu): NbMenuItem | null {
    if ((item.children === undefined || item.children.length === 0) && !item.link) {
        return null;
    }
    const child: NbMenuItem = {
      title: item.name,
      icon: item.icon,
      home: item.home,
      children: [],
      link: item.link,
    };
    if (item.children && item.children.length > 0) {
      item.children.forEach((menu) => {
        const parent = this.menuHandle(menu);
        if (parent) {
          child.children!.push(parent);
        }
      });
    }
    if (child.children!.length < 1) {
      delete child.children; // 如果有这个字段，URL不会显示出来
    }
    return child;
  }
}
