import {Component, OnInit} from '@angular/core';
import {USER_CREATE_MEMBER, USER_MEMBER_PROFILE, USER_UPDATE_MEMBER} from '../../@core/definition/user/api';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnSpinner} from "../../@core/definition/common";
import {HttpClient, HttpContext} from "@angular/common/http";
import {ConfigurationService} from "../../@core/services/configuration.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Router} from "@angular/router";
import {SPINNER} from "../../@core/interceptor/authorization";
import {User} from "../../@core/definition/user/type";

@Component({
  selector: 'app-user-new',
  templateUrl: './new.component.html',
})
export class NewComponent implements OnInit, OnSpinner {
  formGroup: FormGroup = new FormGroup<any>({
    id: new FormControl<number>(0),
    account: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    nickname: new FormControl(''),
    url: new FormControl('', [Validators.pattern('')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]),
    roles: new FormControl<number[]>([]),
    meta: new FormGroup({}),
  });
  spinner: boolean = false;
  roles: {value: string, label: string}[] = [
    {value: '', label: '无'}
  ];

  controls = [];

  showPassword = true;

  route: ActivatedRouteSnapshot;


  constructor(private http: HttpClient,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private configService: ConfigurationService) {
      this.route = activatedRoute.snapshot;
  }

  ngOnInit(): void {
    this.roles.push(...this.configService.roles());
    this.activatedRoute.paramMap.subscribe(map => {
      if (!map.has('id')) {
        return ;
      }
      let id = parseInt(map.get('id') || '0', 10);
      if (isNaN(id) || id < 1) {
        this.router.navigateByUrl("/app/user").then();
        return ;
      }
      this.http.get<User>(USER_MEMBER_PROFILE, {params: {id: id}}).subscribe(response => {
        this.buildEditorForm(response);
      });
    });
  }

  onSpinner(spinner: boolean): void {
    this.spinner = spinner;
  }

  onSubmit($event: any) {
    const body = this.formGroup.getRawValue();
    let url = USER_CREATE_MEMBER;
    if (body.id > 0) {
      url = USER_UPDATE_MEMBER;
    }
    this.http.post(url, body, {
      context: new HttpContext().set(SPINNER, this)
    }).subscribe(response => {
      this.router.navigateByUrl("/app/user").then();
    });
  }
  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  get metaGroup() {
    return this.formGroup.controls['meta'] as FormGroup;
  }

  private buildEditorForm(user: User) {
    this.formGroup.controls['password'].removeValidators(Validators.required);
    this.formGroup.controls['account'].disable();
    this.formGroup.patchValue({
      id: user.id,
      account: user.account,
      nickname: user.nickname,
      email: user.email,
      url: user.url,
      password: user.password,
      roles: user.roles,
      meta: user.meta
    });
  }
}
