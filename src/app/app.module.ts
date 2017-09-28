import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';


import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppService } from './providers/app.service';
import { LanguageService } from './providers/language';


import { KeywordMonitoringPage } from './pages/keyword-monitoring/keyword-monitoring';
import { NaverKeywordRankMonitorPage } from './pages/naver-keyword-rank-monitor/naver-keyword-rank-monitor';
import { SettingsPage } from './pages/settings/settings';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KeywordMonitoringPage,
    NaverKeywordRankMonitorPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [ElectronService, AppService, LanguageService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
