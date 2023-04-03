import {AfterViewInit, Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpContext} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {Observable, of, timer} from "rxjs";
import {debounceTime, distinctUntilChanged, filter, map, switchMap} from "rxjs/operators";
import {FormControl, FormGroup} from "@angular/forms";
import {OnSpinner, Records, ResponseBody} from "../../../@core/definition/common";
import {POSTS, TAXONOMIES} from "../../../@core/definition/content/api";
import {
  NAVIGATE,
  NAVIGATE_DELETE,
  NAVIGATE_SAVE,
  NAVIGATE_SAVE_LOCATION,
  NAVIGATE_STRUCTURE
} from "../../../@core/definition/decoration/api";
import {Post, TermTaxonomy} from "../../../@core/definition/content/type";
import {SPINNER} from "../../../@core/interceptor/authorization";
import {ConfigurationService} from "../../../@core/services/configuration.service";
import {NbSidebarService} from "@nebular/theme";

interface TreeNode {
  id?: number;
  nodeId: string;
  title: string;
  objectId?: number;
  url?: string
  children: TreeNode[];
  type: string,
  isExpanded?: boolean;
}

type CheckArticle = Post & { checked: boolean };
type CheckTermTaxonomy = TermTaxonomy & { checked: boolean };

type NavigateStructure = ResponseBody & {
  dataSet: Record<string, CheckArticle[] | CheckTermTaxonomy[]>,
  navigate: CheckTermTaxonomy[],
  themeNavigation: { alias: string, name: string }[],
  themeNavigationLocation: { [key: string]: number },
}

type Navigation = {
  id: number,
  name: string,
  nodes: TreeNode[],
  themeNavigationLocation?: { [key: string]: boolean },
};

type NavigationResponse = ResponseBody & {
  navigation: Navigation
};

interface DropInfo {
  targetId: string;
  action?: string;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavigationComponent implements OnInit, OnSpinner, AfterViewInit {
  private searchResult: Record<string, object|undefined> = {};
  navigate: TermTaxonomy[] = [];
  themeNavigation: { alias: string, name: string }[] = [];
  themeNavigationLocation: { [key: string]: number } = {};

  // ids for connected drop lists
  dropTargetIds: string[] = [];
  nodeLookup: { [key: string]: TreeNode } = {};
  dropActionTodo: DropInfo | undefined;
  submitted = false;

  custom = {
    link: "",
    title: "",
  }
  typeMapName: any = {
    'page': '页面',
    'post': '文章',
    'custom': '自定义链接',
    'category': '分类',
  };

  private defaultNode: TreeNode = {
    nodeId: 'demo',
    title: '示例1',
    type: 'custom',
    children: []
  };
  nav: Navigation = {
    id: 0,
    name: "",
    nodes: [
      this.defaultNode
    ],
    themeNavigationLocation: {},
  };
  searchGroups = new FormGroup<any>({});
  searchGroupResult: Record<string, Observable<Record<string, any>[]>> = {};
  accordionItems: Record<string, any>[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private config: ConfigurationService,
    protected sidebar: NbSidebarService,
  ) {
  }

  ngAfterViewInit(): void {
    timer(300).subscribe(val => {
      this.sidebar.toggle(true, 'menu-sidebar');
    });
  }

  onSpinner(spinner: boolean): void {
    this.submitted = spinner;
  }

  ngOnInit(): void {
    let taxonomySettings = this.config.taxonomies();
    let postTypeSettings = this.config.postTypes();
    let accordionItems = [];
    for (let key in postTypeSettings) {
      if (!postTypeSettings[key].visibility.showNavigation) {
        continue;
      }
      accordionItems.push({
        label: postTypeSettings[key].label,
        type: 'post',
        name: key,
        typeName: 'post_' + key,
        defaultOptions: [],
      });
      this.searchGroups.addControl('post_' + key, new FormControl<string>(''));
    }
    for (let key in taxonomySettings) {
      if (!taxonomySettings[key].visibility.showNavigation) {
        continue;
      }
      accordionItems.push({
        label: taxonomySettings[key].label,
        type: 'taxonomy',
        name: key,
        typeName: 'taxonomy_' + key,
        defaultOptions: [],
      });
      this.searchGroups.addControl('taxonomy_' + key, new FormControl<string>(''));
    }
    for (let accordionItem of accordionItems) {
      let control = this.searchGroups.controls[accordionItem.typeName];
      this.searchGroupResult[accordionItem.typeName] = control.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(500),
        filter((value) => !!value),
        switchMap(value => this.getObjects(value, accordionItem.name, accordionItem.type))
      )
    }
    this.accordionItems = accordionItems;
    this.http.get<NavigateStructure>(NAVIGATE_STRUCTURE).subscribe(res => {
      for (let dataSetKey in res.dataSet) {
        this.accordionItems.forEach(item => {
          if (item.typeName === dataSetKey) {
            item.defaultOptions = res.dataSet[dataSetKey];
          }
        });
      }
      this.themeNavigation = res.themeNavigation;
      this.themeNavigationLocation = res.themeNavigationLocation;
      this.navigate = res.navigate;
    });
    this.prepareDragDrop(this.nav.nodes);
  }

  editor() {
    this.http.get<NavigationResponse>(NAVIGATE, {params: {id: this.nav.id}}).subscribe(res => {
      this.nav = res.navigation;
      if (this.nav.nodes.length < 1) {
        this.nav.nodes.push(this.defaultNode);
      }
      this.nav.themeNavigationLocation = {};
      this.themeNavigation.forEach(item => {
        this.nav.themeNavigationLocation![item.alias] = this.themeNavigationLocation[item.alias] == this.nav.id;
      });
      this.prepareDragDrop(this.nav.nodes);
    });
  }

  prepareDragDrop(nodes: TreeNode[]) {
    nodes.forEach(node => {
      if (!this.dropTargetIds.includes(node.nodeId)) {
        this.dropTargetIds.push(node.nodeId);
      }
      this.nodeLookup[node.nodeId] = node;
      this.prepareDragDrop(node.children);
    });
  }


  // @debounce(50)
  dragMoved(evt: any) {
    of(evt).pipe(
      debounceTime(50)
    ).subscribe(event => {
      let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
      if (!e) {
        this.clearDragInfo();
        return;
      }
      let container = e.classList.contains("node-item") ? e : e.closest(".node-item");
      if (!container) {
        this.clearDragInfo();
        return;
      }
      this.dropActionTodo = {
        targetId: container.getAttribute("data-id") ?? ""
      };
      const targetRect = container.getBoundingClientRect();
      const oneThird = targetRect.height / 3;

      if (event.pointerPosition.y - targetRect.top < oneThird) {
        // before
        this.dropActionTodo["action"] = "before";
      } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
        // after
        this.dropActionTodo["action"] = "after";
      } else {
        // inside
        this.dropActionTodo["action"] = "inside";
      }
      this.showDragInfo();
    });
  }


  drop(event: any) {
    if (!this.dropActionTodo) return;
    const draggedItemId = event.item.data;
    const parentItemId = event.previousContainer.id;
    const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.nav.nodes, 'main');
    console.log(
      '\nmoving\n[' + draggedItemId + '] from list [' + parentItemId + ']',
      '\n[' + this.dropActionTodo.action + ']\n[' + this.dropActionTodo.targetId + '] from list [' + targetListId + ']');

    const draggedItem = this.nodeLookup[draggedItemId];

    const oldItemContainer = parentItemId != 'main' ? this.nodeLookup[parentItemId].children : this.nav.nodes;
    const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].children : this.nav.nodes;

    let i = oldItemContainer.findIndex((c: TreeNode) => c.nodeId === draggedItemId);
    oldItemContainer.splice(i, 1);

    switch (this.dropActionTodo.action) {
      case 'before':
      case 'after':
        const targetIndex = newContainer.findIndex((c: TreeNode) => c.nodeId === this.dropActionTodo?.targetId);
        if (this.dropActionTodo.action == 'before') {
          newContainer.splice(targetIndex, 0, draggedItem);
        } else {
          newContainer.splice(targetIndex + 1, 0, draggedItem);
        }
        break;

      case 'inside':
        this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem)
        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
        break;
    }

    this.clearDragInfo(true)
  }

  getParentNodeId(id: string, nodesToSearch: TreeNode[], parentId: string): string {
    for (let node of nodesToSearch) {
      if (node.nodeId == id) return parentId;
      let ret = this.getParentNodeId(id, node.children, node.nodeId);
      if (ret) return ret;
    }
    return "";
  }

  showDragInfo() {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      document.getElementById("node-" + this.dropActionTodo.targetId)?.classList.add("drop-" + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false) {
    if (dropped) {
      this.dropActionTodo = undefined;
    }
    this.document
      .querySelectorAll(".drop-before")
      .forEach(element => element.classList.remove("drop-before"));
    this.document
      .querySelectorAll(".drop-after")
      .forEach(element => element.classList.remove("drop-after"));
    this.document
      .querySelectorAll(".drop-inside")
      .forEach(element => element.classList.remove("drop-inside"));
  }

  delete() {
    if (window.confirm("确认删除菜单 [" + this.nav.name + "]吗？")) {
      this.http.post(NAVIGATE_DELETE, this.nav)
        .subscribe(_ => {
          this.create();
        });
    }
  }

  save() {
    this.http.post(NAVIGATE_SAVE, this.nav, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
    });
  }

  saveLocation() {
    this.http.post(NAVIGATE_SAVE_LOCATION, {location: this.themeNavigationLocation}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
    });
  }

  addToNav(type: string) {
    if (type === 'custom') {
      let id = "custom-" + this.custom.title;
      let node = {
        nodeId: id,
        title: this.custom.title,
        type: type,
        url: this.custom.link,
        children: [],
      }
      this.custom.title = "";
      this.custom.link = "";
      this.nav.nodes.push(node);
      this.dropTargetIds.push(id);
      this.nodeLookup[id] = node;
    } else {
      this.accordionItems.forEach(item => {
        if (item.typeName != type) {
          return ;
        }
        item.defaultOptions.forEach((option: any) => {
          if (option.checked) {
            this.selectedItem(option);
            option.checked = false;
          }
        });
      });
      if (this.searchResult[type]) {
        this.selectedItem(this.searchResult[type]);
        this.searchResult[type] = undefined;
        this.searchGroups.controls[type].setValue('');
      }
    }
  }

  private selectedItem(item: any) {
    let type = item.type || item.taxonomy;
    let nodeId = 'node-' + type + '-' + item.id;
    if (this.nodeLookup[nodeId] == undefined) {
      let node: TreeNode = {
        nodeId: nodeId,
        title: item.title || item.name,
        type: type,
        objectId: item.id,
        children: [],
      };
      this.nav.nodes.push(node);
      this.dropTargetIds.push(nodeId);
      this.nodeLookup[nodeId] = node;
    }
  }

  remove(id: any) {
    this.removeNode(id, this.nav.nodes);
    delete this.dropTargetIds[this.dropTargetIds.indexOf(id)];
    delete this.nodeLookup[id];
  }

  private removeNode(nodeId: string, nodes: TreeNode[]) {
    nodes.forEach((node, number) => {
      if (node.nodeId == nodeId) {
        nodes.splice(number, 1);
      } else if (node.children.length > 0) {
        this.removeNode(nodeId, node.children);
      }
    });
  }

  create() {
    this.nav = {
      id: 0,
      name: "",
      nodes: [
        this.defaultNode,
      ],
      themeNavigationLocation: {},
    };
    this.dropTargetIds = [];
    this.nodeLookup = {};
    this.prepareDragDrop(this.nav.nodes);
  }

  private getObjects(value: string, name: string, type: string): Observable<Record<string, any>[]> {
    switch (type) {
      case 'taxonomy':
        return this.http.get<Records<TermTaxonomy>>(TAXONOMIES, {
          params: {
            "taxonomy": name,
            "name": value,
            page: 1,
            size: 50
          }
        }).pipe(
          map(response => {
            return response.records;
          })
        );
      case 'post':
        return this.http.get<Records<Post>>(POSTS, {params: {"type": name, "title": value, page: 1, size: 50}}).pipe(
          map(response => {
            return response.records;
          })
        );
      default:
        return of([]);
    }
  }

  navigationLocation(alias: any) {
    console.log(alias);
  }


  displaySearch(option: any): string {
    if (typeof option === 'string') {
      return option;
    }
    return option.title || option.name;
  }

  selectSearchItem(typeName: string, $event: any) {
    this.searchResult[typeName] = $event;
  }

  disabled(typeName: any): boolean {
    let disabled = true;
    this.accordionItems.forEach(item => {
      item.defaultOptions.forEach((option: any) => {
        if (option.checked) {
          disabled = false;
        }
      });
    });
    if (this.searchResult[typeName]) {
      disabled = false;
    }
    return disabled;
  }
}
