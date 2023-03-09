import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
// @ts-ignore
import ClassicEditor from '../../../ckeditor5/ckeditor';
import {ChangeEvent, CKEditor5} from '@ckeditor/ckeditor5-angular';
import {environment} from "../../../environments/environment";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'app-ckeditor',
  template: `
    <ckeditor (change)="dataChange($event)" [editor]="editor" (ready)="onReady($event)" [(ngModel)]="data" [config]="editorOptions"></ckeditor>
  `,
})
export class CkeditorComponent implements OnInit {
  @Input() data: string = '';
  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
  public editor: any = ClassicEditor;
  ckeditor: CKEditor5.Editor | undefined;

  editorOptions: Record<string, any> = {
    ui: {
      viewportOffset: {top: 77}
    },
    language: 'zh-cn',
    placeholder: "在这里撰写你的内容",
    removePlugins: ['Markdown'],
  };

  constructor(private themeService: NbThemeService) {
  }


  ngOnInit(): void {
    this.themeService.onThemeChange().subscribe(theme => {
      this.onLoadCkeditorOptions(theme.name);
    });
  }

  onReady(editor: CKEditor5.Editor) {
    this.ckeditor = editor;
  }


  public getData(): string {
    return this.ckeditor?.getData()!;
  }

  private onLoadCkeditorOptions(theme: string) {
    const ckfinderOptions = {
      ckfinder: {
        options: {
          skin: "jquery-mobile",
          swatch: theme === "dark" ? "b" : "a",
          themeCSS: "/ckfinder/libs/custom.jquery.mobile.dark.min.css",
        },
        uploadUrl: environment.gateway + '/media/ckfinder/connector?command=QuickUpload&type=Images&responseType=json',
      }
    };
    this.editorOptions = Object.assign(ckfinderOptions, this.editorOptions);
  }

  dataChange($event: ChangeEvent) {
    this.contentChange.emit($event.editor.getData());
  }
}
