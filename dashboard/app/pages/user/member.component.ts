import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../@core/definition/user/type";
import {USER_DELETE_MEMBER, USER_MEMBER, USER_RESET_EMAIL} from '../../@core/definition/user/api';
import {HttpClient, HttpContext} from "@angular/common/http";
import {Cell, ServerDataSource} from "angular2-smart-table";
import {DeleteEvent} from "angular2-smart-table/lib/lib/events";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {OnSpinner} from "../../@core/definition/common";
import {SPINNER} from "../../@core/interceptor/authorization";
import {PostTypeSetting} from "../../@core/definition/content/type";

@Component({
  selector: 'app-user',
  templateUrl: './member.component.html',
})
export class MemberComponent implements OnInit, OnSpinner {
  settings: Settings = {
    columns: {},
  };
  source: ServerDataSource | undefined;
  batches = [
    {'label': '批量操作', 'value': ''},
    {'label': '删除', 'value': 'delete'},
    {'label': '发送密码重置邮件', 'value': 'reset'},
  ];
  batchMode: string = '';
  private roles: {label: string}[] = [];
  route: ActivatedRouteSnapshot;
  spinner: boolean = false;

  constructor(private http: HttpClient,
              protected activatedRoute: ActivatedRoute,
              protected configService: ConfigurationService) {

    this.route = activatedRoute.snapshot;
  }


  ngOnInit(): void {
    this.roles = this.configService.roles();
    this.settings = this.buildSettings();
    this.source = new ServerDataSource(this.http, {
      endPoint: USER_MEMBER,
      dataKey: 'records',
      totalKey: 'total',
      pagerPageKey: 'page',
      pagerLimitKey: 'limit',
      filterFieldKey: '#field#',
    });
  }


  private buildSettings(): Settings {
    return {
      selectMode: 'multi',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: true,
        columnTitle: '操作',
      },
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      pager: {
        perPage: 30,
      },
      mode: 'external',
      rowClassFunction: () => {
        return 'text-break';
      },
      columns: {
        account: {
          title: '用户名',
          type: 'custom',
          isFilterable: true,
          renderComponent: MemberActionComponent,
          componentInitFunction: (component: MemberActionComponent, cell: Cell) => {
            component.value = cell.getValue();
            component.rowData = cell.getRow().getData();
            component.postTypeSettings = this.configService.postTypes()
          },
        },
        nickname: {
          title: '显示名称',
          type: 'text',
          isFilterable: true,
          valuePrepareFunction: (nickname: string, user: Cell) => {
            return nickname == user.getRow().getData().account ? '-' : nickname;
          }
        },
        roles: {
          title: '角色',
          type: 'text',
          isFilterable: false,
          valuePrepareFunction: (roles: number[], user: Cell) => {
            if (roles.length < 1) {
              return '-';
            }
            let name: string[] = [];
            roles.forEach(val => {
              if (this.roles[val - 1]) {
                name.push(this.roles[val - 1].label)
              }
            });
            return name.join(',');
          },
        },
        email: {
          title: '邮箱',
          type: 'html',
          isFilterable: true,
          valuePrepareFunction: (email: string, user: Cell) => {
            return `<a href="mailto:${email}">${email}</a>`
          }
        },
        registeredAt: {
          title: '加入时间',
          type: 'text',
          isFilterable: false,
        },
      }
    }
  }

  delete($event: DeleteEvent) {
    let user: User = $event.data;
    if (user.id == 1) {
      window.alert("此用户不能被删除!");
      return ;
    }
    if (window.confirm("确认删除用户: " + user.account)) {
      this.deleteUser([user.id]);
      this.http.post(USER_DELETE_MEMBER, {id: user.id})
        .subscribe(_ => {
          this.source?.refresh();
        });
    }
  }

  batch() {
    let id: number[] = [];
    this.source?.getSelectedItems().forEach((item: User) => {
      id.push(item.id);
    });
    switch (this.batchMode) {
      case 'delete':
        if (id.length > 0 && window.confirm("确认删除已选择的用户?")) {
          this.deleteUser(id);
        }
        break;
      case 'reset':
        if (id.length > 0 && window.confirm("确认给已选择的用户发送重置密码邮件?")) {
          this.resetEmail(id);
        }
        break;
    }
  }

  private deleteUser(id: number[]) {
    this.http.post(USER_DELETE_MEMBER, {id: id}, {context:new HttpContext().set(SPINNER, this)})
      .subscribe(_ => {
        this.source?.refresh();
      });
  }
  private resetEmail(id: number[]) {
    this.http.post(USER_RESET_EMAIL, {id: id}, {context:new HttpContext().set(SPINNER, this)}).subscribe();
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }
}


@Component({
  selector: 'app-user-action',
  template: `
    <div class="d-flex flex-row">
      <img width="50" alt="" *ngIf="rowData.avatar" [src]="rowData.avatar"/>
      <a [class.ms-2]="rowData.avatar" [routerLink]="'/app/user/'+rowData.id" queryParamsHandling="merge">{{value}}</a>
    </div>
    <div>
      <a class="mx-2" [class.ms-0]="i == 0" [routerLink]="'/app/content/'+link.type" queryParamsHandling="merge" [queryParams]="{author:rowData.id}" *ngFor="let link of links; index as i">{{link.label}}</a>
    </div>
  `,
})
export class MemberActionComponent implements OnInit {
  @Input() value!: string;
  @Input() rowData!: User;

  postTypeSettings: Record<string, PostTypeSetting> = {};

  links: {label: string, type: string}[] = [];

  ngOnInit(): void {
    let links: {label: string, type: string}[] = [];
    for (let key in this.postTypeSettings) {
      let typeSetting = this.postTypeSettings[key];
      if (!typeSetting.visibility.showUi) {
        continue;
      }
      links.push({
        label: typeSetting.label,
        type: key,
      });
    }
    if (links) {
      this.links = links;
    }
  }
}
