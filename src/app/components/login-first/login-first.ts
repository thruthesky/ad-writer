import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';

@Component({
    selector: 'login-first-component',
    template: `
    <div *ngIf=" app.user.isLogout " class="alert alert-warning" role="alert">
    <h4 class="alert-heading">{{ app.t('login_please') }}</h4>
    <p>
      {{ app.t('login_please_desc') }}
    </p>
    <hr>
    <p class="mb-0">
      {{ app.t('ad_writer') }} {{ app.t('version') }} {{ app.version }}
    </p>
  </div>
  `
})

export class LoginFirstComponent implements OnInit {
    constructor(
        public app: AppService
    ) { }

    ngOnInit() { }
}