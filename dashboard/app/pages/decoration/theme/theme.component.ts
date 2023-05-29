import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {OnSpinner, Package, Records, ResponseBody} from "../../../@core/definition/common";
import {
  THEME_ACTIVATE,
  THEME_DELETE,
  THEME_UPGRADE,
  THEME_UPLOAD,
  THEMES
} from "../../../@core/definition/decoration/api";
import {DomSanitizer} from "@angular/platform-browser";
import {DialogRef} from "@angular/cdk/dialog";
import {NbDialogService, NbSidebarService, NbToastrService} from "@nebular/theme";
import {timer} from "rxjs";
import {SPINNER} from "../../../@core/interceptor/authorization";

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
})
export class ThemeComponent implements OnInit, OnSpinner, AfterViewInit {

  themes: Package[] = [];

  title: string = "";

  spinner: boolean = false;

  constructor(
    private http: HttpClient,
    private toast: NbToastrService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public dialog: NbDialogService,
    private sidebar: NbSidebarService,
  ) {

  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  ngOnInit(): void {
    this.getThemes();
    this.route.data.subscribe((data) => {
      this.title = data['title'];
    });
  }

  private getThemes() {
    this.http.get<Records<Package>>(THEMES).subscribe(res => {
      if (res.records.length > 0) {
        this.themes = res.records
      }
    });
  }

  activate(name: string) {
    this.http.post<ResponseBody>(THEME_ACTIVATE, {name: name}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getThemes();
    });
  }

  upgrade(name: string) {
    this.http.post<ResponseBody>(THEME_UPGRADE, {name: name}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getThemes();
    });
  }

  upload(files: string[]) {
    if (files.length < 1) {
      this.toast.danger('上传的主题文件为空', '上传主题');
      return ;
    }
    this.http.post<ResponseBody>(THEME_UPLOAD, {uri: files.pop()}).subscribe(res => {
      this.getThemes()
    });
  }


  openDownload(url: string, ref: DialogRef) {
    let isMatch = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url);
    if (!isMatch) {
      this.toast.danger('不合法的url链接', '上传主题');
      return
    }
    this.http.post<ResponseBody>(THEME_UPLOAD, {uri: url}).subscribe(res => {
      ref.close();
    });
  }



  delete(name: string) {
    this.http.post<ResponseBody>(THEME_DELETE, {name: name},{context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getThemes()
    });
  }

  ngAfterViewInit(): void {
    timer(0).subscribe(val => {
      this.sidebar.getSidebarState('menu-sidebar').subscribe(state => {
        if (state !== 'compacted') {
          this.sidebar.compact('menu-sidebar');
        }
      });
    });
  }
}
