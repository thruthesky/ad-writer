import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../providers/app.service';

@Component({
    selector: 'naver-keyword-rank-monitor-page',
    templateUrl: 'naver-keyword-rank-monitor.html',
    styleUrls: ['./naver-keyword-rank-monitor.scss']
})

export class NaverKeywordRankMonitorPage implements OnInit, OnDestroy {

    naverDesktopKeywords = [];
    naverMobileKeywords = [];


    naverDesktopKeywordRanks = {}
    naverMobileKeywordRanks = {}

    child_added = [];

    settings;
    constructor(
        public app: AppService
    ) {

        this.displayRank();
    }


    ngOnInit() { }

    ngOnDestroy() {
        for (const on of this.child_added) {
            this.app.db.off('child_added', on);
        }
    }


    async displayRank() {
        this.settings = await this.app.loadSettings();
        await this.loadKeywords();

        for (const k of this.naverDesktopKeywords) {
            // console.log("Get rank for : ", k);
            const on = this.app.db.child('keyword-rank-naver').child('desktop').child(k)
                .limitToLast(1)
                .on('child_added', snap => {
                    let v = snap.val();
                    // console.log("Got data of ", k, v);
                    // this.isEmphasis(v);
                    this.naverDesktopKeywordRanks[k] = v;
                    this.app.render(200);
                });
            this.child_added.push(on);
        }



        for (const k of this.naverMobileKeywords) {
            console.log("Get mobile rank for : ", k);
            const on = this.app.db.child('keyword-rank-naver').child('mobile').child(k)
                .limitToLast(1)
                .on('child_added', snap => {
                    let v = snap.val();
                    console.log("Got data of mobile keyword: ", k, v);
                    // this.isEmphasis(v);
                    this.naverMobileKeywordRanks[k] = v;
                    this.app.render(200);
                });
            this.child_added.push(on);
        }


    }
    async loadKeywords() {
        console.log("loadKeywords() begin");
        await this.app.db.child('keyword/naver-kin-desktop').once('value', snap => {
            console.log("desktop");
            if (snap.val()) {
                this.naverDesktopKeywords = Object.keys(snap.val());
                // console.log(this.naverDesktopKeywords);
                this.app.render();
            }
        });
        await this.app.db.child('keyword/naver-kin-mobile').once('value', snap => {
            console.log("mobile");
            if (snap.val()) {
                this.naverMobileKeywords = Object.keys(snap.val());
                this.app.render();
            }
        });
        console.log("loadKeywords() end");
    }



    keys(obj) {
        return Object.keys(obj);
    }


    isEmphasis( name ) {
        if ( this.settings && this.settings.emphasis && name ) {
            const e = this.settings.emphasis;
            if ( e.first && name.indexOf(e.first) === 0 ) return 'first';
            if ( e.second && name.indexOf(e.second) === 0 ) return 'second';
            if ( e.third && name.indexOf(e.third) === 0 ) return 'third';
            if ( e.forth && name.indexOf(e.forth) === 0 ) return 'forth';
            if ( e.fifth && name.indexOf(e.fifth) === 0 ) return 'fifth';
        }
        return '';
    }

}
