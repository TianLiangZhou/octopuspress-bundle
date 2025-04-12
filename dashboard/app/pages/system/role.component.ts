import {Component, OnInit} from '@angular/core';
import {ROLE_DELETE, ROLE_STORE, ROLE_UPDATE, ROLES} from "../../@core/definition/system/api";
import {MENUS} from "../../@core/definition/open/api";
import {Role} from "../../@core/definition/system/type";
import {HttpClient, HttpContext} from "@angular/common/http";
import {OnSpinner, ResponseBody} from "../../@core/definition/common";
import {Capability} from "../../@core/definition/open/type";
import {SharedService} from "../../@core/services/shared.service";
import {ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {DeleteEvent, EditEvent} from "angular2-smart-table/lib/lib/events";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SPINNER} from "../../@core/interceptor/authorization";

type ResponseMenus = {menus: Capability[]} & ResponseBody;


@Component({
  selector: 'app-role',
  template: `
<div class="row">
  <div class="col col-md-4 col-sm-6">
    <nb-card>
      <nb-card-header class="d-flex justify-content-between align-items-center">
        <span>
        {{formGroup.controls['id'].value! > 0 ? '编辑角色' : '添加新角色'}}
        </span>
        <button status="primary" size="small" (click)="reset()" nbButton *ngIf="formGroup.controls['id'].value!"><nb-icon icon="plus-outline"></nb-icon></button>
      </nb-card-header>
      <nb-card-body>
        <form (ngSubmit)="onSubmit($event)" [formGroup]="formGroup">
          <div class="mb-3">
            <label for="inputName" class="label col-form-label">名称</label>
            <div>
              <input nbInput id="inputName" fullWidth status="primary" formControlName="name" />
            </div>
          </div>
          <div class="mb-3">
            <label for="inputPermission" class="label col-form-label">权限</label>
            <div class="">
              <app-tree formControlName="capabilities"
                        id="inputPermission"
                        [items]="menus"
                        (selectedChange)="capabilitySelected($event)"></app-tree>
            </div>
          </div>
          <div class="my-3  d-flex justify-content-between">
            <label class="label col-form-label"></label>
            <button
              type="submit"
              status="primary"
              size="small"
              [disabled]="formGroup.invalid || spinner"
              [nbSpinner]="spinner"
              nbButton>保存</button>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  </div>
  <div class="col col-md-8 col-sm-6">
    <nb-card>
      <nb-card-body>
        <angular2-smart-table
          [settings]="settings"
          [source]="source"
          (edit)="edit($event)"
          (delete)="delete($event)">
        </angular2-smart-table>
      </nb-card-body>
    </nb-card>
  </div>
</div>
  `,
  standalone: false,
})
export class RoleComponent implements OnInit, OnSpinner {
  settings: Settings = {columns: {}};
  source: ServerDataSource | undefined;
  menus: Capability[] = [];
  formGroup = new FormGroup({
    'id': new FormControl<number>(0),
    'name': new FormControl<string>('', Validators.required),
    'capabilities': new FormControl<string[]>([]),
  });
  spinner: boolean = false;
  constructor(private http: HttpClient, private sharedService: SharedService) {
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  ngOnInit(): void {
    this.http.get<ResponseMenus>(MENUS).subscribe(res => {
      this.menus = res.menus;
    });
    this.settings = this.buildSettings()
    this.source = new ServerDataSource(this.http, {
      endPoint: ROLES,
      dataKey: 'records',
      totalKey: 'total',
      pagerPageKey: 'page',
      pagerLimitKey: 'limit',
      filterFieldKey: '#field#',
    });
  }



  capabilitySelected(capabilities: any[]) {
    this.formGroup.controls['capabilities'].setValue(capabilities)
  }

  edit($event: EditEvent) {
    let role: Role = $event.data;
    this.selected(role);
  }

  delete($event: DeleteEvent) {
    let role: Role = $event.data;
    if (confirm("确定删除角色: " + role.name)) {
      this.http.delete(ROLE_DELETE, {body: role}).subscribe();
    }
  }

  onSubmit($event: any) {
    const data: any = this.formGroup.getRawValue();
    let url = data.id > 0 ? ROLE_UPDATE : ROLE_STORE;
    this.http.post(url, data, {context:new HttpContext().set(SPINNER, this)}).subscribe();
  }

  reset() {
    this.formGroup.reset();
    this.selected({id: 0, name: '', capabilities: []});
  }

  private selected(role: Role) {
    this.menus = this.menus.map(item => {
      this.selection(item, role.capabilities);
      return item;
    });
    this.formGroup.setValue({
      'id': role.id,
      'name': role.name,
      'capabilities': role.capabilities,
    });
  }

  private selection(item: any, capabilities: string[]) {
    item.checked = capabilities.includes(item.path)
    if (Array.isArray(item.children) && item.children.length >  0) {
      let checked = null;
      for (const child of item.children) {
        if (checked === null) {
          checked = capabilities.includes(child.path);
        } else if (checked !== capabilities.includes(child.path)) {
          checked = undefined;
        }
      }
      if (checked === null) {
        item.checked = false;
      }
      if (item.checked !== checked) {
        item.checked = checked;
      }
      for (const child of item.children) {
        this.selection(child, capabilities);
      }
    }
  }
  private buildSettings(): Settings {
    return {
      selectMode: 'single',
      actions: {
        position: 'right',
        add: false,
        edit: true,
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
      columns: {
        name: {
          title: '名称',
          isFilterable: true,
        }
      }
    }
  }
}
