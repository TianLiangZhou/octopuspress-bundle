import { Component, OnInit } from '@angular/core';
import {Records, ResponseBody} from "../../../@core/definition/common";
import {Plugin} from "../../../@core/definition/plugin/type";
import {PLUGIN_MARKET, PLUGIN_SETUP} from "../../../@core/definition/plugin/api";
import {HttpClient} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {DomSanitizer} from "@angular/platform-browser";
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'app-plugin-market',
  templateUrl: './market.component.html',
})
export class MarketComponent implements OnInit {
  plugins: Plugin[] = [];

  title: string = "";

  constructor(
    private http: HttpClient,
    private toast: NbToastrService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) {

  }
  ngOnInit(): void {
    this.getPlugins();
    this.route.data.subscribe((data) => {
      this.title = data['title'];
    });
  }

  private getPlugins() {
    this.http.get<Records<Plugin>>(PLUGIN_MARKET).subscribe(res => {
      if (res.records.length > 0) {
        this.plugins = res.records
      }
    });
  }

  setup(name: string) {
    this.http.post<ResponseBody>(PLUGIN_SETUP, {name: name}).subscribe(res => {
      this.getPlugins();
    });
  }
}
