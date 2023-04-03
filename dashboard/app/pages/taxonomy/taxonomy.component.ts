import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {TaxonomySetting, TermTaxonomy} from "../../@core/definition/content/type";
import {HttpClient, HttpContext} from "@angular/common/http";
import {
  TAXONOMIES, TAXONOMY_CONVERT,
  TAXONOMY_DELETE, TAXONOMY_SHOW,
  TAXONOMY_STORE,
  TAXONOMY_UPDATE
} from "../../@core/definition/content/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {buildFormGroup, Control, ControlOption} from "../../shared/control/type";
import {OnSpinner, Records} from "../../@core/definition/common";
import {IColumnType, ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {FormControl, FormGroup} from "@angular/forms";
import {SPINNER} from "../../@core/interceptor/authorization";
import {LocationStrategy} from "@angular/common";
import {NbDialogRef, NbDialogService} from '@nebular/theme';

@Component({
  selector: 'app-taxonomy',
  templateUrl: './taxonomy.component.html',
})
export class TaxonomyComponent implements OnInit, OnSpinner {
  private taxonomy: string = "";
  settings = {};
  source: ServerDataSource | undefined;
  formGroup: FormGroup | undefined;
  spinner: boolean = false;
  controls: Control[] = [];
  metaControls: Control[] = [];
  taxonomySetting: TaxonomySetting | undefined;
  batches = [
    {'label': '批量操作', 'value': ''},
    {'label': '删除', 'value': 'delete'},
  ];
  batchMode: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private config: ConfigurationService,
    private dialog: NbDialogService
  ) {

  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  ngOnInit() {
    let taxonomies = this.config.taxonomies();
    this.route.paramMap.subscribe(paramMap => {
      let taxonomy = paramMap.get('taxonomy') ?? '';
      if (!taxonomy || !Object.keys(taxonomies).includes(taxonomy)) {
        this.router.navigateByUrl("/404").then();
        return ;
      }
      if (!taxonomies[taxonomy].visibility.showUi) {
        return ;
      }
      this.taxonomy = taxonomy;
      this.buildSetting(taxonomies[taxonomy]);
    });
  }


  onSubmit($event: any) {
    if (this.formGroup?.invalid) {
      return ;
    }
    const data = this.formGroup?.getRawValue();
    this.http.post<TermTaxonomy>(TAXONOMY_STORE.replace('{taxonomy}', this.taxonomy), data, {context:new HttpContext().set(SPINNER, this)}).subscribe(response => {
      this.source?.refresh();
      this.formGroup?.reset();
      this.formGroup?.controls['taxonomy'].setValue(this.taxonomy);
      this.formGroup?.controls['parent']?.setValue('');
    });
  }

  private delete(taxonomy: TermTaxonomy) {
    this.deleteTaxonomy([taxonomy.id!], "确认删除类目: " + taxonomy.name + "?")
  }

  private buildSetting(setting: TaxonomySetting) {
    if (!setting.visibility.showUi) {
      return ;
    }
    this.settings = this.buildSettings();
    this.source = new ServerDataSource(this.http, {
      endPoint: TAXONOMIES.replace('{taxonomy}', this.taxonomy),
      dataKey: 'records',
      totalKey: 'total',
      pagerPageKey: 'page',
      pagerLimitKey: 'limit',
      filterFieldKey: '#field#',
    });
    let elements: Control[] = [];
    if (setting.labels['nameField']) {
      elements.push({
        label: setting.labels['nameField'], required: true, id: "name", type: 'input', description: setting.labels['nameFieldDescription'],
      });
    }
    if (setting.labels['slugField']) {
      elements.push({
        label: setting.labels['slugField'], id: "slug", type: 'input', value: '', validators: [{key: "pattern", value: "^[a-z0-9]+(?:-[a-z0-9]+)*$"}], description: setting.labels['slugFieldDescription'],
      });
    }
    if (setting.labels['parentField'] && setting.hierarchical) {
      let options: ControlOption[] = [
        {label: "无", value: ''},
      ];
      elements.push({
        label: setting.labels['parentField'], id: "parent", required: false, type: "select", value: '', options: options, description: setting.labels['parentFieldDescription'],
      });

      this.source?.getAll().then((taxonomies: TermTaxonomy[]) => {
        taxonomies.forEach(taxonomy => {
          let name = taxonomy.name;
          if (taxonomy.level != undefined && taxonomy.level > 0) {
            name = '--'.repeat(taxonomy.level) + taxonomy.name;
          }
          options.push({label: name, value: taxonomy.id!})
        })
      });
    }
    if (setting.labels['descField']) {
      elements.push({
        label: setting.labels['descField'], id: "desc", type: 'textarea', value: '', description: setting.labels['descFieldDescription'], required: false,
      });
    }
    this.formGroup = elements.length ? buildFormGroup(elements) : new FormGroup<any>({});
    this.formGroup.addControl('id', new FormControl<number>(0));
    this.formGroup.addControl('taxonomy', new FormControl<string>(this.taxonomy));
    const metas = this.config.taxonomyMeta(this.taxonomy);
    const metaControls: Control[] = [];
    if (metas.length > 0) {
      metas.forEach(item => {
        if (item.showUi && item.isUpdated && item.control) {
          metaControls.push(item.control);
        }
      });
    }
    this.formGroup.addControl('meta',
      metaControls.length > 0 ? buildFormGroup(metaControls) : new FormGroup({})
    );
    this.metaControls = metaControls;
    this.controls = elements;
    this.taxonomySetting = setting;
  }
  get metaGroup() {
    return this.formGroup?.controls['meta'] as FormGroup;
  }


  private buildSettings(): Settings {
    return {
      selectMode: 'multi',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
        columnTitle: '操作',
      },
      pager: {
        perPage: 30,
      },
      mode: 'external',
      rowClassFunction: () => {
        return 'text-break';
      },
      columns: {
        name: {
          title: '名称',
          type: IColumnType.Custom,
          filter: true,
          renderComponent: TaxonomyActionsComponent,
          onComponentInitFunction: (component: TaxonomyActionsComponent) => {
            component.onClick().subscribe(item => {
              switch (item.action) {
                case 'delete':
                  this.delete(item.taxonomy)
                  break;
                case 'convert':
                  this.convertDialog(item.taxonomy);
                  break;
              }
            });
          },
          isSortable: false
        },
        slug: {
          title: '别名',
          type: IColumnType.Text,
          filter: false,
          isSortable: false
        },
        description: {
          title: '内容描述',
          type: IColumnType.Text,
          filter: false,
          isSortable: false
        },
        count: {
          title: '总数',
          type: IColumnType.Text,
          filter: false,
        }
      }
    }
  }

  batch() {
    const id = this.source?.getSelectedItems().map((item) => {
      return item.id;
    });
    if (id === undefined || id.length < 1) {
      return ;
    }
    switch (this.batchMode) {
      case 'delete':
        this.deleteTaxonomy(id, "确认删除已选择的类目?");
        break;
    }
  }

  private deleteTaxonomy(id: number[], message: string) {
    if (window.confirm(message)) {
      this.http.post(TAXONOMY_DELETE.replace('{taxonomy}', this.taxonomy), {sets: id}).subscribe(()=>{
        this.source?.refresh();
      });
    }
  }
  private convertDialog(taxonomy: TermTaxonomy) {
    this.dialog.open(ConvertDialogComponent, {
      context: {
        taxonomy: taxonomy,
      },
    }).onClose.subscribe(selectedTaxonomy => {
      if (selectedTaxonomy !== undefined && selectedTaxonomy) {
        this.convert(taxonomy.id!, selectedTaxonomy);
      }
    });
  }

  private convert(id: number, toTaxonomy: string) {
    this.http.post(TAXONOMY_CONVERT, {id: id, toTaxonomy: toTaxonomy}).subscribe(() => {
      this.source?.refresh();
    });
  }
}


@Component({
  selector: 'app-taxonomy-edit',
  template: `
    <nb-card>
      <nb-card-header>{{taxonomySetting ? taxonomySetting!.labels.editItem : ''}}</nb-card-header>
      <nb-card-body>
        <form *ngIf="formGroup" (ngSubmit)="onSubmit($event)" [formGroup]="formGroup!">
          <control-container direction="" [controls]="controls" [form]="formGroup!"></control-container>
          <control-container [controls]="metaControls" [form]="metaGroup"></control-container>
          <div class="my-3  d-flex justify-content-between">
            <label class="label col-form-label"></label>
            <button
              type="submit"
              status="primary"
              size="small"
              [disabled]="formGroup!.invalid || spinner"
              [nbSpinner]="spinner"
              nbButton>更新</button>
          </div>
        </form>
      </nb-card-body>
    </nb-card>
  `,
})
export class EditTaxonomyComponent implements OnInit, OnSpinner {
  formGroup: FormGroup | undefined;
  controls: Control[] = [];
  spinner: boolean = false;
  taxonomySetting: TaxonomySetting | undefined;
  metaControls: Control[] = [];
  constructor(protected http: HttpClient,
              protected route: ActivatedRoute,
              protected location: LocationStrategy,
              protected config: ConfigurationService
              ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(map => {
      let id = parseInt(map.get('id') || '0', 10);
      if (id < 1) {
        this.location.back();
        return ;
      }
      this.http.get<TermTaxonomy>(TAXONOMY_SHOW, {params: {id: id}}).subscribe(response => {
        let taxonomies = this.config.taxonomies();
        let taxonomySetting = taxonomies[response.taxonomy];
        if (!taxonomySetting) {
          this.location.back();
          return ;
        }
        this.buildSetting(taxonomySetting, response);
      }, error => {
        this.location.back();
      });
    });
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  private buildSetting(setting: TaxonomySetting, termTaxonomy: TermTaxonomy) {
    if (!setting.visibility.showUi) {
      this.location.back();
      return ;
    }
    let elements: Control[] = [];
    if (setting.labels['nameField']) {
      elements.push({
        label: setting.labels['nameField'], required: true, value: termTaxonomy.name, id: "name", type: 'input', description: setting.labels['nameFieldDescription'],
      });
    }
    if (setting.labels['slugField']) {
      elements.push({
        label: setting.labels['slugField'], id: "slug", type: 'input', value: termTaxonomy.slug, validators: [{key: "pattern", value: "^[a-z0-9]+(?:-[a-z0-9]+)*$"}], description: setting.labels['slugFieldDescription'],
      });
    }
    if (setting.labels['parentField'] && setting.hierarchical) {
      let options: ControlOption[] = [
        {label: "无", value: ''},
      ];
      elements.push({
        label: setting.labels['parentField'], id: "parent", required: false, type: "select", value: termTaxonomy.parent || '', options: options, description: setting.labels['parentFieldDescription'],
      });
      this.http.get<Records<TermTaxonomy>>(TAXONOMIES.replace('{taxonomy}', termTaxonomy.taxonomy)).subscribe(response => {
        response.records.forEach(item => {
          let name = item.name;
          if (item.level != undefined && item.level > 0) {
            name = '--'.repeat(item.level) + item.name;
          }
          options.push({label: name, value: item.id!})
        });
      });
    }
    if (setting.labels['descField']) {
      elements.push({
        label: setting.labels['descField'], id: "desc", type: 'textarea', value: termTaxonomy.description, description: setting.labels['descFieldDescription'], required: false,
      });
    }
    this.formGroup = elements.length ? buildFormGroup(elements) : new FormGroup<any>({});
    this.formGroup.addControl('id', new FormControl<number>(termTaxonomy.id!));
    this.formGroup.addControl('taxonomy', new FormControl<string>(termTaxonomy.taxonomy));
    const metas = this.config.taxonomyMeta(termTaxonomy.taxonomy);
    const metaControls: Control[] = [];
    if (metas.length > 0) {
      metas.forEach(item => {
        if (item.showUi && item.isUpdated && item.control) {
          metaControls.push(item.control);
        }
      });
    }
    this.formGroup.addControl('meta',
      metaControls.length > 0
        ? buildFormGroup(metaControls, termTaxonomy.meta)
        : new FormGroup({})
    );
    this.controls = elements;
    this.metaControls = metaControls;
    this.taxonomySetting = setting;
  }

  get metaGroup() {
    return this.formGroup?.controls['meta'] as FormGroup;
  }

  onSubmit($event: Event) {
    if (this.formGroup?.invalid) {
      return ;
    }
    const data = this.formGroup?.getRawValue();
    this.http.post<TermTaxonomy>(TAXONOMY_UPDATE.replace('{taxonomy}', data.taxonomy), data, {context:new HttpContext().set(SPINNER, this)}).subscribe(response => {
      this.location.back();
    });
  }
}


@Component({
  selector: 'app-taxonomy-actions',
  template: `
    <div class="py-3 text-break fs-6">
      {{value}}
    </div>
    <nb-actions>
      <nb-action class="ps-0" link="/app/taxonomy/{{rowData.taxonomy}}/{{rowData.id}}" title="编辑"
                 icon="edit-2-outline"></nb-action>
      <nb-action (click)="delete()" title="删除" icon="trash-outline"></nb-action>
      <nb-action (click)="convert()" title="迁移" icon="swap-outline"></nb-action>
    </nb-actions>
  `,
  styles: [
    `
      :host {
        nb-actions {
          visibility: hidden;
        }
        &:hover {
          nb-actions {
            visibility: visible;
          }
        }
      }
    `
  ]
})
export class TaxonomyActionsComponent implements OnInit {

  private actionClick: EventEmitter<{action:string, taxonomy: TermTaxonomy}> = new EventEmitter();

  @Input() value!: string;
  @Input() rowData!: TermTaxonomy;
  ngOnInit(): void {
    if (this.rowData.level != undefined && this.rowData.level > 0) {
      this.value = "--".repeat(this.rowData.level) + this.value;
    }
  }

  onClick() {
    return this.actionClick;
  }

  delete() {
    this.actionClick.next({action: 'delete', taxonomy: this.rowData});
  }
  convert() {
    this.actionClick.next({action: 'convert', taxonomy: this.rowData});
  }
}

@Component({
  selector: 'app-taxonomy-convert-dialog',
  template: `
    <nb-card>
      <nb-card-header>
        <strong class="fw-bolder text-danger" *ngIf="this.taxonomy">{{this.taxonomy.name!}}</strong>--正在转换类别
      </nb-card-header>
      <nb-card-body>
        <div class="mb-3 d-flex align-items-center">
          <label class="label col-form-label">选择需要转换的类别: </label>
          <div class="px-2">
            <nb-select fullWidth id="taxonomies" [(ngModel)]="selectedTaxonomy">
              <nb-option *ngFor="let option of options" [value]="option.value">{{option.label}}</nb-option>
            </nb-select>
          </div>
        </div>
      </nb-card-body>
      <nb-card-footer class="d-flex justify-content-between">
        <button nbButton status="basic" (click)="dialogRef.close()">取消</button>
        <button nbButton status="primary" [disabled]="selectedTaxonomy.length < 1" (click)="convert()">转换</button>
      </nb-card-footer>
    </nb-card>
  `,
})
export class ConvertDialogComponent implements OnInit{
  taxonomy: TermTaxonomy | undefined;
  options: any[] = [];
  selectedTaxonomy = '';
  constructor(public dialogRef: NbDialogRef<ConvertDialogComponent>, private config: ConfigurationService) {

  }
  ngOnInit(): void {
    const taxonomySettings = this.config.taxonomies();
    let options = [
      {label: '--选择--', value: ''},
    ];
    for (let taxonomySettingsKey in taxonomySettings) {
      let taxonomy = taxonomySettings[taxonomySettingsKey];
      if (!taxonomy.visibility.showUi) {
        continue;
      }
      if (taxonomy.slug == this.taxonomy?.taxonomy) {
        continue;
      }
      options.push({
        label: taxonomy.label,
        value: taxonomy.slug,
      });
    }
    this.options = options;
  }
  convert() {
    this.dialogRef.close(this.selectedTaxonomy)
  }
}

