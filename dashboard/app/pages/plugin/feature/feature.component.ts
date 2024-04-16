import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginDrawResponse, DrawTab, DrawTable, DrawForm} from "../../../@core/definition/plugin/type";
import {buildFormGroup} from "../../../shared/control/type";
import {FormGroup} from "@angular/forms";
import {NbTabComponent, NbTabsetComponent, NbToastrService} from "@nebular/theme";
import {DeleteEvent, CreateEvent, EditEvent, ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {SITE_GENERAL_SAVE} from "../../../@core/definition/system/api";
import {Cell} from "angular2-smart-table/lib/lib/data-set/cell";

@Component({
  selector: 'app-plugin-feature',
  templateUrl: './feature.component.html',
  styles: [
    `
      :host ::ng-deep nb-tab {
        overflow: hidden !important;
      }
    `
  ]
})
export class FeatureComponent implements OnInit {

  title: string = "";

  container: string = "";

  tabs: DrawTab[] = [];

  form: DrawForm | undefined;

  table: DrawTable | undefined;
  settings: Settings[] = []
  source: ServerDataSource[] = [];
  formGroup: FormGroup[] = [];
  private controlDefaultValues: Record<string, any>[] = [];

  private pluginLink = "";

  @ViewChild('nbTabsetComponent', {read: NbTabsetComponent})
  tabsetComponent!: NbTabsetComponent | undefined;
  private editNotify: boolean = false;

  constructor(
    private http: HttpClient,
    private toast: NbToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(paramMap => {
      let feature = paramMap.get('page') ?? '';
      if (!feature) {
        this.router.navigateByUrl('/404').then();
        return ;
      }
      this.pluginLink = feature.replace("/backend", "");
      this.http.get<PluginDrawResponse>(this.pluginLink)
        .subscribe(res => {
          this.title = res.title;
          this.container = res.container;
          switch (this.container) {
            case 'tabs':
              this.tabs = res.tabs!;
              this.tabs.forEach((tab, index) => {
                if (tab.container == 'table') {
                  this.source[index] = this.getSource(tab.table?.source.default!);
                  this.settings[index] = this.getSettings(tab.table!);
                } else {
                  this.formGroup[index] = new FormGroup<any>(buildFormGroup(tab.form?.controls!));
                  let values: Record<string, any> = {};
                  tab.form?.controls.forEach((item) => {
                    values[item.id] = item.value;
                  });
                  this.controlDefaultValues[index] = values;
                }
              });
              break;
            case 'form':
              this.form = res.form;
              this.formGroup[0] = new FormGroup<any>(buildFormGroup(this.form?.controls!));
              break;
            case 'table':
              this.table = res.table!;
              this.source[0] = this.getSource(this.table.source.default);
              this.settings[0] = this.getSettings(this.table);
              break;
          }
        });
    });
  }

  create($event: CreateEvent, index: number) {
    this.tabSwitch($event, index, 'add');
  }

  edit($event: EditEvent, index: number) {
    this.tabSwitch($event, index, 'edit');
  }

  private tabSwitch($event: any, index: number, source: 'add' | 'edit') {
    let endpoint = "";
    if (this.tabs.length > 0) {
      endpoint = this.tabs[index].table?.source[source]!;
    } else {
      endpoint = this.table?.source[source]!;
    }
    if (endpoint.startsWith('#/')) {
      this.router.navigateByUrl(endpoint);
    } else if (endpoint.startsWith('#')) {
      let i = parseInt(endpoint[1]);
      let tab = this.tabsetComponent?.tabs?.get(i);
      if (tab) {
        if (source == 'edit') {
          for (let name in this.formGroup[i].controls) {
            this.formGroup[i].controls[name].setValue($event.data[name]);
          }
        }
        this.editNotify = true;
        this.tabsetComponent?.selectTab(tab);
      }
    }
  }

  delete($event: DeleteEvent, index: number) {
    let endpoint = "";
    if (this.tabs.length > 0) {
      endpoint = this.tabs[index].table?.source.delete!;
    } else {
      endpoint = this.table?.source.delete!;
    }
    this.http.post(endpoint, $event.data).subscribe();
  }

  getSettings(table: DrawTable): Settings {
    let columns = table.columns;
    for (let key in columns) {
      // @ts-ignore
      if (columns[key].type === 'image' || columns[key].type === 'status') {
        // @ts-ignore
        if (columns[key].type === 'image' ) {
          columns[key].valuePrepareFunction = (rawValue: any, cell: Cell): string => {
            if (rawValue) {
              console.log(cell.getRow().getData());
              // @ts-ignore
              return `<img alt="" width="50" src="${cell.getRow().getData()[key + '_url']}" />`;
            }
            return '';
          };
        }
        // @ts-ignore
        if (columns[key].type === 'status' ) {
          columns[key].valuePrepareFunction = (rawValue: any, cell: Cell): string => {
            let data = cell.getRow().getData();
            let value = rawValue;
            let classValue = 'primary';
            if (data.hasOwnProperty(key + '_text')) {
              value = data[key+ '_text'];
            }
            if (data.hasOwnProperty(key+'_class')) {
              classValue = data[key+'_class'];
            }
            return `<span class="badge text-bg-${classValue}">${value}</span>`;
          };
        }
        columns[key].type = 'html';
      }
    }

    return {
      actions: {
        position: 'right',
        add: table.actions.add,
        edit: table.actions.edit,
        delete: table.actions.delete,
        columnTitle: '操作',
      },
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
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
      columns: columns,
    };
  }

  getSource(endpoint: string) {
    return new ServerDataSource(this.http, {
      endPoint: endpoint,
      dataKey: 'records',
      totalKey: 'total',
      pagerPageKey: 'page',
      pagerLimitKey: 'limit',
      filterFieldKey: '#field#',
    });
  }

  changeTab($event: NbTabComponent) {
    let index = parseInt($event.tabId);
    if (!this.editNotify) {
      if (this.formGroup[index]) {
        this.formGroup[index].setValue(this.controlDefaultValues[index]);
      }
    }
    this.editNotify = false;
  }


  submit(index: number, link: string) {
    if (this.formGroup[index].invalid) {
      return ;
    }
    if (link == "" || link == "#" || link == "/") {
      link = SITE_GENERAL_SAVE;
    }
    this.http.post(link, this.formGroup[index].getRawValue(), {
      params: {page: this.pluginLink}
    }).subscribe(res => {
    });
  }
}
