import {AfterViewInit, Component, OnInit} from '@angular/core';
import {OnSpinner, Package, Records, ResponseBody} from "../../../@core/definition/common";
import {PLUGIN_MARKET, PLUGIN_SETUP} from "../../../@core/definition/plugin/api";
import {HttpClient, HttpContext} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {NbSidebarService, NbToastrService} from "@nebular/theme";
import {timer} from "rxjs";
import {SPINNER} from "../../../@core/interceptor/authorization";

@Component({
  selector: 'app-plugin-market',
  templateUrl: './market.component.html',
  standalone: false,
})
export class MarketComponent implements OnInit, OnSpinner, AfterViewInit {
  plugins: Package[] = [];

  title: string = "";
  spinner: boolean = false;

  constructor(
    private http: HttpClient,
    private toast: NbToastrService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
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
    this.http.get<Records<Package>>(PLUGIN_MARKET).subscribe(res => {
      if (res.records.length > 0) {
        this.plugins = res.records
      }
    });
  }

  setup(name: string) {
    this.http.post<ResponseBody>(PLUGIN_SETUP, {name: name}, {context: new HttpContext().set(SPINNER, this)}).subscribe(res => {
      this.getPlugins();
    });
  }
}
