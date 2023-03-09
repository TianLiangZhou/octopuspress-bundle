import { Component, OnInit } from '@angular/core';
import {NbRequestPasswordComponent} from "@nebular/auth";

@Component({
  selector: 'app-forgot',
  template: `
    <h1 id="title" class="title">忘记密码</h1>
    <p class="sub-title">输入您的电子邮件地址，我们将发送一个链接来重置您的密码</p>

    <nb-alert *ngIf="showMessages.error && errors?.length && !submitted" outline="danger" role="alert">
      <p class="alert-title"><b>Oh snap!</b></p>
      <ul class="alert-message-list">
        <li *ngFor="let error of errors" class="alert-message">{{ error }}</li>
      </ul>
    </nb-alert>

    <nb-alert *ngIf="showMessages.success && messages?.length && !submitted" outline="success" role="alert">
      <p class="alert-title"><b>Hooray!</b></p>
      <ul class="alert-message-list">
        <li *ngFor="let message of messages" class="alert-message">{{ message }}</li>
      </ul>
    </nb-alert>

    <form (ngSubmit)="requestPass()" #requestPassForm="ngForm" aria-labelledby="title">

      <div class="form-control-group">
        <label class="label" for="input-email">邮箱地址:</label>
        <input nbInput
               [(ngModel)]="user.email"
               #email="ngModel"
               id="input-email"
               name="email"
               pattern=".+@.+\\..+"
               placeholder="邮箱地址"
               autofocus
               fullWidth
               fieldSize="large"
               [status]="email.dirty ? (email.invalid  ? 'danger' : 'success') : 'basic'"
               [required]="getConfigValue('forms.validation.email.required')"
               [attr.aria-invalid]="email.invalid && email.touched ? true : null">
        <ng-container *ngIf="email.invalid && email.touched">
          <p class="caption status-danger" *ngIf="email.errors?.required">
            电子邮箱是必需的!
          </p>
          <p class="caption status-danger" *ngIf="email.errors?.pattern">
            电子邮箱应该是真实的!
          </p>
        </ng-container>
      </div>

      <button nbButton
              fullWidth
              status="primary"
              size="large"
              [disabled]="submitted || !requestPassForm.valid"
              [class.btn-pulse]="submitted">发送邮件</button>
    </form>

    <section class="sign-in-or-up" aria-label="Sign in or sign up">
      <p><a class="text-link" routerLink="../login">返回登录</a></p>
      <p><a routerLink="../register" class="text-link">注册</a></p>
    </section>
  `
})
export class ForgotComponent extends NbRequestPasswordComponent implements OnInit {
  ngOnInit(): void {
    this.user.dashboard = 1;
  }
}
