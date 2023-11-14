import {Component, EventEmitter, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaxonomySetting, TermTaxonomy} from "../../@core/definition/content/type";
import {HttpClient} from "@angular/common/http";
import {
  TAXONOMIES,
  TAXONOMY_CONVERT,
  TAXONOMY_DELETE,
} from "../../@core/definition/content/api";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {OnSpinner} from "../../@core/definition/common";
import {Cell, ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {NbDialogRef, NbDialogService} from '@nebular/theme';

@Component({
  selector: 'app-taxonomy',
  templateUrl: './taxonomy.component.html',
})
export class TaxonomyComponent implements OnInit, OnSpinner {
  private taxonomy: string = "";
  settings: Settings = {columns: {}};
  source: ServerDataSource | undefined;
  spinner: boolean = false;
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
        return;
      }
      if (!taxonomies[taxonomy].visibility.showUi) {
        return;
      }
      this.taxonomy = taxonomy;
      const taxonomySetting = taxonomies[taxonomy] || {};
      if (!taxonomySetting.visibility.showUi) {
        return;
      }
      this.taxonomySetting = taxonomySetting;
      this.buildSetting();
    });
  }


  private delete(taxonomy: TermTaxonomy) {
    this.deleteTaxonomy([taxonomy.id!], "确认删除类目: " + taxonomy.name + "?")
  }

  private buildSetting() {
    this.settings = this.buildSettings();
    this.source = new ServerDataSource(this.http, {
      endPoint: TAXONOMIES.replace('{taxonomy}', this.taxonomy),
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
          type: 'custom',
          isFilterable: true,
          renderComponent: TaxonomyActionsComponent,
          componentInitFunction: (component: TaxonomyActionsComponent, cell: Cell) => {
            component.value = cell.getValue();
            component.rowData = cell.getRow().getData();
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
          type: 'text',
          isFilterable: true,
          isSortable: false
        },
        description: {
          title: '内容描述',
          type: 'text',
          isFilterable: false,
          isSortable: false
        },
        count: {
          title: '总数',
          type: 'text',
          isFilterable: false,
        }
      }
    }
  }

  batch() {
    const id = this.source?.getSelectedItems().map((item) => {
      return item.id;
    });
    if (id === undefined || id.length < 1) {
      return;
    }
    switch (this.batchMode) {
      case 'delete':
        this.deleteTaxonomy(id, "确认删除已选择的类目?");
        break;
    }
  }

  private deleteTaxonomy(id: number[], message: string) {
    if (window.confirm(message)) {
      this.http.post(TAXONOMY_DELETE.replace('{taxonomy}', this.taxonomy), {sets: id}).subscribe(() => {
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

