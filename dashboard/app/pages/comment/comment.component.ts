import {Component, EventEmitter, Input, OnInit} from '@angular/core';
import {HttpClient, HttpContext, HttpParams} from "@angular/common/http";
import {EditEvent} from "angular2-smart-table/lib/lib/events";
import {Cell, ServerDataSource} from "angular2-smart-table";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {FormControl, NgForm} from "@angular/forms";
import {ActivatedRoute, ActivatedRouteSnapshot, Params} from "@angular/router";
import {LocationStrategy} from "@angular/common";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {OnSpinner} from "../../@core/definition/common";
import {SPINNER} from "../../@core/interceptor/authorization";
import {Post} from "../../@core/definition/content/type";

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  standalone: false,
})
export class CommentComponent implements OnInit, OnSpinner {
  source!: ServerDataSource;
  radioFilter = new FormControl('all');
  radios: {label: string, value: string}[] = [];

  settings: Settings = {
    columns: {},
  };
  batches = [
    {'label': '批量操作', 'value': ''},
    {'label': '驳回', 'value': 'unapproved'},
    {'label': '批准', 'value': 'approved'},
    {'label': '标记为垃圾', 'value': 'spam'},
    {'label': '移至回收站', 'value': 'trash'},
  ];
  batchMode: string = '';

  route: ActivatedRouteSnapshot;
  spinner: boolean = false;

  constructor(private http: HttpClient,
              protected activatedRoute: ActivatedRoute,
              protected configService: ConfigurationService) {

    this.route = activatedRoute.snapshot;
  }
  ngOnInit(): void {
    this.settings = this.buildSettings();
    this.activatedRoute.queryParams.subscribe((queryMap: Params) => {
      let params = Object.assign({'status': this.radioFilter.value}, queryMap);
      this.radioFilter.setValue(params['status']);
      this.loadSource(params);
    });
  }

  private loadSource(params: Record<string, any>) {
    let httpParams = new HttpParams({fromObject: params});
    this.http.get<Record<string, number>>('/comment/statistics', {params: httpParams}).subscribe((data: Record<string, number>) => {
      this.radios = [
        {label: `全部 (${data.all})`, value: 'all'},
        {label: `我的 (${data.my})`, value: 'my'},
        {label: `待审 (${data.unapproved})`, value: 'unapproved'},
        {label: `已批准 (${data.approved})`, value: 'approved'},
        {label: `垃圾 (${data.spam})`, value: 'spam'},
        {label: `回收站 (${data.trash})`, value: 'trash'},
      ];
    });
    this.source = new ServerDataSource(this.http, {
      endPoint: '/comment?'+httpParams.toString(),
      dataKey: 'records',
      totalKey: 'total',
      pagerPageKey: 'page',
      pagerLimitKey: 'limit',
      filterFieldKey: '#field#',
    });
  }

  edit($event: EditEvent) {

  }

  batch() {
    if (this.batchMode == '') {
      return ;
    }
    const idSets: number[] = [];
    this.source.getSelectedItems().forEach(item => {
      idSets.push(item.id);
    })
    if (idSets.length < 1) {
      return ;
    }
    this.updateStatus(this.batchMode, idSets)
  }

  private updateStatus(action: string, idSets: number[]) {
    this.http.post('/comment/' + action, {'id':idSets,}, {context:new HttpContext().set(SPINNER, this)}).subscribe(() => {
      this.loadSource(this.activatedRoute.snapshot.queryParams);
    });
  }

  private buildSettings(): Settings {
    return  {
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
      columns: {
        author: {
          title: "作者",
          isFilterable: false,
        },
        content: {
          title: "评论",
          isFilterable: true,
          type: 'custom',
          renderComponent: CommentContentComponent,
          componentInitFunction: (component: CommentContentComponent, cell: Cell) => {
            component.value = cell.getValue();
            component.rowData = cell.getRow().getData();
            component.onClick().subscribe(data => {
              this.updateStatus(data.action, [data.id]);
            });
          }
        },
        post: {
          title: "回复至",
          type: 'custom',
          renderComponent: CommentPostComponent,
          componentInitFunction: CommentPostComponent.initComponent,
          isFilterable: false,
        },
        createdAt: {
          title: "评论于",
          isFilterable: false,
        }
      }
    };

  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }
}

@Component({
  selector: 'app-comment-actions',
  template: `
    <div class="py-3">{{value}}</div>
    <div id="actions">
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
  ],
  standalone: false,
})
export class CommentContentComponent implements OnInit {

  private actionClick: EventEmitter<{action:string, id: number}> = new EventEmitter();

  @Input() value!: string;
  @Input() rowData: any;

  actions: {title: string, icon: string, value: string, query?: Record<string, any>, link?: string}[] = [];

  constructor(protected http: HttpClient) {
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

  ngOnInit(): void {
    const approved = this.rowData.approved;
    const actions:{title: string, icon: string, value: string}[] = [];
    switch (approved) {
      case "approved":
        actions.push(
          {title: '驳回', icon: 'slash-outline', value: 'unapproved'},
          {title: '编辑', icon: 'edit-2-outline', value: 'edit'},
          {title: '标记为垃圾', icon: 'bookmark-outline', value: 'spam'},
          {title: '移至回收站', icon: 'trash-2-outline', value: 'trash'},
        );
        break;
      case "unapproved":
        actions.push(
          {title: '批准', icon: 'checkmark-circle-outline', value: 'approved'},
          {title: '编辑', icon: 'edit-2-outline', value: 'edit'},
          {title: '标记为垃圾', icon: 'bookmark-outline', value: 'spam'},
          {title: '移至回收站', icon: 'trash-2-outline', value: 'trash'},
        );
        break;
      case "spam":
        actions.push(
          {title: '不是垃圾评论', icon: 'undo-outline', value: 'unapproved'},
          {title: '永久删除', icon: 'trash-outline', value: 'delete'},
        );
        break;
      case "trash":
        actions.push(
          {title: '标记为垃圾', icon: 'bookmark-outline', value: 'spam'},
          {title: '还原', icon: 'undo-outline', value: 'unapproved'},
          {title: '永久删除', icon: 'trash-outline', value: 'delete'},
        );
        break;
    }
    this.actions = actions;
  }
}

@Component({
  selector: 'app-comment-edit',
  template: `
    <form class="row" #f="ngForm" (ngSubmit)="onSubmit(f)">
      <div class="col-9">
        <nb-card>
          <nb-card-body>
            <div class="mb-3">
              <label class="label form-label">作者显示名称:</label>
              <input nbInput fullWidth name="author" [(ngModel)]="comment.author" status="primary" />
            </div>
            <div class="mb-3">
              <label class="label form-label">作者电子邮箱地址:</label>
              <input nbInput fullWidth name="email" type="email" [(ngModel)]="comment.email" status="primary" />
            </div>
            <div class="mb-3">
              <label class="label form-label">作者URL:</label>
              <input nbInput fullWidth name="url" type="url" [(ngModel)]="comment.url" status="primary" />
            </div>
            <div class="mb-3">
              <label class="label form-label">评论:</label>
              <textarea nbInput fullWidth name="content" [(ngModel)]="comment.content" rows="5" status="primary"></textarea>
            </div>
          </nb-card-body>
        </nb-card>
      </div>
      <div class="col-3">
        <nb-card>
          <nb-card-header>保存</nb-card-header>
          <nb-card-body>
            <div class="d-flex align-items-center">
              <label class="label form-label">状态: </label>
              <h6 class="ms-2">{{getStatus(comment.approved)}}</h6>
            </div>
            <nb-radio-group name="approved" [(ngModel)]="comment.approved">
              <nb-radio [value]="radio.value" *ngFor="let radio of options">{{radio.label}}</nb-radio>
            </nb-radio-group>
            <div class="d-flex align-items-center">
              <label class="label">提交于: </label>
              <div class="ms-2">{{comment.createdAt}}</div>
            </div>
            <div class="d-flex align-items-center" *ngIf="comment.post">
              <label class="label">回应给: </label>
              <h6 class="ms-2"><a [routerLink]="'/app/content/edit-post/'+comment.post.id">{{comment.post.title}}</a></h6>
            </div>
          </nb-card-body>
          <nb-card-footer class="d-flex justify-content-between">
            <a href="#">移至回收站</a>
            <button nbButton status="primary" [disabled]="f.invalid" size="small" type="submit">更新</button>
          </nb-card-footer>
        </nb-card>
      </div>
    </form>
  `,
  standalone: false,
})
export class CommentEditComponent implements OnInit {
  comment: any = {};

  options: {label: string, value: string}[] = [];

  constructor(protected http: HttpClient, protected route: ActivatedRoute, protected location: LocationStrategy) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = parseInt(params.get('id')!, 10);
      if (id > 0) {
        this.http.get('/comment/' + id).subscribe(comment => {
          this.comment = comment;
          this.options = [
            {'label': '批准', 'value': 'approved'},
            {'label': this.comment.approved === 'unapproved' ? '待审' : '驳回', 'value': 'unapproved'},
            {'label': '标记为垃圾', 'value': 'spam'},
          ];
          if (this.comment.approved == 'spam' || this.comment.approved == 'trash') {
            this.location.back();
          }
        });
      }
    })
  }


  onSubmit($event: NgForm) {
    console.log($event.invalid, $event.valid)
    if ($event.invalid) {
      return ;
    }
    if (this.comment.id) {
      this.http.post('/comment/{id}/update', this.comment).subscribe(() => {
        this.location.back();
      });
    }
  }

  getStatus(approved: string) {
    return this.options.find(item => item.value == approved)?.label;
  }
}

@Component({
  selector: 'app-comment-post',
  template: `
    <a *ngIf="value" [routerLink]="'/app/content/edit-post/'+value.id">查看文章</a>
  `,
  standalone: false,
})
export class CommentPostComponent implements OnInit {


  @Input() value: Post|null = null;
  @Input() rowData: any;

  ngOnInit(): void {

  }

  static initComponent(instance: CommentPostComponent, cell: Cell) {
    instance.value = cell.getRawValue() as Post;
    instance.rowData = cell.getRow().getData();
  }
}
