import {
  AfterContentInit,
  Component, OnDestroy, OnInit,
} from '@angular/core';
import {DASHBOARD} from "../../@core/definition/dashboard/api";
import {Card} from "../../@core/definition/dashboard/type";
import {HttpClient} from "@angular/common/http";
import {NbThemeService} from "@nebular/theme";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterContentInit {

  results = [
    {name: 'Germany', value: 8940, "series": [
        {
          "value": 5899,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 3476,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 3528,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 4009,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 4430,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
    {name: 'USA', value: 50, "series": [
        {
          "value": 589,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 376,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 328,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 9,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 30,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
    {name: 'France', value: 70, "series": [
        {
          "value": 58,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 347,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 352,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 409,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 40,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
    {name: 'France1', value: 7, "series": [
        {
          "value": 58,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 36,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 528,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 43,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 44,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
    {name: 'France2', value: 72, "series": [
        {
          "value": 58,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 76,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 28,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 49,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 43,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
    {name: 'France3', value: 212, "series": [
        {
          "value": 59,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 76,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 38,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 409,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 40,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
    {name: 'France4', value: 2121, "series": [
        {
          "value": 9,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 76,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 528,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 432,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 440,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
    {name: 'France5', value: 500, "series": [
        {
          "value": 599,
          "name": "2016-09-16T11:23:54.200Z"
        },
        {
          "value": 476,
          "name": "2016-09-15T17:36:51.788Z"
        },
        {
          "value": 528,
          "name": "2016-09-22T02:19:01.046Z"
        },
        {
          "value": 443,
          "name": "2016-09-19T06:20:44.689Z"
        },
        {
          "value": 430,
          "name": "2016-09-16T09:04:38.516Z"
        }
      ]},
  ];
  showLegend = true;
  showLabels = true;
  colorScheme: any;
  themeSubscription: any;


  card: Card[] = [];
  view: any = undefined;

  constructor(private http: HttpClient, private theme: NbThemeService) {
  }



  ngAfterContentInit(): void {
    setTimeout(() => {
      const elementsByClassName = document.getElementsByTagName('rect');
      for (const elementsByClassNameKey in elementsByClassName) {
        const element = elementsByClassName[elementsByClassNameKey];
        if (element.classList) {
          element.classList.remove('card');
        }
      }
    }, 500);
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      this.colorScheme = {
        domain: [
          colors.primaryLight,
          colors.infoLight,
          colors.successLight,
          colors.warningLight,
          colors.dangerLight,
          '#6366f1',
          '#8b5cf6',
          '#a855f7',
          '#d946ef',
          '#ec4899'
        ],
      };
    });
    this.http.get<Card[]>(DASHBOARD)
      .subscribe(body => {
        if (body != null && body.length > 0) {
          this.card = body
        }
      });
  }
}
