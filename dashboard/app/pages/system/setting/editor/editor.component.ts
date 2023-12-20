import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {OnSpinner} from "../../../../@core/definition/common";
import {SITE_EDITOR, SITE_EDITOR_SAVE} from "../../../../@core/definition/system/api";
import {SPINNER} from "../../../../@core/interceptor/authorization";
import {Settings} from "angular2-smart-table/lib/lib/settings";
import {StyleConfig, StyleDefinition} from "@ckeditor/ckeditor5-style/src/styleconfig";
import {GeneralHtmlSupportConfig} from "@ckeditor/ckeditor5-html-support/src/generalhtmlsupportconfig";
import {MatcherObjectPattern} from "@ckeditor/ckeditor5-engine/src/view/matcher";

interface OptionKeyType {
  editor_markdown_support: boolean;
  editor_html_support: boolean;
  editor_html_embed_support: boolean;
  editor_html_rules: GeneralHtmlSupportConfig;
  editor_style_rules: StyleConfig
}

interface SelfStyleDefinition extends Omit<StyleDefinition, 'classes'> {
  classes: string | Array<string>;
}

@Component({
  selector: 'app-site-editor',
  templateUrl: './editor.component.html',
  styles: []
})
export class EditorComponent implements OnInit, OnSpinner {
  option: OptionKeyType = {
    editor_html_support: false,
    editor_markdown_support: false,
    editor_html_embed_support: false,
    editor_html_rules: {
      disallow: [],
      allow: [],
      allowEmpty: [],
    },
    editor_style_rules: {
      definitions: [],
    }
  };
  submitted: boolean = false;

  settings: Settings = {
    actions: {
      columnTitle: '操作',
      add: true,
      edit: true,
      delete: true,
      position: 'right',

    },
    add: {
      sanitizer: {
        bypassHtml: true,
      },
      addButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="plus"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z"/></g></g></svg>',
      createButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="currentColor"><g data-name="Layer 2"><g data-name="checkmark"><rect width="24" height="24" opacity="0"/><path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z"/></g></g></svg>',
      cancelButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg>',
    },
    edit: {
      sanitizer: {
        bypassHtml: true,
      },
      editButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="edit-2"><rect width="24" height="24" opacity="0"/><path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z"/><path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z"/></g></g></svg>',
      saveButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="checkmark"><rect width="24" height="24" opacity="0"/><path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z"/></g></g></svg>',
      cancelButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg>',
    },
    delete: {
      sanitizer: {
        bypassHtml: true,
      },
      deleteButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  fill="currentColor"><g data-name="Layer 2"><g data-name="trash-2"><rect width="24" height="24" opacity="0"/><path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z"/><path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/><path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/></g></g></svg>',
    },
    columns: {
      name: {
        title: '标签名',
        isFilterable: false,
        width: '22.5%',
      },
      classes: {
        title: '类',
        isFilterable: false,
        width: '22.5%',
      },
      styles: {
        title: '样式',
        isFilterable: false,
        width: '22.5%',
      },
      attributes: {
        title: '属性',
        isFilterable: false,
        width: '22.5%',
      }
    }
  };
  htmlSource: MatcherObjectPattern[] = [];
  styleSource: SelfStyleDefinition[] = [];
  styleSettings: Settings = {
    actions: {
      columnTitle: '操作',
      add: true,
      edit: true,
      delete: true,
      position: 'right'
    },
    add: {
      sanitizer: {
        bypassHtml: true,
      },
      addButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="plus"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M19 11h-6V5a1 1 0 0 0-2 0v6H5a1 1 0 0 0 0 2h6v6a1 1 0 0 0 2 0v-6h6a1 1 0 0 0 0-2z"/></g></g></svg>',
      createButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="checkmark"><rect width="24" height="24" opacity="0"/><path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z"/></g></g></svg>',
      cancelButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg>',
    },
    edit: {
      sanitizer: {
        bypassHtml: true,
      },
      editButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="edit-2"><rect width="24" height="24" opacity="0"/><path d="M19 20H5a1 1 0 0 0 0 2h14a1 1 0 0 0 0-2z"/><path d="M5 18h.09l4.17-.38a2 2 0 0 0 1.21-.57l9-9a1.92 1.92 0 0 0-.07-2.71L16.66 2.6A2 2 0 0 0 14 2.53l-9 9a2 2 0 0 0-.57 1.21L4 16.91a1 1 0 0 0 .29.8A1 1 0 0 0 5 18zM15.27 4L18 6.73l-2 1.95L13.32 6zm-8.9 8.91L12 7.32l2.7 2.7-5.6 5.6-3 .28z"/></g></g></svg>',
      saveButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="checkmark"><rect width="24" height="24" opacity="0"/><path d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39 8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33z"/></g></g></svg>',
      cancelButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="close"><rect width="24" height="24" transform="rotate(180 12 12)" opacity="0"/><path d="M13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29-4.3 4.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l4.29-4.3 4.29 4.3a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42z"/></g></g></svg>',
    },
    delete: {
      sanitizer: {
        bypassHtml: true,
      },
      deleteButtonContent: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><g data-name="Layer 2"><g data-name="trash-2"><rect width="24" height="24" opacity="0"/><path d="M21 6h-5V4.33A2.42 2.42 0 0 0 13.5 2h-3A2.42 2.42 0 0 0 8 4.33V6H3a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8h1a1 1 0 0 0 0-2zM10 4.33c0-.16.21-.33.5-.33h3c.29 0 .5.17.5.33V6h-4zM18 19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V8h12z"/><path d="M9 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/><path d="M15 17a1 1 0 0 0 1-1v-4a1 1 0 0 0-2 0v4a1 1 0 0 0 1 1z"/></g></g></svg>',
    },
    columns: {
      name: {
        title: '名称',
        width: '30%',
        isFilterable: false,
      },
      element: {
        title: '标签',
        width: '30%',
        isFilterable: false,
      },
      classes: {
        title: '类名',
        width: '30%',
        isFilterable: false,
      }
    }
  }

  constructor(private readonly http: HttpClient,) {

  }

  ngOnInit(): void {
    this.http.get<OptionKeyType>(SITE_EDITOR).subscribe(res => {
      this.option = Object.assign(this.option, res);
      if (Array.isArray(this.option.editor_style_rules)) {
        this.option.editor_style_rules = {
          definitions: []
        };
      }
      if (Array.isArray(this.option.editor_html_rules)) {
        this.option.editor_html_rules = {
          allow: [], disallow: [], allowEmpty: []
        };
      }
      this.htmlSource = this.option.editor_html_rules.allow || [];
      this.styleSource = this.option.editor_style_rules.definitions || [];
    });
  }

  action($event: any) {
    if (this.htmlSource.length > 0) {
        this.option.editor_html_rules.allow = this.htmlSource.filter(item => typeof item.name === "string" && item.name.trim().length > 0);
    }
    if (this.styleSource.length > 0) {
        // @ts-ignore
      this.option.editor_style_rules.definitions =
          this.styleSource.filter(item => item.name && item.name.trim().length > 0).map(item => {
            if (typeof item.classes  === 'string') {
              item.classes = item.classes.split(" ");
            }
            return item;
          });
    }
    this.http.post(SITE_EDITOR_SAVE, this.option, {context: new HttpContext().set(SPINNER, this)}).subscribe();
  }

  onSpinner(spinner: boolean): void {
    this.submitted = spinner;
  }
}
