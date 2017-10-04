import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';



import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';


import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppService } from './providers/app.service';
import { LanguageService } from './providers/language';


import { KeywordStatisticsPage } from './pages/keyword-statistics/keyword-statistics';
import { NaverKeywordRankMonitorPage } from './pages/naver-keyword-rank-monitor/naver-keyword-rank-monitor';
import { SettingsPage } from './pages/settings/settings';
import { WritePage } from './pages/write/write';
import { SimpleTinyComponent } from './pages/write/simple-tiny';


import { AngularXapiServiceModule, XapiService } from '../angular-xapi/angular-xapi-service.module';
import { AngularXapiComponentsModule } from '../angular-xapi/angular-xapi-component.module';

import { LoginFirstComponent } from './components/login-first/login-first';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KeywordStatisticsPage,
    NaverKeywordRankMonitorPage,
    SettingsPage,
    WritePage,
    SimpleTinyComponent,
    LoginFirstComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    AngularXapiServiceModule,
    AngularXapiComponentsModule
  ],
  providers: [ElectronService, AppService, LanguageService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
  ) {
  }
}
