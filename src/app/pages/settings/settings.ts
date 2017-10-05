import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './../../providers/app.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';


@Component({
    selector: 'settings-page',
    templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit, OnDestroy {
    showKeywords = false;

    naverDesktopKeywords = '';
    naverMobileKeywords = '';

    naverDesktopMonitoringKeywords = '';
    naverMobileMonitoringKeywords = '';



    first;
    second;
    third;
    forth;
    fifth;

    typingEmphasis = new Subject<string>();
    typingCollectKeywords = new Subject<any>();
    typingMonitoringKeywords = new Subject<any>();


    showSiteFormBox = false;


    siteReference;
    siteValue;
    siteValueOn;
    siteInputValue;

    posting = {
        name: '',
        id: '',
        password: '',
        endpoint: '',
        category: '',
        site: ''
    };

    constructor(
        public app: AppService
    ) {
        this.loadKeywords();
        this.loadSettings();
        this.typings();

        this.siteReference = this.app.referenceSite();
        
        if ( this.siteReference ) {

            
            this.siteValueOn = this.siteReference.on('value', snap => {
                const v = snap.val();
                
                if ( v ) {
                    this.siteValue = [];
                    for ( const x of Object.keys(v) ) {
                        this.siteValue.push( { key: x, value: v[x] } );
                    }
                }
            });
        }
        else {
            
        }
        

        // setTimeout(() => {
        //     this.showSiteFormBox = true;
        //     this.posting.name = "Testing";
        //     this.posting.site = 'blogapi';
        //     this.posting.id = 'idbd';
        //     this.posting.password = 'passwordblogapi';
        //     this.posting.category = '1';
        //     this.posting.endpoint = "https://www.sonub.com/xmlrpc.php";
        //     this.onSubmitSiteAdd();
        // }, 500);
    }

    ngOnInit() { }
    ngOnDestroy() {
        if ( this.siteReference ) this.siteReference.off('value', this.siteValueOn);
    }


    typings() {
        this.typingEmphasis
            .debounceTime(500)
            .subscribe(data => {
                this.app.db.child('users').child(this.app.userId).child('emphasis').update(data);
            });

        this.typingCollectKeywords
            .debounceTime(500)
            .subscribe(async data => {
                if (!data['value']) return;
                const keys = data['value'].split(',');
                if (!keys) return;
                await this.app.db.child('keyword').child(data['path']).set(null);
                for (const key of keys) {
                    if (!key) continue;
                    console.log('key: ', key);
                    this.app.db.child('keyword').child(data['path']).child(key).set(true);
                }
            });

        this.typingMonitoringKeywords
            .debounceTime(500)
            .subscribe(data => {
                this.app.db.child('users').child(this.app.userId).child('naver-monitoring-keywords').update(data)
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

    async loadSettings() {

        // const snap = await this.app.db.child('users').child(this.app.userId).once('value');
        // const v = snap.val();
        const v = await this.app.loadSettings();
        if (!v) return;
        if (v['emphasis']) {
            const e = v['emphasis'];
            this.first = e['first'] ? e['first'] : '';
            this.second = e['second'] ? e['second'] : '';
            this.third = e['third'] ? e['third'] : '';
            this.forth = e['forth'] ? e['forth'] : '';
            this.fifth = e['fifth'] ? e['fifth'] : '';
        }

        if ( v['naver-monitoring-keywords'] ) {
            if ( v['naver-monitoring-keywords']['desktop'] ) this.naverDesktopMonitoringKeywords = v['naver-monitoring-keywords']['desktop'];
            if ( v['naver-monitoring-keywords']['mobile'] ) this.naverMobileMonitoringKeywords = v['naver-monitoring-keywords']['mobile'];
        }
        
    }

    async onSubmitSiteAdd() {
        if ( this.posting.site !== 'blogapi' ) this.posting.endpoint = '';
        console.log("onSubmitSiteAdd() ... ", this.posting);
        if ( this.posting['old_site'] ) {
            await this.siteReference.child(this.posting['old_site']).set( null );
            delete this.posting['old_site'];
        }
        await this.siteReference.child(this.posting.name).set( this.posting );
        this.posting.name = '';
        this.posting.site = '';
        this.posting.id = '';
        this.posting.password = '';
        this.posting.category = '';
        this.posting.endpoint = '';
    }

    onClickSiteDelete( key ) {
        let re = confirm("Do you want to delete - " + key + '?');
        if ( re ) this.siteReference.child(key).set(null);
    }

    async onClickSiteEdit( key ) {
        this.posting.endpoint = '';
        const snap = await this.siteReference.child(key).once('value');
        console.log(snap.val());
        this.showSiteFormBox = true;
        const v = snap.val();
        this.posting.site = v.site;

        this.posting['old_site'] = v.name;

        this.posting.name = v.name;
        this.posting.id = v.id;
        this.posting.password = v.password;
        this.posting.category = v.category;
        if ( v.endpoint ) this.posting.endpoint = v.endpoint;
    }

}
