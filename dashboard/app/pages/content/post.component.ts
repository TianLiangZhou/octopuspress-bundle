import {AfterViewInit, Component, EventEmitter, Input, OnInit} from '@angular/core';
import {
  POST_DELETE, POST_SHOW,
  POST_STATISTICS,
  POST_TRASH,
  POST_UNDO,
  POSTS,
  TAXONOMIES
} from "../../@core/definition/content/api";
import {User} from "../../@core/definition/user/type";
import {ActivatedRoute, Router} from "@angular/router";
import {
  combineLatest,
  from,
  ReplaySubject,
  Subject,
  timer,
} from "rxjs";
import {IColumnType, ServerDataSource} from "angular2-smart-table";
import {IColumn, Settings} from "angular2-smart-table/lib/lib/settings";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Post, PostTypeSetting, TaxonomySetting, TermTaxonomy} from "../../@core/definition/content/type";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {FormControl, FormGroup} from "@angular/forms";
import {OnSpinner, PostEntity, Records} from "../../@core/definition/common";
import {distinctUntilChanged, map, switchMap} from "rxjs/operators";
import {NbSidebarService} from "@nebular/theme";
import {ht} from "date-fns/locale";

@Component({
  selector: 'app-post',
  template: `
    <nb-card>
      <nb-card-header class="d-flex justify-content-between align-items-center">
        <span>{{typeSetting.label}}<span *ngIf="parent"> - {{parent.title}}</span></span>
        <a [routerLink]="'/app/content/post-new/' + type" queryParamsHandling="merge" size="small" nbButton status="primary"><nb-icon icon="plus-outline"></nb-icon></a>
      </nb-card-header>
      <nb-card-body>
        <div class="mb-2">
          <ng-container *ngFor="let link of radios">
            <a class="mx-2 bg-transparent border-0 ps-0" [class]="{'fs-6': link.value == status, 'text-primary': link.value == status}"
               nbButton
               style="color: var(--text-basic-color)"
               [routerLink]="['./']" [queryParams]="{status: link.value}" queryParamsHandling="merge"
            >{{link.label}}</a>
          </ng-container>
        </div>
        <div class="mb-2 row">
          <form class="col-auto d-flex" (ngSubmit)="batch()">
            <nb-select name="batchMode" fullWidth [(ngModel)]="batchMode">
              <nb-option [value]="option.value" *ngFor="let option of batches">{{option.label}}</nb-option>
            </nb-select>
            <div class="ms-3">
              <button nbButton status="primary" [disabled]="!batchMode || spinner" [nbSpinner]="spinner" type="submit">应用</button>
            </div>
          </form>
          <form class="col-auto d-flex flex-column flex-sm-row">
            <div class="ms-sm-3 mt-3 mt-sm-0">
              <nb-select fullWidth [formControl]="getControl('date')">
                <nb-option [value]="''">全部日期</nb-option>
                <nb-option [value]="option.value" *ngFor="let option of dateFilters">{{option.label}}</nb-option>
              </nb-select>
            </div>
            <div class="ms-sm-3 mt-3 mt-sm-0">
              <nb-select fullWidth [formControl]="getControl('author')">
                <nb-option [value]="''">全部作者</nb-option>
                <nb-option [value]="option.value" *ngFor="let option of authorFilters!">{{option.label}}</nb-option>
              </nb-select>
            </div>
            <ng-container *ngFor="let taxonomyFilter of taxonomyFilters">
              <div class="ms-sm-3 mt-3 mt-sm-0" *ngIf="!taxonomyFilter.hidden">
                <nb-select fullWidth [formControl]="getControl(taxonomyFilter.slug)">
                  <nb-option [value]="''">全部{{taxonomyFilter.label}}</nb-option>
                  <nb-option [value]="option.id" *ngFor="let option of taxonomyFilter.options">{{option.name}}</nb-option>
                </nb-select>
              </div>
            </ng-container>
            <div class="ms-sm-3 mt-3 mt-sm-0">
              <a status="primary" nbButton [routerLink]="['./']" [queryParams]="filterControls.getRawValue()" queryParamsHandling="merge">筛选</a>
            </div>
          </form>
        </div>
        <angular2-smart-table
          [settings]="tableTypeSettings[type]"
          [source]="source">
        </angular2-smart-table>
      </nb-card-body>
    </nb-card>
  `
})
export class PostComponent implements OnInit, OnSpinner, AfterViewInit {
  protected typeChange$: ReplaySubject<string> = new ReplaySubject<string>(1);
  type: string = 'post';
  source: ServerDataSource | undefined = undefined;
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
  filterControls = new FormGroup<any>({
    status: new FormControl<string>(''),
    date: new FormControl<string>(''),
    author: new FormControl<number|string>(''),
  });
  spinner: boolean = false;
  taxonomyFilters: {label: string, slug: string, hidden: boolean, options: TermTaxonomy[]}[] = [];
  private authorMap: Map<number, true> = new Map();
  authorFilters: {label: string, value: number}[] = [];
  dateFilters: {label: string, value: string}[] = [];
  parent: Post | null = null;
  tableTypeSettings: Record<string, Settings> = {};
  private $conditionChangeSourceRefresh = new ReplaySubject<Record<string, any>>(1);
  private $parentChangeSourceRefresh = new Subject<number>();

  constructor(protected router: Router,
              protected route: ActivatedRoute,
              protected http: HttpClient,
              protected config: ConfigurationService,
              protected sidebar: NbSidebarService,
              ) {
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(_ => {
      this.sidebar.getSidebarState('menu-sidebar').subscribe(state => {
        if (state !== 'collapsed') {
          this.sidebar.collapse('menu-sidebar');
        }
      });
    });
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  get status() {
    return this.filterControls.controls.status.value;
  }

  ngOnInit(): void {
    const postTypes = this.config.postTypes();
    this.$conditionChangeSourceRefresh.pipe(
      distinctUntilChanged(),
      switchMap(wheres => {
        let httpParams = new HttpParams({fromObject:wheres});
        return combineLatest([
          from([httpParams]),
          this.http.get<Record<string, any>>(POST_STATISTICS, {params: httpParams}),
        ]);
      })
    )
    .subscribe(([httpParams, stats]) => {
      this.radios[0].label = stats.all > 0 ? `全部 (${stats.all})` : `全部`;
      this.radios[1].label = stats.publish > 0 ? `已发布 (${stats.publish})` : `已发布`;
      this.radios[2].label = stats.draft > 0 ? `草稿 (${stats.draft})` : `草稿`;
      this.radios[3].label = stats.trash > 0 ? `回收站  (${stats.trash})` : `回收站`;
      this.dateFilters = stats.yearMonths;
      this.source = new ServerDataSource(this.http, {
        endPoint: POSTS + `?` + httpParams.toString(),
        dataKey: 'records',
        totalKey: 'total',
        pagerPageKey: 'page',
        pagerLimitKey: 'limit',
        filterFieldKey: '#field#',
      });
      this.source.onChanged().subscribe(item => {
        let options :{label: string, value: number}[] = [];
        if (item.elements) {
          item.elements.forEach((row: Post, index: number) => {
            if (row.author && row.author.id < 1) {
              return
            }
            let id = row.author?.id ?? 0;
            if (this.authorMap.has(id)) {
              return ;
            }
            this.authorMap.set(id, true);
            options.push({label: row.author?.nickname ?? '', value: id});
          });
        }
        if (options.length > 0) {
          this.authorFilters.push(...options);
        }
        if (httpParams.get('author')) {
          timer(100).subscribe(() => {
            this.filterControls.controls.author.setValue(parseInt(httpParams.get('author') ?? '', 10));
          });
        }
      });
    });
    this.$parentChangeSourceRefresh.pipe(
      switchMap(parent => {
        return this.http.get<PostEntity>(POST_SHOW, {params: {id: parent}});
      })
    ).subscribe(parent => {
      this.parent = parent;
    });
    combineLatest([this.route.params.pipe(distinctUntilChanged()), this.route.queryParams.pipe(distinctUntilChanged())])
      .pipe(
        map(([p, query]) => ({...p, ...query}))
      )
      .subscribe(maps => {
        const type = maps['type'] || 'post';
        if (type === 'nav_menu_item') {
          this.router.navigateByUrl('/app/decoration/navigation').then();
          return ;
        }
        if (!Object.keys(postTypes).includes(type)) {
          this.router.navigateByUrl('/404').then();
          return ;
        }
        if (this.type !== type || !this.typeSetting.hasOwnProperty('label')) {
          this.type = type;
          this.typeSetting = postTypes[type];
          if (!this.typeSetting.visibility!.showUi) {
            return;
          }
        }
        if (this.tableTypeSettings[type] === undefined) {
          this.tableTypeSettings[type] = this.buildSettings();
        }
        if (!maps.hasOwnProperty('status')) {
          maps['status'] = '';
        }
        let parent = parseInt(maps['parent'], 10);
        if (parent > 0) {
          this.$parentChangeSourceRefresh.next(parent);
        } else if (this.parent) {
          this.parent = null;
        }
        if ((maps['status'] ?? '') != this.filterControls.controls.status.value) {
          this.filterControls.controls.status.setValue(maps['status'] ?? '');
        }
        this.$conditionChangeSourceRefresh.next(maps);
      });
    this.filterControls.controls.status.valueChanges.subscribe(value => {
      if (value === 'trash') {
        this.batches = [this.batches[0],
          {'label': '还原', 'value': 'undo'},
          {'label': '永久删除', 'value': 'delete'},
        ];
      } else {
        this.batches = [this.batches[0], {'label': '移至回收站', 'value': 'trash'}];
      }
    });
  }

  batch() {
    let idSets = this.source?.getSelectedItems().map(item => item.id);
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

  private buildSettings(): Settings {

    const defaultColumns: Record<string, IColumn> = {
      title: {
        title: '标题',
        type: IColumnType.Custom,
        filter: true,
        renderComponent: PostActionsComponent,
        onComponentInitFunction: (component: PostActionsComponent) => {
          component.setTypes(this.type, this.config.postTypes());
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
        width: '10%',
        isSortable: false,
      },
    };

    const dynamicColumns: Record<string, IColumn> = {};
    const taxonomies = this.config.taxonomies();
    for (let slug in taxonomies) {
      let exist = taxonomies[slug].types.includes(this.type);
      this.taxonomyFilters.forEach(item => {
        if (item.slug === slug) {
          item.hidden = !exist;
        }
      });
      if (!exist) {
        continue;
      }
      if (taxonomies[slug].visibility.showPostTable[this.type]) {
        dynamicColumns[slug] = {
          title: taxonomies[slug].label,
          type: IColumnType.Custom,
          renderComponent: PostTaxonomyComponent,
          onComponentInitFunction: (component: PostTaxonomyComponent) => {
            component.taxonomy = slug;
          },
          filter: false,
          width: '15%',
          isSortable: false,
        };
      }
      if (taxonomies[slug].visibility.showPostFilter[this.type]) {
        if (!this.filterControls.hasOwnProperty(slug)) {
          this.addTaxonomyFilter(taxonomies[slug]);
        }
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

  public getControl(name: string)
  {
    return this.filterControls.controls[name] as FormControl;
  }

  private addTaxonomyFilter(taxonomy: TaxonomySetting) {
    this.http.get<Records<TermTaxonomy>>(TAXONOMIES, {params: {taxonomy: taxonomy.slug}}).subscribe(response => {
      this.taxonomyFilters.push({
        slug: taxonomy.slug,
        label: taxonomy.label,
        hidden: false,
        options: response.records,
      });
    });
    this.filterControls.addControl(taxonomy.slug, new FormControl('', {}));
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
    <div id="actions" class="d-flex flex-row">
      <a class="px-2" (click)="click(action.value)" [class.ps-0]="i == 0" [routerLink]="action.link" [queryParams]="action.query" queryParamsHandling="merge" *ngFor="let action of actions;  index as i">{{action.title}}</a>
    </div>
  `,
  styles: [
    `
      :host {
        #actions {
          visibility: hidden;
        }
        &:hover {
          #actions {
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

  actions: {title: string, icon: string, value: string, link?:string, query?: Record<string, any>}[] = [];
  private type: string = 'post';
  private postTypes: Record<string, PostTypeSetting> = {};

  constructor(protected http: HttpClient) {
  }

  ngOnInit(): void {
    let actions = [];

    let typeSetting = this.postTypes[this.type];
    if (this.rowData.status === 'trash') {
      actions = [
        {title: '还原', icon: 'undo-outline', value: 'undo'},
        {title: '永久删除', icon: 'trash-outline', value: 'delete'}
      ];
    } else {
      actions.push({title: '编辑', icon: 'edit-2-outline', value: 'edit', link: '/app/content/edit-post/'+this.rowData.id});
      if (typeSetting && typeSetting.children && typeSetting.children.length > 0) {
        typeSetting.children.forEach(child => {
          let childTypeSetting = this.postTypes[child];
          actions.push({title: '子集'+(childTypeSetting.label ?? ''), icon: 'layers-outline', value: 'children', query:{parent:this.rowData.id}, link: '/app/content/' + child });
          actions.push({title: '添加子集'+(childTypeSetting.label ?? ''), icon: 'plus-outline', value: 'children', query:{parent:this.rowData.id}, link: '/app/content/post-new/'+child});
        });
      }
      actions.push({title: '移至回收站', icon: 'trash-2-outline', value: 'trash'});
    }
    this.actions = actions;
  }

  onClick() {
    return this.actionClick;
  }

  click(action: string) {
    if (action !== 'trash') {
      return true;
    }
    this.actionClick.emit({
      action: action,
      id: this.rowData.id
    })
    return false;
  }

  setTypes(type: string, types: Record<string, PostTypeSetting>) {
    this.type = type;
    this.postTypes = types;
  }

}

@Component({
  selector: 'app-post-taxonomy',
  template: `
    <div class="py-3 text-break">
      <ng-container *ngIf="termTaxonomies.length > 0">
        <ng-container *ngFor="let t of termTaxonomies;let last = last;">
          <a [routerLink]="['./']" [queryParams]="getParams(t)">{{t.name}}</a>
          <a *ngIf="!last">、</a>
        </ng-container>
      </ng-container>
      <ng-container *ngIf="termTaxonomies.length < 1">-</ng-container>
    </div>
  `,
})
export class PostTaxonomyComponent implements OnInit {
  @Input() value!: string;
  @Input() rowData: Post | undefined;
  @Input() taxonomy: string = '';

  termTaxonomies: TermTaxonomy[] = [];

  ngOnInit(): void {
    if (this.rowData) {
      this.termTaxonomies = this.rowData.relationships.filter(item => item.taxonomy == this.taxonomy);
    }
  }

  getParams(t: TermTaxonomy) {
    let obj: Record<string, number> = {};
    obj[t.taxonomy] = t.id || 0;
    return obj;
  }
}

@Component({
  selector: 'app-post-author',
  template: `
    <div class="py-3 text-break">
      <a [routerLink]="['./']" [queryParams]="{author: this.value.id}" queryParamsHandling="merge">{{value.account}}</a>
      <span>({{value.nickname}})</span>
    </div>

  `,
})
export class PostAuthorComponent implements OnInit {
  @Input() value!: User;
  @Input() rowData: Post | undefined;

  ngOnInit(): void {
  }
}
