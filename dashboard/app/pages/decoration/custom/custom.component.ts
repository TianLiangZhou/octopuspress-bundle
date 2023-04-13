import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {THEME_CUSTOMIZE, THEME_CUSTOMIZED} from "../../../@core/definition/decoration/api";
import {CustomizeResponse, Section} from "../../../@core/definition/decoration/type";
import {OnSpinner} from "../../../@core/definition/common";
import {SPINNER} from "../../../@core/interceptor/authorization";
import {buildFormGroup, Control} from "../../../shared/control/type";
import {FormGroup} from "@angular/forms";
import {timer} from "rxjs";
import {NbSidebarService} from "@nebular/theme";

@Component({
  selector: 'app-theme-custom',
  templateUrl: './custom.component.html',
  styles: []
})
export class CustomComponent implements OnInit, OnSpinner{

  sections: Section[] = [];
  spinner: boolean = false;
  formGroup: FormGroup | undefined;
  theme: Record<string, any> = {};

  private data: Record<string, any> = {};
  private values: Record<string, any> = {};

  isChanged: boolean = false;

  constructor(
    private http: HttpClient,
    private sidebar: NbSidebarService,
  ) {

  }

  ngAfterViewInit(): void {
    timer(300).subscribe(val => {
      this.sidebar.toggle(true, 'menu-sidebar');
    });
  }

  ngOnInit(): void {
    this.http.get<CustomizeResponse>(THEME_CUSTOMIZE).subscribe(res => {
      const elements: Control[] = [];
      res.sections.forEach((item) => {
        elements.push(...item.controls);
      });
      this.formGroup = new FormGroup<any>(buildFormGroup(elements));
      for (let key in this.formGroup.controls) {
        this.values[key] = this.formGroup.controls[key].value;
      }
      this.formGroup.valueChanges.subscribe(values => {
        let isChanged = false;
        for (let key in values) {
          if (values[key] != this.values[key]) {
            this.data[key] = values[key] || null;
            isChanged = true;
          } else if (this.data.hasOwnProperty(key)) {
            delete this.data[key];
          }
        }
        this.isChanged = isChanged;
      });
      this.sections = res.sections;
      this.theme = res.theme;
    });

  }

  save($event: MouseEvent) {
    if (this.isChanged) {
      this.http.post(THEME_CUSTOMIZED, {'customized': this.data}, {context: new HttpContext().set(SPINNER, this)}).subscribe(() => {
        this.isChanged = false;
        for (const dataKey in this.data) {
          this.values[dataKey] = this.data[dataKey];
        }
      });
    }
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }
}
