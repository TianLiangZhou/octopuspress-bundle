import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  NB_DATE_ADAPTER,
  NbAccordionComponent,
  NbDatepickerAdapter,
  NbDateTimePickerComponent,
  NbSidebarService,
  NbTagInputDirective,
  NbToastrService
} from "@nebular/theme";

import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, delay, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {HttpClient, HttpContext, HttpErrorResponse} from "@angular/common/http";
import {CKFinderService} from "../../@core/services/ckfinder.service";
import {ActionBody, OnSpinner, PostEntity, Records} from "../../@core/definition/common";
import {
  Post,
  PostStatus, PostTypeSetting,
  TaxonomySetting,
  TermTaxonomy
} from "../../@core/definition/content/type";
import {
  POST_DELETE, POST_SHOW,
  POST_STORE,
  POST_TYPE_SETTING, POST_UPDATE,
  TAXONOMIES,
  TAXONOMY_REGISTERED,
  TAXONOMY_STORE
} from "../../@core/definition/content/api";
import {SPINNER} from "../../@core/interceptor/authorization";
import {Observable, ReplaySubject, Subject, Subscription, timer} from "rxjs";
import {User} from "../../@core/definition/user/type";
import {USER_MEMBER} from "../../@core/definition/user/api";
import {CkeditorComponent} from "../ckeditor/ckeditor.component";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {NbTagInputAddEvent} from "@nebular/theme/components/tag/tag-input.directive";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {UserService} from "../../@core/services/user.service";

type CheckTermTaxonomy = TermTaxonomy & {
  checked: boolean;
}

@Component({
  selector: 'edit-post',
  templateUrl: './edit-post.component.html',
})
export class EditPostComponent implements OnInit, AfterViewInit, OnSpinner {
  private type: string = 'post';
  taxonomyPanels: TaxonomySetting[] = [];
  entity: Post = {
    id: 0,
    parent: null,
    author: null,
    title: "",
    name: '',
    excerpt: "",
    content: "",
    status: "draft", // "draft",
    type: "post",
    commentStatus: "open",
    pingStatus: "open",
    relationships: [],
    password: "",
    date: "",
    meta: {},
    featuredImage: {},
  };
  private endpoint = {
    create: POST_STORE,
    update: POST_UPDATE,
    delete: POST_DELETE,
    show: POST_SHOW,
  }
  submitted = false;
  id: number = 0;
  documentPanelState: boolean = true;
  formGroup = this.fb.group({
    title: new FormControl<string>("", [Validators.required]),
    parent: new FormControl<null|number>(null),
    author: new FormControl<null|number>(null),
    authorNickname: new FormControl<string>(""),
    content: new FormControl<string>(""),
    excerpt: new FormControl<string>(""),
    name: new FormControl<string>(""),
    status: new FormControl<string>("publish"),
    type: new FormControl<string>("post"),
    commentStatus: new FormControl<string>("open"),
    pingStatus: new FormControl<string>("open"),
    password: new FormControl<string>(""),
    date: new FormControl<null|Date>(null),
    featuredImage: new FormControl<null|number>(null),
    visible: new FormControl<string>("open"),
    relationships: new FormControl<TermTaxonomy[]>([]),
    meta: new FormControl<Record<string, any>>({}),
  });
  filteredAuthorOptions$: Observable<User[]> | undefined;

  @ViewChild("accordionComponent", {static: false}) accordion: NbAccordionComponent | undefined;
  @ViewChild("dateTimePicker") datepicker: NbDateTimePickerComponent<any> | undefined;

  @ViewChild("inputBtnElement", {read: ElementRef}) inputBtnElement: ElementRef | undefined;
  @ViewChild("visibleBtnElement", {read: ElementRef}) visibleBtnElement: ElementRef | undefined;
  @ViewChild("ckeditorComponent") editor!: CkeditorComponent;
  private postTypeChange$ = new ReplaySubject<string>(1);
  typeSetting: Partial<PostTypeSetting> = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(NB_DATE_ADAPTER) private datepickerAdapters: NbDatepickerAdapter<any>[],
    private toastService: NbToastrService,
    public ckfinder: CKFinderService,
    private sidebarService: NbSidebarService,
    private fb: FormBuilder,
    private config: ConfigurationService,
    private sessionUser: UserService,
  ) {
  }

  ngOnInit() {
    this.postTypeChange$.subscribe(type => {
      if (type === 'nav_menu_item') {
        this.router.navigateByUrl('/app/decoration/navigation').then();
        return;
      }
      const registeredPostTypes = this.config.postTypes();
      if (!Object.keys(registeredPostTypes).includes(type)) {
        this.router.navigateByUrl('/404').then();
        return;
      }
      this.typeSetting = registeredPostTypes[type];
      if (!this.typeSetting.visibility!.showUi) {
        return;
      }
      this.type = type;
      this.formGroup.controls.type.setValue(this.type);
      this.bindDocumentTaxonomySetting(type);
    });

    this.route.paramMap.subscribe(map => {
      if (map.has('id')) {
        let id = parseInt(map.get('id')!);
        if (id < 1) {
          this.router.navigateByUrl('/404').then();
          return ;
        }
        this.http.get<PostEntity>(this.endpoint.show, {params:{id: id}}).subscribe({
          next: res => {
            this.id = id;
            this.entity = res;
            this.fillFormControlValue();
            this.postTypeChange$.next(this.entity.type)
          },
          error: err => {
            if (err instanceof HttpErrorResponse && err.status == 404) {
              this.router.navigateByUrl('/404').then();
            }
          }
        });
      } else {
        this.postTypeChange$.next(map.get('type') || 'post');
      }
    });

    this.filteredAuthorOptions$ = this.formGroup.controls.authorNickname.valueChanges.pipe(
      filter(value => value != '[object Object]' && value != ''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        return this.http.get<Records<User>>(USER_MEMBER + '?nickname=' + value + '&size=30').pipe(map(result => result.records))
      })
    );
    this.formGroup.controls.visible.valueChanges.subscribe(value => {
      if (!this.visibleBtnElement) {
        return ;
      }
      switch (value) {
        case 'private':
          this.visibleBtnElement.nativeElement.innerHTML = '私密';
          break;
        case 'password':
          this.visibleBtnElement.nativeElement.innerHTML = '密码保护';
          break;
        default:
          this.visibleBtnElement.nativeElement.innerHTML = '公开';
      }
    });

    this.ckfinder.subscribe((files: any[]) => {
      let file = files.pop();
      if (file) {
        this.entity.featuredImage.id = file.id;
        this.entity.featuredImage.url = file.url;
        this.formGroup.controls.featuredImage.setValue(file.id);
      }
    });
  }

  ngAfterViewInit(): void {
    this.datepicker?.valueChange.subscribe((date: Date) => {
      const now = Math.floor(new Date().getTime() / 1000);
      const selected = Math.floor(date.getTime() / 1000);
      const isNow = now == selected || selected < now;
      const datepickerAdapter = this.datepickerAdapters.find(({picker}) => this.datepicker instanceof picker);
      const value = datepickerAdapter?.format(date, "");
      this.inputBtnElement!.nativeElement.innerHTML = isNow ? "立即" : value;
      this.formGroup.controls.date.setValue(isNow ? null : date);
    });
    timer(0).subscribe(() => {
      this.sidebarService.toggle(true, 'menu-sidebar');
      this.accordion?.openAll();
    });
  }


  updateContent($event: string) {
    this.formGroup.controls.content.setValue($event);
  }

  action(status: PostStatus) {
    const data: any = this.formGroup.getRawValue();
    data.id = this.id;
    data.status = status;
    if (status !== 'draft' && data.visible === 'private') {
      data.status = 'private';
    }
    delete data.authorNickname;
    delete data.visible;
    this.http.post<ActionBody>(
      this.id > 0 ? this.endpoint.update : this.endpoint.create,
      data,
      {context: new HttpContext().set(SPINNER, this)})
      .subscribe( res => {
        this.id = res.id;
        this.entity.id = res.id;
      });
  }

  preview() {
    if (this.id > 0) {
      window.open(location.protocol + "//" + location.host + "/post/" + this.id + '?preview=true')
    } else {
      this.toastService.danger("只有保存之后才可以预览", "预览");
    }
  }

  commentStatus(status: boolean) {
    this.formGroup.controls.commentStatus.setValue(status ? "open": "closed");
  }

  pingStatus(status: boolean) {
    this.formGroup.controls.pingStatus.setValue(status ? "open": "closed");
  }

  selectAuthor($event: User|string) {
    if (typeof $event == 'object') {
      this.formGroup.controls.author.setValue($event.id);
      this.formGroup.controls.authorNickname.setValue($event.nickname);
    }
  }

  onSpinner(spinner: boolean): void {
    this.submitted = spinner;
  }

  get isRichEditor() {
    return this.sessionUser.isRichEditor;
  }

  private bindDocumentTaxonomySetting(type: string) {
    let taxonomyPanels = [];
    const registeredTaxonomies = this.config.taxonomies();
    for (let slug in registeredTaxonomies) {
      let taxonomy = registeredTaxonomies[slug];
      if (taxonomy && taxonomy.types && taxonomy.types.includes(type) && taxonomy.visibility.showUi) {
        taxonomyPanels.push(taxonomy);
      }
    }
    this.taxonomyPanels = taxonomyPanels;
  }

  private fillFormControlValue() {
    this.formGroup.controls.title.setValue(this.entity.title);
    this.formGroup.controls.content.setValue(this.entity.content);
    this.formGroup.controls.password.setValue(this.entity.password);
    this.formGroup.controls.excerpt.setValue(this.entity.excerpt);
    this.formGroup.controls.status.setValue(this.entity.status);
    this.formGroup.controls.commentStatus.setValue(this.entity.commentStatus);
    this.formGroup.controls.pingStatus.setValue(this.entity.pingStatus);
    this.formGroup.controls.name.setValue(this.entity.name);
    this.formGroup.controls.meta.setValue(this.entity.meta);
    this.formGroup.controls.relationships.setValue(this.entity.relationships);
    this.formGroup.controls.author.setValue(this.entity.author?.id ?? null);
    this.formGroup.controls.parent.setValue(this.entity.parent?.id ?? null);
    this.formGroup.controls.featuredImage.setValue(this.entity.featuredImage.id ?? null);
    this.formGroup.controls.authorNickname.setValue(this.entity.author?.nickname ?? "");
  }
}

@Component({
  selector: 'hierarchical-term-selector',
  template: `
    <div class="form-group">
      <div class="col-12 d-flex flex-column">
        <div class="mb-4 d-flex flex-column">
          <nb-checkbox *ngFor="let option of filtered$ | async"
                       status="primary"
                       (checkedChange)="changeSelector($event, option)"
                       [checked]="option.checked">
            {{ option.name }}
          </nb-checkbox>
        </div>
        <button nbButton status="primary" type="button">添加新分类目录</button>
      </div>
    </div>
  `,
})
export class HierarchicalTermSelectorComponent implements OnInit {

  @Input() taxonomySetting: TaxonomySetting | undefined;

  @Input() control: FormControl<TermTaxonomy[]|null> | undefined;

  filtered$: Observable<CheckTermTaxonomy[]> | undefined;

  constructor(protected http: HttpClient) {
  }


  changeSelector(checked: boolean, option: TermTaxonomy) {
    let relationships = this.control?.value ?? [];
    if (checked) {
      relationships.push(option);
    } else {
      let index = relationships.findIndex(item => item.id == option.id);
      if (index !== undefined && index > -1) {
        relationships.splice(index, 1);
      }
    }
  }

  ngOnInit(): void {
    this.filtered$ = this.http.get<Records<CheckTermTaxonomy>>(TAXONOMIES, {params: {taxonomy: this.taxonomySetting!.slug}})
      .pipe(
        map((result:Records<CheckTermTaxonomy>) => {
          if (result.records.length > 0) {
            let relationships = this.control?.value ?? [];
            result.records.forEach((item: CheckTermTaxonomy) => {
              item.checked = relationships.find(t => t.id == item.id) != null
            });
            return result.records;
          }
          return [];
        })
      );
  }
}

@Component({
  selector: 'flat-term-selector',
  template: `
    <nb-form-field>
      <nb-tag-list>
        <nb-tag (remove)="onTagRemove(tag)" *ngFor="let tag of related"
                [text]="tag.name" removable="true"></nb-tag>
        <input type="text" [name]="taxonomySetting!.slug" [formControl]="inputControl"
               placeholder="添加标签"
               status="primary" nbTagInput
               autocomplete="off"
               [nbAutocomplete]="autocomplete" (keydown.enter)="$event.preventDefault();" (tagAdd)="onTextAdd($event);" fullWidth/>
        <nb-autocomplete #autocomplete (selectedChange)="onTagAdd($event)">
          <nb-option *ngFor="let item of filtered$ | async" [value]="item">{{ item.name }}</nb-option>
        </nb-autocomplete>
      </nb-tag-list>
      <nb-icon nbSuffix icon="search" pack="eva"></nb-icon>
    </nb-form-field>
  `,
})

export class FlatTermSelectorComponent implements OnInit {

  @Input() control: FormControl<TermTaxonomy[] | null> | undefined;

  @ViewChild(NbTagInputDirective, {read: ElementRef}) tagInput: ElementRef<HTMLInputElement> | undefined;

  inputControl = new FormControl();

  @Input() taxonomySetting: TaxonomySetting | undefined;

  filtered$: Observable<TermTaxonomy[]> | undefined;

  related: TermTaxonomy[] = [];

  private confirmTerm$: Subject<string> = new Subject<string>();

  private subscription: Subscription | undefined;

  constructor(protected http: HttpClient) {
  }

  ngOnInit(): void {
    this.filtered$ = this.inputControl.valueChanges.pipe(
      filter(value => value != '[object Object]' && value != ''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        return this.http.get<Records<TermTaxonomy>>(TAXONOMIES + '?name=' + value, {params: {taxonomy: this.taxonomySetting?.slug!}}).pipe(map(result => result.records))
      })
    );
    this.control?.valueChanges.subscribe(relationships => {
      if (relationships != null) {
        this.related = relationships.filter(item => item.taxonomy == this.taxonomySetting?.slug);
      }
    });

  }




  onTagRemove(taxonomy: TermTaxonomy): void {
    let relationships = this.control?.value ?? [];
    let index = relationships.findIndex(item => item.id == taxonomy.id);
    if (index !== undefined && index > -1) {
      relationships.splice(index, 1);
    }
    let index1 = this.related.findIndex(item => item.id == taxonomy.id);
    if (index1 !== undefined && index1 > -1) {
      this.related.splice(index1, 1);
    }
  }

  onTagAdd(termTaxonomy: TermTaxonomy): void {
    this.subscription?.unsubscribe();
    if (!termTaxonomy) {
      return ;
    }
    let relationships = this.control?.value ?? [];
    let index = this.related.findIndex(item => item.id == termTaxonomy.id);
    if (index < 0) {
      relationships?.push(termTaxonomy);
      this.related.push(termTaxonomy);
    }
    if (this.tagInput != null) {
      this.tagInput.nativeElement.value = '';
    }
  }

  onTextAdd(event: NbTagInputAddEvent) {
    this.subscription = this.confirmTerm$.pipe(delay(100)).subscribe(text => {
      this.http.post<TermTaxonomy>(TAXONOMY_STORE, {
        name: text, slug: text, parent: null, taxonomy: this.taxonomySetting?.slug
      }).subscribe({next: result => {
          this.onTagAdd(result);
        },
        error: error => {
          this.subscription?.unsubscribe();
        }
      });
    });
    this.confirmTerm$.next(event.value);
  }
}
