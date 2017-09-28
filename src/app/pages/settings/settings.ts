import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';

@Component({
    selector: 'settings-page',
    templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {
    showKeywords = false;
    showNaverDesktop = false;
    naverDesktopKeywords = [];
    naverMobileKeywords = [];
    constructor(
        public app: AppService
    ) {
        this.loadKeywords();
    }

    ngOnInit() { }

    onInputKeyword(path) {
        console.log('path: ', path);
    }


    async loadKeywords() {

        this.app.db.child('keyword/naver-kin-desktop').once('value', snap => {
            if (snap.val()) {
                this.naverDesktopKeywords = Object.keys(snap.val());
                this.app.render();
            }
        });

        this.app.db.child('keyword/naver-kin-mobile').once('value', snap => {
            if (snap.val()) {
                this.naverMobileKeywords = Object.keys(snap.val());
                this.app.render();
            }
        });


    }
}
