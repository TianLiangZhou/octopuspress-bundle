import {
  AfterContentInit, AfterViewInit,
  Component, OnDestroy, OnInit,
} from '@angular/core';
import {DASHBOARD} from "../../@core/definition/dashboard/api";
import {Card, DASHBOARD_RESPONSE} from "../../@core/definition/dashboard/type";
import {HttpClient} from "@angular/common/http";
import {NbSidebarService, NbThemeService} from "@nebular/theme";
import {timer} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterContentInit {
  showLegend = true;
  showLabels = true;
  colorScheme: any;
  themeSubscription: any;

  card: Card[] = [];
  view: any = undefined;
  cards: Card[] = [];
  status: Card | undefined;

  constructor(private http: HttpClient,
              private theme: NbThemeService,
              private sidebar: NbSidebarService,
  ) {
  }

  ngAfterContentInit(): void {
    timer(0).subscribe(_ => {
      this.sidebar.getSidebarState('menu-sidebar').subscribe(state => {
        if (state !== 'compacted') {
          this.sidebar.compact('menu-sidebar');
        }
      });
      const elementsByClassName = document.getElementsByTagName('rect');
      for (const elementsByClassNameKey in elementsByClassName) {
        const element = elementsByClassName[elementsByClassNameKey];
        if (element.classList) {
          element.classList.remove('card');
        }
      }
    });
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
    this.http.get<DASHBOARD_RESPONSE>(DASHBOARD)
      .subscribe(body => {
        this.cards = body.cards;
        this.status = body.status;
      });
  }
}
