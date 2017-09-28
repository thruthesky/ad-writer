import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { KeywordMonitoringPage } from './pages/keyword-monitoring/keyword-monitoring';
import { NaverKeywordRankMonitorPage } from './pages/naver-keyword-rank-monitor/naver-keyword-rank-monitor';
import { SettingsPage } from './pages/settings/settings';

const routes: Routes = [
    {
        path: 'keyword',
        component: KeywordMonitoringPage
    },
    {
        path: 'naver-keyword-rank-monitor',
        component: NaverKeywordRankMonitorPage
    },
    {
        path: 'settings',
        component: SettingsPage
    },
    {
        path: '',
        component: HomeComponent
    }
];


@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
