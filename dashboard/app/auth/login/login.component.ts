import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {NB_AUTH_OPTIONS, NbAuthService, NbLoginComponent} from "@nebular/auth";
import {Router} from "@angular/router";
import {SharedService} from "../../@core/services/shared.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false
})
export class LoginComponent extends NbLoginComponent implements OnInit {
  constructor(protected override service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected override options = {},
              protected override cd: ChangeDetectorRef,
              protected override router: Router,
              protected sharedService: SharedService,
  ) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    this.service.onAuthenticationChange().subscribe(auth => {
      if (auth) {
        if (this.sharedService.lastPage) {
          this.router.navigate([this.sharedService.lastPage]).finally();
        } else {
          this.router.navigate(['/app/dashboard']).finally();
        }
      }
    });
    this.service.isAuthenticated().subscribe(isAuthenticated => {
      if (isAuthenticated) {
        if (this.sharedService.lastPage) {
          this.router.navigate([this.sharedService.lastPage]).finally();
        } else {
          this.router.navigate(['/app/dashboard']).finally();
        }
      }
    });
  }
}
