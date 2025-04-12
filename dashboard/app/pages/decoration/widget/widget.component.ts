import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BLOCKS, SAVE_BLOCK_WIDGET, WIDGET_RENDERED, WIDGETS} from "../../../@core/definition/decoration/api";
import {Block, RegisteredResponse, RenderedResponse, Widget, WidgetCategory, WidgetData} from "../../../@core/definition/decoration/type";
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
  name: string;
  selected: boolean;
  children: ProductWidget[];
}

const iconPack = (widget: Widget) => {
  if (widget.icon.startsWith('fa-')) {
    return 'fa';
  }
  if (widget.icon.startsWith('op-')) {
    return 'op';
  }
  return '';
}


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  standalone: false,
})
export class WidgetComponent implements OnInit, AfterViewInit {
  private widgets: Widget[] = [];
  private widgetCategories: WidgetCategory[] = [];
  leftSidebarCompact: boolean = false;

  @ViewChild('widgetSidebarBtn', {read: ElementRef<HTMLButtonElement>}) widgetSidebarBtnRef!: ElementRef<HTMLButtonElement>;
  @ViewChildren('widgetItemComponent') widgetItems!: QueryList<WidgetItemComponent>;
  @ViewChild('quickInsertWidgetDialog',  {read: TemplateRef}) quickInsertWidgetDialog!: TemplateRef<any>;

  blocks: Block[] = [];
  hasHiddenWidgetSidebar = true;
  hasHiddenSettingSidebar = true;


  filterWidgetCategories: Observable<WidgetCategory[]> = of([]);

  private blockWidgets: Record<string, ProductWidget[]> = {};

  historyWidgets: Widget[] = [];

  selectBlockIndex = -1;

  lastedWidget: WidgetItemComponent | undefined;
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
      let children = (widgetData: WidgetData): ProductWidget | undefined => {
        const widget = this.widgets.find(item => {
          if (item.name == widgetData.name) {
            return item;
          }
          return undefined;
        });
        if (!widget) {
          return undefined;
        }
        let controls = widget.sections.map(section => section.controls);
        let product: ProductWidget = {
          id: widgetData.id,
          widget: Object.assign({}, widget),
          form: new FormGroup(buildFormGroup(controls.flat(1))),
          name: widget.name,
          selected: false,
          children: [],
        };
        for (const key in widgetData.attributes) {
          if (product.form.contains(key)) {
            product.form.controls[key].setValue(widgetData.attributes[key], {emitEvent: false});
          }
        }
        if (widgetData.children.length > 0) {
          widgetData.children.forEach( item => {
            let p = children(item);
            if (p) {
              product.children.push(p)
            }
          });
        }
        return product;
      };

      blocks.forEach((block) => {
        this.blockWidgets[block.name] = [];
        if (block.widgets.length > 0) {
          block.widgets.forEach(widgetData => {
            let product = children(widgetData);
            if (product) {
              this.blockWidgets[block.name].push(product);
            }
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
    this.widgetItems.changes.subscribe((res:QueryList<WidgetItemComponent>) => {
      this.selectorWidget(res.last);
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



  selectorBlock(index: number) {
    this.selectBlockIndex = index;
    if (this.lastedWidget !== undefined) {
      this.lastedWidget.product.selected = false;
    }
    this.lastedWidget = undefined;
  }

  selectorWidget(widget: WidgetItemComponent) {
    if (this.lastedWidget && this.lastedWidget.Id == widget.Id) {
      return ;
    }
    if (this.lastedWidget !== undefined) {
      this.lastedWidget.product.selected = false;
    }
    widget.product.selected = true;
    this.lastedWidget = widget;
  }

  private selectedWidgetComponent(id: string, widgets: QueryList<WidgetItemComponent>) {
    for (let widget of widgets) {
      if (this.lastedWidget != undefined && this.lastedWidget.Id == id) {
        break;
      }
      if (widget.Id == id) {
        if (this.lastedWidget != undefined) {
          this.lastedWidget.product.selected = false;
        }
        widget.product.selected = true;
        this.lastedWidget = widget;
        break;
      }
      if (widget.groupComponent != undefined) {
        this.selectedWidgetComponent(id, widget.groupComponent.widgetItems)
      }
    }


    for (let item of this.widgetItems) {
      if (id != item.Id) {
        continue;
      }
      if (this.lastedWidget && this.lastedWidget.Id == id) {
        break;
      }
      if (this.lastedWidget !== undefined) {
        this.lastedWidget.product.selected = false;
      }
      item.product.selected = true;
      this.lastedWidget = item;
      break;
    }
  }
  unselectWidget($event: FocusEvent) {
  }


  insertWidget(name: string, isQuick: boolean = false, index: number = 0) {
    let widget = this.widgets.filter(item => item.name === name).pop();
    if (this.selectBlockIndex > -1 && widget) {
      let controls = widget.sections.map(section => section.controls);
      const blockName = this.blocks[this.selectBlockIndex].name;
      const product = {
        id: this.generateUUID(),
        widget: Object.assign({}, widget),
        form: new FormGroup<any>(buildFormGroup(controls.flat(1))),
        selected: true,
        name: widget.name,
        children: [],
      };
      if (this.lastedWidget) {
        if (this.lastedWidget.isGroup()) {
          this.lastedWidget.addChildren(product);
        } else if (this.lastedWidget.pre && this.lastedWidget.pre.isGroup()) {
          this.lastedWidget.pre.addChildren(product);
        }
      } else {
        this.blockWidgets[blockName].push(product);
      }
      if (!isQuick) {
        this.historyWidgets.unshift(widget);
        if (this.historyWidgets.length > 6) {
          this.historyWidgets.pop();
        }
      }
    }
  }

  getBlockWidgetsForIndex(): any {
    return this.getBlockWidgets(this.blocks[this.selectBlockIndex].name);
  }
  getBlockWidgets(name: string): any {
    return this.blockWidgets[name] ?? [];
  }

  save($event: Event) {
    const body = {
      blocks: <Record<string, string[]>>{},
      widgets: <Record<string, any>>{},
    };
    let i = 1;

    let children = (childrenWidgets: ProductWidget[]) => {
      if (childrenWidgets.length < 1) {
        return [];
      }
      let widgets: Record<string, any>[] = [];
      childrenWidgets.forEach((child: ProductWidget) => {
        widgets.push({
          id: child.id,
          name: child.widget.name,
          attributes: child.form.getRawValue(),
          children: children(child.children),
        })
      })
      return widgets;
    };
    Object.keys(this.blockWidgets).forEach(name => {
      body.blocks[name] = [];
      this.blockWidgets[name].forEach(item => {
        const widgetName = 'widget-' + item.widget.name + '-' + i;
        body.blocks[name].push(widgetName);
        body.widgets[widgetName] = {
          id: item.id,
          name: item.widget.name,
          attributes: item.form.getRawValue(),
          children: children(item.children),
        };
        i++;
      });
    })
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
    return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  selected(product: ProductWidget) {
    if (product.selected) {
      return ;
    }
    this.selectedWidgetComponent(product.id, this.widgetItems);
  }

  onNext(item: ProductWidget) {
    const find = (widgets: ProductWidget[]) => {
      for (let index = 0; index < widgets.length; index++) {
        if (widgets[index].id == item.id) {
          const next = widgets[index+1] || null;
          if (next) {
            widgets[index + 1] = widgets[index];
            widgets[index] = next;
          }
          break;
        } else if (widgets[index].children.length > 0) {
          find(widgets[index].children);
        }
      }
    };
    find(this.getBlockWidgetsForIndex());
  }

  onPrevious(item: ProductWidget) {
    const find = (widgets: ProductWidget[]) => {
      for (let index = 0; index < widgets.length; index++) {
        if (widgets[index].id == item.id) {
          const pre = widgets[index-1] || null;
          if (pre) {
            widgets[index - 1] = widgets[index];
            widgets[index] = pre;
          }
          break;
        } else if (widgets[index].children.length > 0) {
          find(widgets[index].children);
        }
      }
    };
    find(this.getBlockWidgetsForIndex());
  }
  onRemove(item: ProductWidget) {
    const find = (widgets: ProductWidget[]) => {
      for (let index = 0; index < widgets.length; index++) {
        if (widgets[index].id == item.id) {
          widgets.splice(index, 1);
          break;
        } else if (widgets[index].children.length > 0) {
          find(widgets[index].children);
        }
      }
    };
    find(this.getBlockWidgetsForIndex());
  }

  pack(widget: Widget) {
    return iconPack(widget);
  }
}


@Component({
  selector: 'widget-item',
  template: `
    <div class="position-relative widget-container" *ngIf="product.widget.name !== 'group'">
      <div #container class="widget-{{product.widget.name}}">
        <nb-icon *ngIf="isMedia()" style="width: 100px; height: 100px" [pack]="pack()" [icon]="product.widget.icon"></nb-icon>
      </div>
    </div>
    <widget-group #groupComponent [widgets]="product.children" *ngIf="product.widget.name === 'group'" [parent]="this"></widget-group>
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
  ],
  standalone: false
})
export class WidgetItemComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('groupComponent') groupComponent: WidgetGroupComponent | undefined;
  @Input('product') product!: ProductWidget
  @Input('blockIndex') blockIndex: number = 0;
  @Input('index') index: number = 0;
  private subscribeChange: Subscription | undefined;
  @Input('pre') pre: WidgetItemComponent | undefined;

  @HostBinding('attr.id') get Id() {
    return this.product.id
  }
  @ViewChild('container', {read: ElementRef<HTMLDivElement>}) container!: ElementRef<HTMLDivElement>;

  constructor(protected http: HttpClient, protected ds: DomSanitizer, public parent: WidgetComponent) {
  }

  pack() {
    return iconPack(this.product.widget);
  }

  ngOnInit(): void {
    this.render(this.product.form.getRawValue());
    this.subscribeChange = this.product.form.valueChanges.subscribe(values => {
      this.render(values)
    });
  }

  addChildren(product: ProductWidget) {
    this.product.children.push(product);
  }

  private render(data: Record<string, any>) {
    data.name = this.product.widget.name;
    this.http.post<RenderedResponse>(WIDGET_RENDERED, data).subscribe(response => {
      if (response.output) {
        if (this.container) {
          this.container.nativeElement.innerHTML = response.output;
        } else if (this.groupComponent) {
          this.groupComponent.groupRenderClassName = response.output;
        }
      }
    });
  }

  ngAfterViewInit(): void {
  }
  isMedia() {
    return ['image', 'file', 'video', 'audio', 'cover', 'gallery'].includes(this.product.widget.name);
  }
  isGroup() {
    return this.product.name === 'group';
  }
  ngOnDestroy(): void {
    if (this.subscribeChange) {
      this.subscribeChange.unsubscribe();
    }
    this.subscribeChange = undefined;
  }
}

@Component({
  selector: 'widget-group',
  template: `
    <div class="op-widget-group" [className]="groupRenderClassName">
      <widget-item
        #widgetItemComponent
        tabindex="0"
        [class.selected]="product.selected"
        [id]="product.id"
        [product]="product"
        [blockIndex]="this.parent.blockIndex"
        [index]="ii"
        [pre]="parent"
        (focus)="this.parent.parent.selectorWidget(widgetItemComponent)"
        (blur)="this.parent.parent.unselectWidget($event)"
        *ngFor="let product of widgets; index as ii;"></widget-item>
    </div>
    <div class="d-flex flex-column py-5 px-3" *ngIf="widgets.length < 1">
      <button nbButton fullWidth status="basic"
              (nbPopoverShowStateChange)="this.parent.parent.quickToggle($event, this.parent.blockIndex)"
              [nbPopover]="this.parent.parent.quickInsertWidgetDialog"
              nbPopoverTrigger="click">
        <nb-icon icon="plus-outline"></nb-icon>
      </button>
    </div>
  `,
  standalone: false,
})
export class WidgetGroupComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('widgetItemComponent') widgetItems!: QueryList<WidgetItemComponent>;
  @Input('widgets') widgets: ProductWidget[] = [];
  @Input('parent') parent!: WidgetItemComponent;
  @Input('groupRenderClassName') groupRenderClassName: string = ""
  constructor(protected http: HttpClient, protected ds: DomSanitizer) {
  }
  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
  ngAfterViewInit(): void {
    this.widgetItems.changes.subscribe((res: QueryList<WidgetItemComponent>) => {
      this.parent.parent.selectorWidget(res.last)
    });
  }
}
