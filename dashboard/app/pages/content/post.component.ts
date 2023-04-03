import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {
  POST_DELETE,
  POST_STATISTICS,
  POST_TRASH,
  POST_TYPE_SETTING, POST_UNDO,
  POSTS,
  TAXONOMIES
} from "../../@core/definition/content/api";
import {User} from "../../@core/definition/user/type";
import {ActivatedRoute, Router} from "@angular/router";
import {ReplaySubject, Subject} from "rxjs";
import {IColumnType, ServerDataSource} from "angular2-smart-table";
import {IColumn, Settings} from "angular2-smart-table/lib/lib/settings";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DeleteEvent} from "angular2-smart-table/lib/lib/events";
import {Post, PostTypeSetting, TaxonomySetting, TermTaxonomy} from "../../@core/definition/content/type";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {FormControl} from "@angular/forms";
import {OnSpinner, Records} from "../../@core/definition/common";

@Component({
  selector: 'app-post',
  template: `
    <nb-card>
      <nb-card-header class="d-flex justify-content-between align-items-center">
        <span>{{typeSetting.label}}</span>
        <a [routerLink]="'/app/content/post-new/' + type" size="small" nbButton status="primary"><nb-icon icon="plus-outline"></nb-icon></a>
      </nb-card-header>
      <nb-card-body>
        <nb-radio-group [formControl]="filterControls['status']" class="d-flex flex-row mb-2">
          <nb-radio *ngFor="let radio of radios" [value]="radio.value">{{radio.label}}</nb-radio>
        </nb-radio-group>
        <div class="mb-2 row">
          <form class="col-auto d-flex" (ngSubmit)="batch()">
            <nb-select name="batchMode" fullWidth [(ngModel)]="batchMode">
              <nb-option [value]="option.value" *ngFor="let option of batches">{{option.label}}</nb-option>
            </nb-select>
            <div class="ms-3">
              <button nbButton status="primary" [disabled]="!batchMode || spinner" [nbSpinner]="spinner" type="submit">应用</button>
            </div>
          </form>
          <form class="col-auto d-flex">
            <div class="ms-3">
              <nb-select fullWidth [formControl]="filterControls['date']">
                <nb-option [value]="''">全部日期</nb-option>
                <nb-option [value]="option.value" *ngFor="let option of dateFilters">{{option.label}}</nb-option>
              </nb-select>
            </div>
            <div class="ms-3" *ngFor="let taxonomyFilter of taxonomyFilters">
              <nb-select fullWidth [formControl]="filterControls[taxonomyFilter.slug]">
                <nb-option [value]="''">全部{{taxonomyFilter.label}}</nb-option>
                <nb-option [value]="option.id" *ngFor="let option of taxonomyFilter.options">{{option.name}}</nb-option>
              </nb-select>
            </div>
          </form>
        </div>
        <angular2-smart-table
          [settings]="settings"
          [source]="source">
        </angular2-smart-table>
      </nb-card-body>
    </nb-card>
  `
})
export class PostComponent implements OnInit, OnSpinner {
  protected typeChange$: ReplaySubject<string> = new ReplaySubject<string>(1);
  type: string = 'post';
  source: ServerDataSource | undefined;
  settings: Partial<Settings> = {};
  batches = [
    {'label': '批量操作', 'value': ''},
    {'label': '移至回收站', 'value': 'trash'},
  ];
  batchMode: string = '';
  typeSetting: Partial<PostTypeSetting> = {};
  radios = [
    {label: `全部`, value: ''},
    {label: `已发布`, value: 'publish'},
    {label: `草稿`, value: 'draft'},
    {label: `回收站`, value: 'trash'},
  ];
  filterControls: Record<string, FormControl> = {
    status: new FormControl<string>(''),
    date: new FormControl<string>(''),
  };
  spinner: boolean = false;
  taxonomyFilters: {label: string, slug: string, options: TermTaxonomy[]}[] = [];
  dateFilters: {label: string, value: string}[] = [];
  private condition: {[key: string]: string|number} = {
    type: this.type,
    status: this.filterControls.status.value || '',
    author: '' ,
    taxonomy: '',
    date: '',
  };

  private $conditionChangeSourceRefresh = new Subject<Record<any, number | string>>();

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected http: HttpClient,
              protected config: ConfigurationService
              ) {
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  ngOnInit(): void {
    const postTypes = this.config.postTypes();
    this.typeChange$.subscribe(type => {
      if (type === 'nav_menu_item') {
        this.router.navigateByUrl('/app/decoration/navigation').then();
        return ;
      }
      if (!Object.keys(postTypes).includes(type)) {
        this.router.navigateByUrl('/404').then();
        return ;
      }
      this.typeSetting = postTypes[type];
      if (!this.typeSetting.visibility!.showUi) {
        return ;
      }
      this.type = type;
      this.condition.type = type;
      this.settings = this.buildSettings();
      this.buildSource();
    });
    this.filterControls.status.valueChanges.subscribe(value => {
      if (value === 'trash') {
        this.batches = [this.batches[0],
          {'label': '还原', 'value': 'undo'},
          {'label': '永久删除', 'value': 'delete'},
        ];
      } else {
        this.batches = [this.batches[0], {'label': '移至回收站', 'value': 'trash'}];
      }
      this.$conditionChangeSourceRefresh.next({status: value || ''});
    });
    this.filterControls.date.valueChanges.subscribe(value => {
      this.$conditionChangeSourceRefresh.next({date: value || ''});
    });
    this.route.paramMap.subscribe(map => {
      let type = map.get('type');
      if (!type) {
        type = 'post';
      }
      this.typeChange$.next(type);
    });
    this.$conditionChangeSourceRefresh.subscribe(conditionMap => {
      this.condition = Object.assign(this.condition, conditionMap);
      this.buildSource();
    });
  }

  batch() {
    let idSets = this.source?.getSelectedItems().map(item => item.id);
    console.log(idSets);
    if (!idSets || idSets.length < 1) {
      return ;
    }
    this.executeAction(this.batchMode, idSets, undefined);
  }

  private executeAction(action: string, id: number[], title: string | undefined) {
    switch (action) {
      case 'trash':
        let tMessage = title ? '确认将: ' + title + ' 移至回收站?'
          : '确认将已选择的' + this.typeSetting.label + '移至回收站?';
        if (window.confirm(tMessage)) {
          this.http.post(POST_TRASH, {sets: id}).subscribe();
        }
        break;
      case 'delete':
        let dMessage = title ? '确认删除: ' + title + '?'
          : '确认删除已选择的' + this.typeSetting.label + '?';
        if (window.confirm(dMessage)) {
          this.http.post(POST_DELETE, {sets: id}).subscribe();
        }
        break;
      case 'undo':
        let message = title ? '确认还原: ' + title + '?'
          : '确认还原已选择的' + this.typeSetting.label + '?';
        if (window.confirm(message)) {
          this.http.post(POST_UNDO, {sets: id}).subscribe();
        }
        break;
    }
  }

  private buildSource() {
    const httpParams = new HttpParams({fromObject: this.condition});
    this.http.get<Record<string, any>>(POST_STATISTICS + '?' + httpParams.toString()).subscribe(response => {
      this.radios[0].label = response.all > 0 ? `全部 (${response.all})` : `全部`;
      this.radios[1].label = response.publish > 0 ? `已发布 (${response.publish})` : `已发布`;
      this.radios[2].label = response.draft > 0 ? `草稿 (${response.draft})` : `草稿`;
      this.radios[3].label = response.trash > 0 ? `回收站  (${response.trash})` : `回收站`;
      this.dateFilters = response.yearMonths;
    });
    this.source = new ServerDataSource(this.http, {
      endPoint: POSTS + `?` + httpParams.toString(),
      dataKey: 'records',
      totalKey: 'total',
      pagerPageKey: 'page',
      pagerLimitKey: 'limit',
      filterFieldKey: '#field#',
    });
  }

  private buildSettings(): Settings {

    const defaultColumns = {
      title: {
        title: '标题',
        type: IColumnType.Custom,
        filter: true,
        renderComponent: PostActionsComponent,
        onComponentInitFunction: (component: PostActionsComponent) => {
          component.onClick().subscribe(action => {
            this.executeAction(action.action, [action.id], component.rowData.title)
          });
        },
        isSortable: false,
      },
      author: {
        title: '作者',
        type: IColumnType.Custom,
        filter: false,
        renderComponent: PostAuthorComponent,
        onComponentInitFunction: (component: PostAuthorComponent) => {
          component.onClick().subscribe(author => {
            this.$conditionChangeSourceRefresh.next({author: author});
          });
        },
        width: '10%',
        isSortable: false,
      },
    };

    const dynamicColumns: Record<string, IColumn> = {};
    const taxonomies = this.config.taxonomies();
    this.taxonomyFilters = [];
    for (let slug in taxonomies) {
      if (!taxonomies[slug].types.includes(this.type)) {
        continue;
      }
      if (this.typeSetting.visibility?.showTableTaxonomy) {
        dynamicColumns[slug] = {
          title: taxonomies[slug].label,
          type: IColumnType.Custom,
          renderComponent: PostTaxonomyComponent,
          onComponentInitFunction: (component: PostTaxonomyComponent) => {
            component.taxonomy = slug;
            component.onClick().subscribe(selectedTaxonomy => {
              if (this.filterControls.hasOwnProperty(selectedTaxonomy.taxonomy)) {
                this.filterControls[selectedTaxonomy.taxonomy].setValue(selectedTaxonomy.id);
              } else {
                this.$conditionChangeSourceRefresh.next({taxonomy: selectedTaxonomy.id});
              }
            });
          },
          filter: false,
          width: '15%',
          isSortable: false,
        };
      }
      if (taxonomies[slug].visibility.showPostFilter) {
        this.addTaxonomyFilter(taxonomies[slug]);
      }
    }

    const columns = Object.assign(defaultColumns, dynamicColumns, {
      modifiedAt: {
        title: '日期',
        type: IColumnType.Html,
        filter: false,
        width: '15%',
        valuePrepareFunction: (time: string, post: Post) => {
          return "最后修改<br/>" + time;
        }
      }
    });
    return {
      selectMode: 'multi',
      actions: {
        position: 'right',
        add: false,
        edit: false,
        delete: false,
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
      columns: columns,
    }
  }

  private addTaxonomyFilter(taxonomy: TaxonomySetting) {
    this.http.get<Records<TermTaxonomy>>(TAXONOMIES, {params: {taxonomy: taxonomy.slug}}).subscribe(response => {
      this.taxonomyFilters.push({
        slug: taxonomy.slug,
        label: taxonomy.label,
        options: response.records,
      });
    });
    if (!this.filterControls.hasOwnProperty(taxonomy.slug)) {
      this.filterControls[taxonomy.slug] = new FormControl('');
      this.filterControls[taxonomy.slug].valueChanges.subscribe(value => {
        this.$conditionChangeSourceRefresh.next({taxonomy: value})
      });
    }
  }
}


@Component({
  selector: 'app-edit-post',
  template: `
    <edit-post></edit-post>
  `,
  styles: [],
})
export class EditPostComponent {
}


@Component({
  selector: 'app-post-action',
  template: `
    <div class="py-3 text-break fs-6">
      <strong>
        <a [routerLink]="'/app/content/edit-post/'+rowData.id">{{value}}</a>
        <ng-container *ngIf="rowData.status === 'draft'"> - <span>草稿</span></ng-container>
      </strong>
    </div>
    <nb-actions>
      <nb-action [class.ps-0]="i==0" [link]="action.value == 'edit'?'/app/content/edit-post/'+rowData.id:''" [title]="action.title"
                 (click)="click(action.value)"
                 [icon]="action.icon"
                 *ngFor="let action of actions;  index as i"></nb-action>
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
export class PostActionsComponent {
  private actionClick: EventEmitter<{action:string, id: number}> = new EventEmitter();

  @Input() value!: string;
  @Input() rowData: any;

  actions: {title: string, icon: string, value: string}[] = [];

  constructor(protected http: HttpClient) {
  }

  ngOnInit(): void {
    if (this.rowData.status === 'trash') {
      this.actions.push(
        {title: '还原', icon: 'undo-outline', value: 'undo'},
        {title: '永久删除', icon: 'trash-outline', value: 'delete'}
      );
    } else {
      this.actions.push(
        {title: '编辑', icon: 'edit-2-outline', value: 'edit'},
        {title: '移至回收站', icon: 'trash-2-outline', value: 'trash'}
      );
    }
  }

  onClick() {
    return this.actionClick;
  }

  click(action: string) {
    if (action === 'edit') {
      return false;
    }
    this.actionClick.emit({
      action: action,
      id: this.rowData.id
    })
    return false;
  }

}

@Component({
  selector: 'app-post-taxonomy',
  template: `
    <div class="py-3 text-break">
      <ng-container *ngIf="termTaxonomies.length > 0">
        <ng-container *ngFor="let t of termTaxonomies;let last = last">
          <a  href="javascript:;" (click)="click(t.id!)">{{t.name}}</a>
          <a *ngIf="!last">、</a>
        </ng-container>
      </ng-container>
      <ng-container *ngIf="termTaxonomies.length < 1">-</ng-container>
    </div>
  `,
})
export class PostTaxonomyComponent implements OnInit {
  private actionClick: EventEmitter<{taxonomy: string, id: number}> = new EventEmitter();

  @Input() value!: string;
  @Input() rowData: Post | undefined;
  @Input() taxonomy: string = '';

  actions: {title: string, icon: string, value: string}[] = [];

  termTaxonomies: TermTaxonomy[] = [];

  constructor(protected http: HttpClient) {
  }

  ngOnInit(): void {
    if (this.rowData) {
      this.termTaxonomies = this.rowData.relationships.filter(item => item.taxonomy == this.taxonomy);
    }
  }

  onClick() {
    return this.actionClick;
  }

  click(id: number) {
    this.actionClick.next({taxonomy: this.taxonomy, id: id});
  }

}

@Component({
  selector: 'app-post-author',
  template: `
    <div class="py-3 text-break">
        <a href="javascript:;" (click)="click($event)">{{value.account}}</a>
    </div>

  `,
})
export class PostAuthorComponent implements OnInit {
  private actionClick: EventEmitter<number> = new EventEmitter();

  @Input() value!: User;
  @Input() rowData: Post | undefined;

  ngOnInit(): void {
  }

  onClick() {
    return this.actionClick;
  }

  click($event: Event) {
    this.actionClick.next(this.value.id);
  }

}
