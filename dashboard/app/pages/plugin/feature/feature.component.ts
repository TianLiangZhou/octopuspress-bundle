import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {PluginDrawResponse, DrawTab, DrawTable, DrawForm} from "../../../@core/definition/plugin/type";
import {buildFormGroup} from "../../../shared/control/type";
import {FormGroup} from "@angular/forms";
import {NbToastrService} from "@nebular/theme";
import {ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {SITE_GENERAL_SAVE} from "../../../@core/definition/system/api";

@Component({
  selector: 'app-plugin-feature',
  templateUrl: './feature.component.html',
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

  private pluginLink = "";

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
                  this.source[index] = this.getSource(tab.table?.source!);
                  this.settings[index] = this.getSettings(tab.table!);
                } else {
                  this.formGroup[index] = new FormGroup<any>(buildFormGroup(tab.form?.controls!));
                }
              });
              break;
            case 'form':
              this.form = res.form;
              this.formGroup[0] = new FormGroup<any>(buildFormGroup(this.form?.controls!));
              break;
            case 'table':
              this.table = res.table!;
              this.source[0] = this.getSource(this.table.source);
              this.settings[0] = this.getSettings(this.table);
              break;
          }
        });
    });
  }

  create() {

  }

  edit($event: any) {

  }

  delete($event: any) {

  }

  getSettings(table: DrawTable): Settings {
    return {
      actions: {
        position: 'right',
        add: table.actions.create,
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
      columns: table.columns,
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
