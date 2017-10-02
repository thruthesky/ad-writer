import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { KeywordStatisticsPage } from './pages/keyword-statistics/keyword-statistics';
import { NaverKeywordRankMonitorPage } from './pages/naver-keyword-rank-monitor/naver-keyword-rank-monitor';
import { SettingsPage } from './pages/settings/settings';
import { WritePage } from './pages/write/write';

const routes: Routes = [
    {
        path: 'write',
        component: WritePage
    },
    {
        path: 'keyword',
        component: KeywordStatisticsPage
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
