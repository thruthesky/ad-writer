import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';

@Component({
    selector: 'naver-keyword-rank-monitor-page',
    templateUrl: 'naver-keyword-rank-monitor.html'
})

export class NaverKeywordRankMonitorPage implements OnInit {
    data;
    constructor(
        public app: AppService
    ) {
        app.db.child('kin').child('desktop').child('화상영어')
            .limitToLast(1)
            .on('child_added', snap => {
                console.log("got data");
                this.data = snap.val();
            });
    }

    ngOnInit() { }
}
