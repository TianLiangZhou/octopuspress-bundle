import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit, TemplateRef,
  ViewChild
} from '@angular/core';
import {
  NB_DATE_ADAPTER,
  NbAccordionComponent,
  NbDatepickerAdapter,
  NbDateTimePickerComponent, NbDialogRef, NbDialogService,
  NbSidebarService,
  NbTagInputDirective,
  NbToastrService
} from "@nebular/theme";

import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime, delay, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {HttpClient, HttpContext, HttpErrorResponse, HttpParams} from "@angular/common/http";
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
  POST_UPDATE, POSTS,
  TAXONOMIES,
  TAXONOMY_STORE
} from "../../@core/definition/content/api";
import {SPINNER} from "../../@core/interceptor/authorization";
import {merge, Observable, of, ReplaySubject, Subject, Subscription, timer} from "rxjs";
import {User} from "../../@core/definition/user/type";
import {USER_MEMBER} from "../../@core/definition/user/api";
import {CkeditorComponent} from "../ckeditor/ckeditor.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {NbTagInputAddEvent} from "@nebular/theme/components/tag/tag-input.directive";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {UserService} from "../../@core/services/user.service";
import {buildFormGroup, Control} from "../control/type";

type CheckTermTaxonomy = TermTaxonomy & {
  checked: boolean;
}

@Component({
  selector: 'edit-post',
  templateUrl: './edit-post.component.html',
  standalone: false,
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
    parentInput: new FormControl<string>(""),
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
    meta: new FormGroup<Record<string, FormControl>>({}),
  });
  filteredAuthorOptions$: Observable<User[]> | undefined;
  filteredParentOptions$: Observable<Post[]> | undefined;

  @ViewChild("accordionComponent", {static: false}) accordion: NbAccordionComponent | undefined;
  @ViewChild("dateTimePicker") datepicker: NbDateTimePickerComponent<any> | undefined;

  @ViewChild("inputBtnElement", {read: ElementRef}) inputBtnElement: ElementRef | undefined;
  @ViewChild("visibleBtnElement", {read: ElementRef}) visibleBtnElement: ElementRef | undefined;
  @ViewChild("ckeditorComponent") editor!: CkeditorComponent;
  private postTypeChange$ = new ReplaySubject<string>(1);
  typeSetting: Partial<PostTypeSetting> = {};
  controls: any[] = [];

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
      let metas = this.config.postMeta(type);
      let controls: Control[] = [];
      metas.forEach((meta) => {
       if (meta.showUi && (meta.isCreated || meta.isUpdated) && meta.control) {
         controls.push(meta.control);
       }
      });
      if (controls) {
        let buildFormGroupMap = buildFormGroup(controls);
        for (let key in buildFormGroupMap) {
          this.metaGroup.addControl(key, buildFormGroupMap[key]);
        }
        this.controls = controls;
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
            this.postTypeChange$.next(this.entity.type)
            this.fillFormControlValue();
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
    this.route.queryParamMap.subscribe(map => {
      let parentId = parseInt(map.get('parent') ?? '0', 10);
      if (parentId > 0) {
        this.http.get<PostEntity>(this.endpoint.show, {params:{id: parentId}}).subscribe(parent => {
          this.selectParent(parent);
          this.selectAuthor((parent.author) as User);
        });
      }
    });
    this.filteredAuthorOptions$ = this.formGroup.controls.authorNickname.valueChanges.pipe(
      filter(value => value != '[object Object]' && value != ''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) {
          return of();
        }
        return this.http.get<Records<User>>(USER_MEMBER + '?nickname=' + value + '&size=30').pipe(map(result => result.records))
      })
    );
    this.filteredParentOptions$ = this.formGroup.controls.parentInput.valueChanges.pipe(
      filter(value => value != '[object Object]' && value != ''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) {
          return of();
        }
        let type = this.typeSetting.parentType || this.type;
        let params = new HttpParams({fromObject: {
          type: type,
          title: value || "",
          size: 30
        }});
        return this.http.get<Records<Post>>(POSTS, {params: params}).pipe(map(result => result.records))
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

    this.ckfinder.onChoose().subscribe((files: any[]) => {
      let file = files[0]||null;
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
      this.sidebarService.getSidebarState('menu-sidebar').subscribe(state => {
        if (state !== 'collapsed') {
          this.sidebarService.collapse('menu-sidebar');
        }
      });
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
    delete data.parentInput;
    this.http.post<ActionBody>(
      this.id > 0 ? this.endpoint.update : this.endpoint.create,
      data,
      {context: new HttpContext().set(SPINNER, this)})
      .subscribe( res => {
        this.id = res.id;
        this.entity.id = res.id;
        this.entity.previewUrl = res.previewUrl || '';
      });
  }

  preview() {
    if (this.id > 0 && this.entity.previewUrl) {
      window.open(this.entity.previewUrl);
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

  selectParent($event: Post|string) {
    if (typeof $event == 'object') {
      this.formGroup.controls.parent.setValue($event.id);
      this.formGroup.controls.parentInput.setValue($event.title);
    }
  }

  onSpinner(spinner: boolean): void {
    this.submitted = spinner;
  }

  get isRichEditor() {
    return this.sessionUser.isRichEditor;
  }
  get metaGroup() {
    return this.formGroup.controls['meta'] as FormGroup;
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
    this.formGroup.controls.relationships.setValue(this.entity.relationships);
    this.formGroup.controls.author.setValue(this.entity.author?.id ?? null);
    this.formGroup.controls.parent.setValue(this.entity.parent?.id ?? null);
    this.formGroup.controls.featuredImage.setValue(this.entity.featuredImage.id ?? null);
    this.formGroup.controls.authorNickname.setValue(this.entity.author?.nickname ?? "");
    this.formGroup.controls.parent.setValue(this.entity.parent?.id ?? null);
    this.formGroup.controls.parentInput.setValue(this.entity.parent?.title ?? "");

    for (let key in this.entity.meta) {
      if (this.metaGroup.contains(key)) {
        this.metaGroup.controls[key].setValue(this.entity.meta[key]);
      }
    }
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
        <button nbButton (click)="open(dialog)" status="primary" type="button">{{taxonomySetting ? taxonomySetting.labels['addNewItem'] : '添加目录'}}</button>
      </div>
    </div>
    <ng-template #dialog let-data let-ref="dialogRef">
      <app-taxonomy-create [setting]="taxonomySetting!" (create)="onCreate($event)"></app-taxonomy-create>
    </ng-template>
  `,
  standalone: false
})
export class HierarchicalTermSelectorComponent implements OnInit {

  @Input() taxonomySetting: TaxonomySetting | undefined;

  @Input() control: FormControl<TermTaxonomy[]|null> | undefined;

  filtered$: Observable<CheckTermTaxonomy[]> | undefined;
  private dialogRef: NbDialogRef<any> | undefined;

  constructor(protected http: HttpClient, protected dialogService: NbDialogService) {
  }

  open(dialog: TemplateRef<any>) {
    this.dialogRef = this.dialogService.open(dialog, {});
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

  onCreate(termTaxonomy: TermTaxonomy) {
    (termTaxonomy as CheckTermTaxonomy).checked = true;
    this.changeSelector(true, termTaxonomy);
    this.filtered$ = merge(this.filtered$!, of([termTaxonomy as CheckTermTaxonomy]));
    this.dialogRef?.close();
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
               status="primary"
               nbTagInput
               autocomplete="off"
               [nbAutocomplete]="autocomplete" (keydown.enter)="$event.preventDefault();" (tagAdd)="onTextAdd($event);" fullWidth/>
        <nb-autocomplete #autocomplete (selectedChange)="onTagAdd($event)">
          <nb-option *ngFor="let item of filtered$ | async" [value]="item">{{ item.name }}</nb-option>
        </nb-autocomplete>
      </nb-tag-list>
      <nb-icon nbSuffix icon="search" pack="eva"></nb-icon>
    </nb-form-field>
  `,
  standalone: false
})
export class FlatTermSelectorComponent implements OnInit, OnSpinner {

  @Input() control: FormControl<TermTaxonomy[] | null> | undefined;

  @ViewChild(NbTagInputDirective, {read: ElementRef}) tagInput: ElementRef<HTMLInputElement> | undefined;

  inputControl = new FormControl();

  @Input() taxonomySetting: TaxonomySetting | undefined;

  filtered$: Observable<TermTaxonomy[]> | undefined;

  related: TermTaxonomy[] = [];

  private spinner: boolean = false;

  private subscription: Subscription | undefined;

  constructor(protected http: HttpClient) {
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
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
    let relationships = this.control?.value ?? [];
    this.related = relationships.filter(item => item.taxonomy == this.taxonomySetting?.slug);
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
    if (this.spinner || event.value == "") {
      return ;
    }
    this.subscription = of(event.value).pipe(delay(100)).subscribe(text => {
      this.http.post<TermTaxonomy>(
        TAXONOMY_STORE,
        {name: text, slug: text, parent: null, taxonomy: this.taxonomySetting?.slug,},
        {context:new HttpContext().set(SPINNER, this)}
      ).subscribe({
        next: result => {
          this.onTagAdd(result);
        },
        error: (error) => {
          console.log(error);
          this.subscription?.unsubscribe();
        }
      });
    });
  }
}
