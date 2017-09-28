import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';


import { AppRoutingModule } from './app-routing.module';

import { ElectronService } from './providers/electron.service';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppService } from './providers/app.service';



import { KeywordMonitoringPage } from './pages/keyword-monitoring/keyword-monitoring';
import { NaverKeywordRankMonitorPage } from './pages/naver-keyword-rank-monitor/naver-keyword-rank-monitor';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    KeywordMonitoringPage,
    NaverKeywordRankMonitorPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [ElectronService, AppService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
