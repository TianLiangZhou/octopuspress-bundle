import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {OnSpinner, Package, Records, ResponseBody} from "../../../@core/definition/common";
import {
  PLUGIN_ACTIVATE,
  PLUGIN_DOWN,
  PLUGIN_DEACTIVATE,
  PLUGIN_INSTALLED,
  PLUGIN_UPLOAD,
  PLUGIN_UPGRADE
} from "../../../@core/definition/plugin/api";
import {NbDialogService, NbSidebarService, NbToastrService} from "@nebular/theme";
import {DialogRef} from "@angular/cdk/dialog";
import {timer} from "rxjs";
import {SPINNER} from "../../../@core/interceptor/authorization";

@Component({
  selector: 'app-plugin-installed',
  templateUrl: './installed.component.html',
})
export class InstalledComponent implements OnInit, OnSpinner, AfterViewInit {

  plugins: Package[] = [];

  title: string = "";
  spinner: boolean = false;

  constructor(
    private http: HttpClient,
    private toast: NbToastrService,
    private route: ActivatedRoute,
    public dialog: NbDialogService,
    private sidebar: NbSidebarService,
  ) {

  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
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

  ngOnInit(): void {
    this.getPlugins();
    this.route.data.subscribe((data) => {
      this.title = data['title'];
    });
  }

  private getPlugins() {
    this.http.get<Records<Package>>(PLUGIN_INSTALLED).subscribe(res => {
      if (res.records.length > 0) {
        this.plugins = res.records
      }
    });
  }

  inactivate(name: string) {
    this.http.post<ResponseBody>(PLUGIN_DEACTIVATE, {name: name}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getPlugins();
    });
  }

  activate(name: string) {
    this.http.post<ResponseBody>(PLUGIN_ACTIVATE, {name: name}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getPlugins();
    });
  }

  upgrade(name: string) {
    this.http.post<ResponseBody>(PLUGIN_UPGRADE, {name: name}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getPlugins();
    });
  }

  upload(files: string[]) {
    if (files.length < 1) {
      this.toast.danger('上传的插件文件为空', '上传插件');
      return ;
    }
    this.http.post<ResponseBody>(PLUGIN_UPLOAD, {uri: files.pop()}).subscribe(res => {
      this.getPlugins()
    });
  }

  openDownload(url: string, ref: DialogRef) {
    let isMatch = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(url);
    if (!isMatch) {
      this.toast.danger( '不合法的url链接', '在线下载');
      return
    }
    this.http.post<ResponseBody>(PLUGIN_UPLOAD, {uri: url}).subscribe(res => {
      ref.close();
      this.getPlugins()
    });
  }

  remove(alias: string) {
    this.http.post<ResponseBody>(PLUGIN_DOWN, {name: alias}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getPlugins()
    });
  }
}
