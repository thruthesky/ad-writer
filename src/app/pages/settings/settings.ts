import { Component, OnInit } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';


@Component({
    selector: 'settings-page',
    templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {
    showKeywords = false;

    naverDesktopKeywords = '';
    naverMobileKeywords = '';


    first;
    second;
    third;
    forth;
    fifth;

    typing = new Subject<string>();
    typingCollectKeywords = new Subject<string>();

    constructor(
        public app: AppService
    ) {
        this.loadKeywords();

        this.loadEmphasis();

        this.typings();

    }

    ngOnInit() { }


    typings() {
        this.typing
            .debounceTime(500)
            .subscribe(data => {
                this.app.db.child('keyword').child(this.app.user.id).child('emphasis').update(data);
            });

        this.typingCollectKeywords
            .debounceTime(500)
            .subscribe(async data => {
                if (!data['value']) return;
                const keys = data['value'].split(',');
                if ( ! keys ) return;
                await this.app.db.child('keyword').child(data['path']).set(null);
                for (const key of keys) {
                    if ( ! key ) continue;
                    console.log('key: ', key);
                    this.app.db.child('keyword').child(data['path']).child(key).set(true);
                }
            });
    }




    async loadKeywords() {
        this.app.db.child('keyword/naver-kin-desktop').once('value', snap => {
            if (snap.val()) {
                this.naverDesktopKeywords = Object.keys(snap.val()).join();
                this.app.render();
            }
        });
        this.app.db.child('keyword/naver-kin-mobile').once('value', snap => {
            if (snap.val()) {
                this.naverMobileKeywords = Object.keys(snap.val()).join();
                this.app.render();
            }
        });
    }

    loadEmphasis() {
        ///
        this.app.db.child('users').child(this.app.user.id).child('emphasis').once('value', snap => {
            // console.log(snap.val());
            if (snap.val()) {
                const v = snap.val();
                this.first = v['first'] ? v['first'] : '';
                this.second = v['second'] ? v['second'] : '';
                this.third = v['third'] ? v['third'] : '';
                this.forth = v['forth'] ? v['forth'] : '';
                this.fifth = v['fifth'] ? v['fifth'] : '';
            }
        });
    }


}
