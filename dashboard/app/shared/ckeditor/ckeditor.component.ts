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
  };

  constructor(
    @Inject(APP_BASE_HREF) private baseHref:string,
    private themeService: NbThemeService,
    private config: ConfigurationService,
  ) {
  }


  ngOnInit(): void {
    if (!this.config.config.markdown) {
      this.editorOptions.removePlugins?.push('Markdown');
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
    // @ts-ignore
    this.contentChange.emit(editor.getData());
  }
}
