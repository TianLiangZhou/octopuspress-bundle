import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from "@angular/core";
import Editor from '../../../../ckeditor5/build/ckeditor';
import {ChangeEvent, CKEditorComponent} from '@ckeditor/ckeditor5-angular';
import {environment} from "../../../environments/environment";
import {NbThemeService} from "@nebular/theme";
import {APP_BASE_HREF} from "@angular/common";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {EditorConfig} from "@ckeditor/ckeditor5-core";

@Component({
  selector: 'app-ckeditor',
  template: `
    <ckeditor #editorComponent (change)="dataChange($event)" [editor]="editor" (ready)="onReady($event)" [(ngModel)]="data" [config]="editorOptions"></ckeditor>
  `,
})
export class CkeditorComponent implements OnInit {
  @ViewChild('editorComponent') editorComponent: CKEditorComponent | undefined;
  @Input() data: string = '';
  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
  public editor = Editor;

  editorOptions: EditorConfig = {
    ui: {
      viewportOffset: {top: 77}
    },
    language: 'zh-cn',
    placeholder: "在这里撰写你的内容",
    removePlugins: [],
    codeBlock: {
      languages: [
        { language: 'plaintext', label: 'Plain text' }, // The default language.
        { language: 'c', label: 'C' },
        { language: 'cs', label: 'C#' },
        { language: 'cpp', label: 'C++' },
        { language: 'css', label: 'CSS' },
        { language: 'diff', label: 'Diff' },
        { language: 'html', label: 'HTML' },
        { language: 'java', label: 'Java' },
        { language: 'javascript', label: 'JavaScript' },
        { language: 'php', label: 'PHP' },
        { language: 'python', label: 'Python' },
        { language: 'ruby', label: 'Ruby' },
        { language: 'typescript', label: 'TypeScript' },
        { language: 'xml', label: 'XML' },
        { language: 'bash', label: 'Bash' },
        { language: 'go', label: 'Golang' },
        { language: 'rust', label: 'Rust' },
        { language: 'yaml', label: 'Yaml' },
        { language: 'kotlin', label: 'Kotlin' },
        { language: 'csharp', label: 'C#' },
        { language: 'ini', label: 'INI' },
        { language: 'json', label: 'Json' },
        { language: 'nginx', label: 'Nginx' },
        { language: 'objectivec', label: 'Objective-C' },
        { language: 'perl', label: 'Perl' },
        { language: 'jsx', label: 'Jsx' },
        { language: 'scss', label: 'Scss' },
        { language: 'swift', label: 'Swift' },
        { language: 'aspnet', label: 'AspNet' },
        { language: 'docker', label: 'Docker' },
      ]
    },
    htmlSupport: {
      allow: [],
      disallow: [],
      allowEmpty: [],
    },
    style: {
      definitions: [],
    }
  };

  constructor(
    @Inject(APP_BASE_HREF) private baseHref:string,
    private themeService: NbThemeService,
    private config: ConfigurationService,
  ) {
  }


  ngOnInit(): void {
    if (!this.config.config.editorFeatures?.isMarkdownSupport) {
      this.editorOptions.removePlugins?.push('Markdown');
    }
    if (!this.config.config.editorFeatures?.isHtmlSupport) {
      this.editorOptions.removePlugins?.push('GeneralHtmlSupport');
    }
    if (!this.config.config.editorFeatures?.isHtmlEmbedSupport) {
      this.editorOptions.removePlugins?.push('HtmlEmbed');
    }
    if (this.config.config.editorFeatures?.htmlRules) {
      this.editorOptions.htmlSupport = this.config.config.editorFeatures?.htmlRules;
    }
    if (this.config.config.editorFeatures?.styleRules && this.config.config.editorFeatures.styleRules.definitions && this.config.config.editorFeatures.styleRules.definitions.length > 0) {
      this.editorOptions.style = this.config.config.editorFeatures.styleRules;
    } else {
      this.editorOptions.removePlugins?.push('Style');
    }
    this.themeService.onThemeChange().subscribe(theme => {
      this.onLoadCkeditorOptions(theme.name);
    });
  }

  onReady(editor: any) {

  }


  public getData(): string {
    return this.editorComponent?.data!;
  }

  private onLoadCkeditorOptions(theme: string) {
    const ckfinderOptions = {
      ckfinder: {
        options: {
          skin: "jquery-mobile",
          swatch: theme === "dark" ? "b" : "a",
          themeCSS: this.baseHref + "ckfinder/libs/custom.jquery.mobile.dark.min.css",
        },
        uploadUrl: environment.gateway + '/media/ckfinder/connector?command=QuickUpload&type=Images&responseType=json',
      }
    };
    this.editorOptions = Object.assign(ckfinderOptions, this.editorOptions);
  }

  dataChange({editor}: ChangeEvent) {
    this.contentChange.emit(editor.data.get());
  }
}
