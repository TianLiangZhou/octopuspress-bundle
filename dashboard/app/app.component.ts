import {Component} from '@angular/core';
import {NbThemeService} from "@nebular/theme";
import {CookieService} from "ngx-cookie-service";
import {registerLocaleData} from "@angular/common";
import zh from "@angular/common/locales/zh";

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
  standalone: false,
})
export class AppComponent {
  constructor(
    private themeService: NbThemeService,
    private cookieService: CookieService,
  ) {
  }
  ngOnInit(): void {
    const theme = this.cookieService.get('theme');
    if (theme !== '' && theme !== 'default') {
      this.themeService.changeTheme(theme);
    }
    registerLocaleData(zh)
  }
}
