import {Component, OnInit} from '@angular/core';
import {User} from "../../@core/definition/user/type";
import {USER_DELETE_MEMBER, USER_MEMBER, USER_RESET_EMAIL} from '../../@core/definition/user/api';
import {HttpClient, HttpContext} from "@angular/common/http";
import {IColumnType, ServerDataSource} from "angular2-smart-table";
import {DeleteEvent} from "angular2-smart-table/lib/lib/events";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {ActivatedRoute, ActivatedRouteSnapshot} from "@angular/router";
import {OnSpinner} from "../../@core/definition/common";
import {SPINNER} from "../../@core/interceptor/authorization";

@Component({
  selector: 'app-user',
  templateUrl: './member.component.html',
})
export class MemberComponent implements OnInit, OnSpinner {
  settings = {};
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
    this.settings = this.buildSettings()
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
          type: IColumnType.Html,
          filter: true,
          valuePrepareFunction: (account: string, user: User) => {
            return `<img width="50" alt="" src="${user.avatar}" />
            <a href="#/app/user/${user.id}">${account}</a>`
          }
        },
        nickname: {
          title: '显示名称',
          type: IColumnType.Text,
          filter: true,
          valuePrepareFunction: (nickname: string, user: User) => {
            return nickname == user.account ? '-' : nickname;
          }
        },
        roles: {
          title: '角色',
          type: IColumnType.Text,
          valuePrepareFunction: (roles: number[], user: User) => {
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
          type: IColumnType.Html,
          filter: true,
          valuePrepareFunction: (email: string, user: User) => {
            return `<a href="mailto:${email}">${email}</a>`
          }
        },
        registeredAt: {
          title: '加入时间',
          type: IColumnType.Text,
          filter: false,
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
