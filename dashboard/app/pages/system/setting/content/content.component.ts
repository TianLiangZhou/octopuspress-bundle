import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpContext} from "@angular/common/http";
import {OnSpinner, Records, SiteContentOption} from "../../../../@core/definition/common";
import {SITE_CONTENT_SAVE, SITE_CONTENT} from "../../../../@core/definition/system/api";
import {SPINNER} from "../../../../@core/interceptor/authorization";
import {CATEGORIES} from "../../../../@core/definition/content/api";
import {TermTaxonomy} from "../../../../@core/definition/content/type";

@Component({
  selector: 'app-site-content',
  templateUrl: './content.component.html',
})
export class ContentComponent implements OnInit, OnSpinner {
  option: Record<string, any> = {};
  categories: TermTaxonomy[] = [];
  submitted: boolean = false;

  formats = [
    {alias: '', name: '标准'},
    {alias: 'aside', name: '日志'},
    {alias: 'chat', name: '聊天'},
    {alias: 'gallery', name: '相册'},
    {alias: 'link', name: '链接'},
    {alias: 'image', name: '图片'},
    {alias: 'quote', name: '引语'},
    {alias: 'status', name: '状态'},
    {alias: 'video', name: '视频'},
    {alias: 'audio', name: '音频'},
  ];

  permalinks = [
    {alias: 'post_permalink_normal', name: '朴素', example: '?p=123'},
    {alias: 'post_permalink_number', name: '数字型', example: '/p/123'},
    {alias: 'post_permalink_name', name: '文章名', example: '/sample-post'},
    {alias: 'post_permalink_date', name: '年月份和名称型', example: '/2022/09/sample-post'},
  ];

  constructor(private readonly http:HttpClient,) { }
  ngOnInit(): void {
    this.http.get<Records<TermTaxonomy>>(CATEGORIES).subscribe(res => {
      this.categories = res.records;
    });
    this.http.get<SiteContentOption>(SITE_CONTENT).subscribe(res => {
      this.option = res.option;
    });
  }
  action($event: any) {
    this.http.post(SITE_CONTENT_SAVE, this.option, {context: new HttpContext().set(SPINNER, this) }).subscribe();
  }

  onSpinner(spinner: boolean): void {
    this.submitted = spinner;
  }

  defaultCommentStatus($event: boolean) {
    this.option.default_comment_status = $event ? 'open' : '';
  }

  commentModeration($event: boolean) {
    this.option.comment_moderation = $event ? 'on' : 'off';
  }

  pageComment($event: boolean) {
    this.option.page_comments = $event ? 'on' : 'off';
  }
}
