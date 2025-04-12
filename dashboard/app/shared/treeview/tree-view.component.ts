import {
  AfterViewInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {Mode, TreeViewItem, TreeViewOptions} from './tree-view';
import {ReplaySubject, Subject} from "rxjs";

@Component({
  selector: 'app-tree',
  templateUrl: './tree-view.component.html',
  standalone: false
})
export class TreeViewComponent implements OnInit, OnChanges {

  protected $options: ReplaySubject<TreeViewOptions> = new ReplaySubject<TreeViewOptions>()
  protected $items: Subject<any[]> = new Subject<any[]>()

  constructor() { }

  @Input() items: any[] = [];

  filterItems: TreeViewItem[] = [];

  private defaultOptions: TreeViewOptions = {
    textField: 'name',
    childrenField: 'children',
    valueField: 'path',
    mode: Mode.Checkbox,
    collapsed: true,
    checked: false,
  };

  @Input() options: TreeViewOptions = this.defaultOptions;

  @Output() selectedChange = new EventEmitter<any[]>();

  ngOnInit() {
    this.$options.subscribe(options => {
      this.options = Object.assign(this.defaultOptions, options);
    });
    this.$items.subscribe(items => {
      items.forEach(item => {
        this.rebuildItem(item, null);
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterItems = [];
    const items = changes['items']
    const options = changes['options'];
    if (options) {
      this.$options.next(options.currentValue);
    }
    if (items) {
      this.$items.next(items.currentValue);
    }
  }

  private rebuildItem(item: any, prevChildren: any) {
    const rebuildChildren: TreeViewItem[] = [];
    const rebuildItem: TreeViewItem = {
      name: item[this.options.textField!],
      value: item[this.options.valueField!],
      children: rebuildChildren,
      collapsed: typeof item.collapsed == "boolean"  ? item.collapsed : this.options.collapsed,
      checked: typeof item.checked == "boolean"
        ? item.checked
        : item.hasOwnProperty('checked') && item.checked === undefined ? undefined : this.options.checked,
    };
    const children = item[this.options.childrenField!];
    if (children && Array.isArray(children) && children.length > 0) {
      children.forEach((child: any) => {
        this.rebuildItem(child, rebuildChildren);
      });
    }
    if (prevChildren !== null) {
      prevChildren.push(rebuildItem);
    } else {
      this.filterItems.push(rebuildItem);
    }
  }

  onChildCheckedChange(item: TreeViewItem, $event: boolean) {
    const selection = this.getSelection();
    this.selectedChange.emit(selection.checkedItems);
  }

  private getSelection() {
    let checkedItems: TreeViewItem[] = [];
    let uncheckedItems: TreeViewItem[] = [];
    if (this.filterItems.length > 0) {
      const selection = this.concatSelection(this.filterItems, checkedItems, uncheckedItems);
      checkedItems = selection['checked'];
      uncheckedItems = selection['unchecked'];
    }
    return {
      checkedItems: checkedItems,
      uncheckedItems: uncheckedItems
    };
  }
  private concatSelection(items: TreeViewItem[], checked: TreeViewItem[], unchecked: TreeViewItem[]): { [k: string]: TreeViewItem[] } {
    for (const item of items) {
      if (item.checked || item.checked === undefined) {
        checked.push(item.value);
      } else {
        unchecked.push(item.value);
      }
      if (item.children.length > 0) {
        this.concatSelection(item.children, checked, unchecked);
      }
    }
    return {
      checked: checked,
      unchecked: unchecked
    };
  }
}

@Component({
  selector: 'app-tree-item',
  templateUrl: './tree-item.component.html',
  styleUrls: ['./tree-item.component.scss'],
  standalone: false
})
export class TreeViewItemComponent implements DoCheck, AfterViewInit, OnDestroy {

  @Input() item!: TreeViewItem | any;

  @Input() options!: TreeViewOptions;

  @Output() checkedChange = new EventEmitter<boolean>();

  ngAfterViewInit(): void {

  }

  ngDoCheck(): void {
  }

  ngOnDestroy(): void {
  }

  onCollapseExpand() {
    const children = this.item[this.options.childrenField!];
    if (Array.isArray(children) && children.length > 0) {
      this.item.collapsed = !this.item.collapsed;
    }

  }

  onCheckedChange(checked: boolean) {
    this.item.children.forEach((child: any) => {
      this.setCheckedRecursive(child, checked);
    });
    this.checkedChange.emit(checked);
  }


  onChildCheckedChange(child: any, checked: boolean) {
    let itemChecked: undefined | boolean | null = null;
    const children = this.item[this.options.childrenField!];
    if (Array.isArray(children) && children.length > 0) {
      for (const childItem of children) {
        if (itemChecked === null) {
          itemChecked = childItem.checked;
        } else if (itemChecked !== childItem.checked) {
          itemChecked = undefined;
          break;
        }
      }
      if (itemChecked === null) {
        itemChecked = false;
      }
      if (this.item.checked !== itemChecked) {
        this.item.checked = itemChecked;
      }
    }
    this.checkedChange.emit(checked);
  }

  get indeterminate(): boolean {
    return this.item!.checked === undefined;
  }

  private setCheckedRecursive(item: TreeViewItem, checked: boolean) {
    item.checked = checked;
    if (item.children.length > 0) {
      item.children.forEach((child) => {
        this.setCheckedRecursive(child, checked);
      });
    }
  }
}

