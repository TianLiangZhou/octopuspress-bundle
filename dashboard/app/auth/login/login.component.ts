import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {NB_AUTH_OPTIONS, NbAuthService, NbLoginComponent} from "@nebular/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent extends NbLoginComponent implements OnInit {
  constructor(protected override service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected override options = {},
              protected override cd: ChangeDetectorRef,
              protected override router: Router) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    this.service.isAuthenticated().subscribe(b => {
      b && this.router.navigate(['/app']).finally();
    });
  }
}
