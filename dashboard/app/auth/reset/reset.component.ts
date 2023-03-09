import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {NB_AUTH_OPTIONS, NbAuthService, NbResetPasswordComponent} from "@nebular/auth";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html'
})
export class ResetComponent extends NbResetPasswordComponent implements OnInit {

  constructor(protected override service: NbAuthService,
              @Inject(NB_AUTH_OPTIONS) protected override options = {},
              protected override cd: ChangeDetectorRef,
              protected override router: Router,
              protected route: ActivatedRoute
  ) {
    super(service, options, cd, router);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.user.token = param.get('token')
    });

  }



}
