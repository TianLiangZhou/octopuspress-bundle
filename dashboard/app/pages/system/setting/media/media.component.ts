import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {OnSpinner, SiteAdOption} from "../../../../@core/definition/common";
import {SITE_MEDIA_SAVE, SITE_MEDIA} from "../../../../@core/definition/system/api";
import {SPINNER} from "../../../../@core/interceptor/authorization";

@Component({
  selector: 'app-site-media',
  templateUrl: './media.component.html',
  standalone: false,
})
export class MediaComponent implements OnInit, OnSpinner {
  option: Record<string, any> = {};
  submitted: boolean = false;
  constructor(private readonly http:HttpClient,) { }
  ngOnInit(): void {
    this.http.get<SiteAdOption>(SITE_MEDIA).subscribe(res => {
      this.option = res.option;
    });
  }
  action($event: any) {
    this.http.post(SITE_MEDIA_SAVE, this.option, {context: new HttpContext().set(SPINNER, this) }).subscribe();
  }

  onSpinner(spinner: boolean): void {
    this.submitted = spinner;
  }

  thumbnailCrop($event: boolean) {
    this.option.thumbnail_crop = $event ? 1 : 0;
  }
}
