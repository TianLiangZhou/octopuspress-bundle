import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from "../../@core/services/configuration.service";

@Component({
  selector: 'app-setting',
  template: `
    <nb-card>
      <nb-card-body>
        <nb-route-tabset [tabs]="tabs"></nb-route-tabset>
      </nb-card-body>
    </nb-card>
  `
})
export class SettingComponent implements OnInit {

  tabs: any[] = [
    {
      title: '常规',
      icon: 'settings',
      route: './',
    },
    {
      title: '内容',
      icon: 'file-text-outline',
      route: './content',
    },
    {
      title: "媒体",
      icon: "video-outline",
      route: "./media",
    },
    {
      title: "编辑器",
      icon: "edit-2-outline",
      route: "./editor",
    },
  ];

  constructor(private config: ConfigurationService) {
  }

  ngOnInit(): void {
    this.config.config.settingPages.forEach(item => {
      this.tabs.push({
        title: item.name,
        icon: 'options-2-outline',
        route: './general',
        queryParams: {page: item.path}
      })
    });
  }
}
