import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {PLUGIN_FEATURE} from "../../../@core/definition/plugin/api";
import {PluginDrawResponse, DrawTab, DrawTable, DrawForm} from "../../../@core/definition/plugin/type";
import {buildFormGroup} from "../../../shared/control/type";
import {FormGroup} from "@angular/forms";
import {NbToastrService} from "@nebular/theme";
import {ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";

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



  constructor(
    private http: HttpClient,
    private toast: NbToastrService,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      let pluginName = paramMap.get('plugin') ?? '';
      let feature = paramMap.get('page') ?? '';
      this.http.get<PluginDrawResponse>(PLUGIN_FEATURE, {params: {name: pluginName, feature: feature}})
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
                  this.formGroup[index] = buildFormGroup(tab.form?.controls!);
                }
              });
              break;
            case 'form':
              this.formGroup[0] = buildFormGroup(this.form?.controls!)
              this.form = res.form;
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
    this.http.post(link, this.formGroup[index].value).subscribe(res => {

    });
  }
}
