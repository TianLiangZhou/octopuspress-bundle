import {Component, OnInit} from '@angular/core';

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
      route: './general',
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
    }
  ];

  ngOnInit(): void {

  }
}
