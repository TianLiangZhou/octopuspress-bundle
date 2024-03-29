import {
  AfterViewInit,
  Component,
  ElementRef, HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit, QueryList,
  ViewChild, ViewChildren
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BLOCKS, SAVE_BLOCK_WIDGET, WIDGET_RENDERED, WIDGETS} from "../../../@core/definition/decoration/api";
import {
  Block,
  RegisteredResponse,
  RenderedResponse,
  Widget,
  WidgetCategory
} from "../../../@core/definition/decoration/type";
import {NbSidebarService} from "@nebular/theme";
import {combineLatest, Observable, of, Subscription, timer} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {DomSanitizer} from "@angular/platform-browser";
import {FormGroup} from "@angular/forms";
import {buildFormGroup} from "../../../shared/control/type";

type ProductWidget = {
  id: string;
  widget: Widget;
  form: FormGroup;
  selected: boolean;
}


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit, AfterViewInit {
  private widgets: Widget[] = [];
  private widgetCategories: WidgetCategory[] = [];
  leftSidebarCompact: boolean = false;

  @ViewChild('widgetSidebarBtn', {read: ElementRef<HTMLButtonElement>}) widgetSidebarBtnRef!: ElementRef<HTMLButtonElement>;
  @ViewChildren('widgetItemComponent') widgetItems!: QueryList<WidgetItemComponent>;

  blocks: Block[] = [];
  hasHiddenWidgetSidebar = true;
  hasHiddenSettingSidebar = true;


  filterWidgetCategories: Observable<WidgetCategory[]> = of([]);

  private blockWidgets: Record<string, ProductWidget[]> = {};

  historyWidgets: Widget[] = [];

  selectBlockIndex = -1;

  selectedWidget: WidgetItemComponent | undefined;
  leftSidebarCollapse: boolean = false;


  constructor(protected http: HttpClient,
              protected sidebar: NbSidebarService,
              @Inject(DOCUMENT) protected  document: Document
  ) { }

  ngOnInit(): void {
    const widgetRequest = this.http.get<RegisteredResponse>(WIDGETS);
    const blockRequest = this.http.get<Block[]>(BLOCKS);
    combineLatest([widgetRequest, blockRequest]).subscribe(([widgetResponse, blocks]) => {
      this.widgets = widgetResponse.widgets;
      widgetResponse.categories.forEach(item => {
        item.widgets = this.widgets.filter(widget => widget.category == item.slug);
        item.widgets.forEach(w => {
          if (!w.icon) {
            w.icon = item.icon;
          }
        });
      });
      this.widgetCategories = widgetResponse.categories;
      this.filterWidgetCategories = of(this.widgetCategories);
      this.historyWidgets = this.widgets.slice(0, 6);


      this.blocks = blocks;
      if (blocks.length > 0) {
        this.selectBlockIndex = 0;
      }
      blocks.forEach((block) => {
        this.blockWidgets[block.name] = [];
        if (block.widgets.length > 0) {
          block.widgets.forEach(widgetData => {
            const widget = this.widgets.find(item => {
              if (item.name == widgetData.name) {
                return item;
              }
              return undefined;
            });
            if (!widget) {
              return ;
            }
            let controls = widget.sections.map(section => section.controls);
            let product: ProductWidget = {
              id: widgetData.id,
              widget: Object.assign({}, widget),
              form: new FormGroup(buildFormGroup(controls.flat(1))),
              selected: false,
            };
            for (const key in widgetData.attributes) {
              if (product.form.contains(key)) {
                product.form.controls[key].setValue(widgetData.attributes[key], {emitEvent: false});
              }
            }
            this.blockWidgets[block.name].push(product);
          });
        }
      });
    });
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(_ => {
      this.sidebar.getSidebarState('menu-sidebar').subscribe(state => {
        if (state == 'compacted') {
          this.leftSidebarCollapse = false;
          this.leftSidebarCompact = true;
        } else if (state == 'collapsed') {
          this.leftSidebarCompact = false;
          this.leftSidebarCollapse = true;
        } else {
          this.sidebar.compact('menu-sidebar');
        }
      });
    });
  }

  toggleWidgetSidebar($event: Event|null) {
    this.hasHiddenWidgetSidebar = !this.hasHiddenWidgetSidebar;
    if (!this.hasHiddenWidgetSidebar) {
      this.rollbackFilterWidgetCategories();
    }
    if (!this.hasHiddenWidgetSidebar) {
      this.hasHiddenSettingSidebar = true;
    }
  }

  toggleSettingSidebar($event: Event|null) {
    this.hasHiddenSettingSidebar = !this.hasHiddenSettingSidebar;
    if (!this.hasHiddenSettingSidebar) {
      this.hasHiddenWidgetSidebar = true;
    }
  }


  search($event: Event|null) {
    let value = $event ? ($event.target as HTMLInputElement).value : "";
    if (value == '') {
      this.filterWidgetCategories = of(this.widgetCategories);
      return ;
    }
    let widgets = this.widgets.filter(widget => {
      return widget.label.includes(value) || widget.keywords.flat().includes(value)
    });
    this.filterWidgetCategories = of([{ slug: "", label: "", icon: "", widgets: widgets, }]);
  }

  quickToggle($event: {isShown: boolean}, index: number) {
    if ($event.isShown) {
      this.selectBlockIndex = index;
      if (!this.hasHiddenWidgetSidebar) {
        this.toggleWidgetSidebar(null)
      }
    } else {
      this.rollbackFilterWidgetCategories();
    }
  }



  selectorBlock($event: Event, index: number) {
    this.selectBlockIndex = index;
  }

  selectorWidget($event: Event) {
    let id = ($event.target as HTMLElement).id
    this.selectedWidgetComponent(id);
  }

  private selectedWidgetComponent(id: string) {
    for (let item of this.widgetItems) {
      if (id != item.Id) {
        continue;
      }
      if (this.selectedWidget && this.selectedWidget.Id == id) {
        continue;
      }
      if (this.selectedWidget !== undefined) {
        this.selectedWidget.product.selected = false;
      }
      item.product.selected = true;
      this.selectedWidget = item;
      break;
    }
  }
  unselectWidget($event: FocusEvent) {
    if ($event.relatedTarget) {
      let id = ($event.relatedTarget as HTMLElement).id;
      if (id == "settingSidebarBtn") {
        return ;
      }
      let className = ($event.relatedTarget as HTMLElement).className;
      console.log(className);
      if (className.includes("sidebar-setting") ||
        className.includes("tab-link") ||
        className.includes("accordion") ||
        className.includes("control-container")
      ) {
        return ;
      }
    }
    if (this.selectedWidget !== undefined) {
      this.selectedWidget.product.selected = false;
    }
    this.selectedWidget = undefined;
  }


  insertWidget(name: string, isQuick: boolean = false) {
    let widget = this.widgets.filter(item => item.name === name).pop();
    if (this.selectBlockIndex > -1 && widget) {
      let controls = widget.sections.map(section => section.controls);
      this.blockWidgets[this.blocks[this.selectBlockIndex].name].push({
        id: this.generateUUID(),
        widget: Object.assign({}, widget),
        form: new FormGroup<any>(buildFormGroup(controls.flat(1))),
        selected: false,
      });
      if (!isQuick) {
        this.historyWidgets.unshift(widget);
        if (this.historyWidgets.length > 6) {
          this.historyWidgets.pop();
        }
      }
    }
  }

  getBlockWidgets(name: string) {
    return this.blockWidgets[name] ?? [];
  }

  save($event: Event) {
    const body = {
      blocks: <Record<string, string[]>>{},
      widgets: <Record<string, any>>{},
    };
    let i = 1;
    for (let name in this.blockWidgets) {
      body.blocks[name] = [];
      this.blockWidgets[name].forEach(item => {
        const widgetName = 'widget-' + item.widget.name + '-' + i;
        body.blocks[name].push(widgetName);
        body.widgets[widgetName] = {
          id: item.id,
          name: item.widget.name,
          attributes: item.form.getRawValue(),
        };
        i++;
      });
    }
    this.http.post(SAVE_BLOCK_WIDGET, body).subscribe({
    });
  }

  private rollbackFilterWidgetCategories() {
    this.filterWidgetCategories.subscribe(c => {
      if (c.length != this.widgetCategories.length) {
        this.filterWidgetCategories = of(this.widgetCategories);
      }
    });
  }

  private generateUUID() {
    let d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
      d += performance.now(); // 添加性能测量器的当前时间
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d/16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  selected(product: ProductWidget) {
    if (product.selected) {
      return ;
    }
    this.selectedWidgetComponent(product.id);
  }

  onNext(name: string, item: ProductWidget) {
    const index = this.blockWidgets[name].findIndex(ele => ele.id == item.id);
    if (index > - 1) {
      const next = this.blockWidgets[name][index+1];
      if (next) {
        this.blockWidgets[name][index + 1] = item;
        this.blockWidgets[name][index] = next;
      }
    }
  }

  onPrevious(name: string, item: ProductWidget) {
    const index = this.blockWidgets[name].findIndex(ele => ele.id == item.id);
    if (index > -1) {
      const pre = this.blockWidgets[name][index - 1];
      if (pre) {
        this.blockWidgets[name][index - 1] = item;
        this.blockWidgets[name][index] = pre;
      }
    }
  }
  onRemove(name: string, item: ProductWidget) {
    const index = this.blockWidgets[name].findIndex(ele => ele.id == item.id);
    if (index > -1) {
      this.blockWidgets[name].splice(index, 1);
    }
  }

}


@Component({
  selector: 'widget-item',
  template: `
    <div class="position-relative widget-container">
      <div #container class="widget-{{product.widget.name}}">
        <nb-icon *ngIf="isMedia()"
                 style="width: 100px; height: 100px" [pack]="product.widget.icon.startsWith('fa-') ? 'fa': ''"
                 [icon]="product.widget.icon">
        </nb-icon>
      </div>
      <ng-template [ngIf]="product.widget.name === 'group'">
        <div class="d-flex flex-column py-5 px-3">
          <div class="d-flex mb-2">
            <nb-icon [pack]="product.widget.icon.startsWith('fa-') ? 'fa': ''"
                     [icon]="product.widget.icon">
            </nb-icon>
            <span>{{ product.widget.label }}</span>
          </div>
          <button nbButton fullWidth status="basic">
            <nb-icon icon="plus-outline"></nb-icon>
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        width: 100%;
        margin: 1.25rem 0;
      }
    `
  ]
})
export class WidgetItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('product') product!: ProductWidget
  private subscribeChange: Subscription | undefined;

  @HostBinding('attr.id') get Id() {
    return this.product.id
  }
  @ViewChild('container', {read: ElementRef<HTMLDivElement>}) container!: ElementRef<HTMLDivElement>;

  constructor(protected http: HttpClient, protected ds: DomSanitizer) {
  }

  ngOnInit(): void {
    this.render(this.product.form.getRawValue());
    this.subscribeChange = this.product.form.valueChanges.subscribe(values => {
      this.render(values)
    });
  }

  private render(data: Record<string, any>) {
    data.name = this.product.widget.name;
    this.http.post<RenderedResponse>(WIDGET_RENDERED, data).subscribe(response => {
      if (response.output) {
        this.container.nativeElement.innerHTML = response.output
      }
    });
  }

  ngAfterViewInit(): void {
  }
  isMedia() {
    return ['image', 'file', 'video', 'audio', 'cover', 'gallery'].includes(this.product.widget.name);
  }


  ngOnDestroy(): void {
    if (this.subscribeChange) {
      this.subscribeChange.unsubscribe();
    }
    this.subscribeChange = undefined;
  }
}
