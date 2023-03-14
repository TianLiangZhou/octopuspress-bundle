import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NbAuthService} from '@nebular/auth';
import {NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService} from '@nebular/theme';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {User} from "../../../@core/definition/user/type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() position = 'normal';
  user: User | undefined;
  @Input() name = "default";
  @Input() url = "default";
  @Input() sidebarState!: "compacted" | "expanded";
  userMenu: {title: string, link: string}[] = [];
  themes = [
    {value: 'default', name: 'Light',},
    {value: 'dark', name: 'Dark',},
    {value: 'cosmic', name: 'Cosmic',},
    {value: 'corporate', name: 'Corporate',},
  ];

  currentTheme: string = "default";

  private destroy$: Subject<void> = new Subject<void>();

  userPictureOnly = false;

  constructor(private authService: NbAuthService,
              private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private breakpointService: NbMediaBreakpointsService,
              private cookieService: CookieService,
              ) {

  }


  ngOnInit() {
    this.authService.onTokenChange().subscribe(token => {
      if (token.isValid()) {
        this.user = token.getPayload();
        this.userMenu = [
          {title: '个人信息', link: "app/user/profile"},
          {title: '退出', link: 'auth/logout'}
        ];
      }
    });
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }


  toggleSidebar(): boolean {
    this.sidebarService.toggle(this.sidebarState == 'compacted' ? false : true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');

    return false;
  }

  goToHome() {
    window.open(this.url, '_blank')
  }

  goToDashboard() {
    this.menuService.navigateHome('main');
  }

  startSearch() {
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    const theme = this.cookieService.get('theme');
    if (theme !== themeName) {
      this.cookieService.set('theme', themeName);
    }
    this.themeService.changeTheme(themeName);
  }

}
