import { Injectable, NgZone } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyBef-7XTu-LqgV-3KGYgx8T1lxuZ7TYgZk",
    authDomain: "sonub-e2b13.firebaseapp.com",
    databaseURL: "https://sonub-e2b13.firebaseio.com",
    projectId: "sonub-e2b13",
    storageBucket: "sonub-e2b13.appspot.com",
    messagingSenderId: "196351881945"
};
firebase.initializeApp(config);


import { LanguageService } from './language';
import { XapiService, UserService, ForumService, SERVER_ERROR_CODE } from './../../angular-xapi/angular-xapi-service.module';



@Injectable()
export class AppService {
    version = '0.10.3';
    db: firebase.database.Reference = null;

    constructor(
        private zone: NgZone,
        public ln: LanguageService,
        private router: Router,
        public user: UserService,
        public forum: ForumService,
        public xapi: XapiService
    ) {
        xapi.setServerUrl('https://www.sonub.com');
        this.db = firebase.database().ref('/').child('adv');
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) window.scrollTo(0, 0);
        });

        console.log("login: ", user.isLogin);
    }

    t(code, args?) {
        return this.ln.text(code, args);
    }


    render(timer = 10) {
        setTimeout(() => this.zone.run(() => { }), timer);
    }


    async loadSettings() {
        if ( this.userId ) {
            const snap = await this.db.child('users').child(this.userId).once('value');
            return snap.val();
        }
        else return null;
        
    }

    getMonitoringKeywords(v) {
        if (!v) return null;

        if (v['naver-monitoring-keywords']) {
            if (!v['naver-monitoring-keywords']['desktop'] && !v['naver-monitoring-keywords']['mobile']) return null;
            let re = {};
            if (v['naver-monitoring-keywords']['desktop']) re['desktop'] = v['naver-monitoring-keywords']['desktop'];
            if (v['naver-monitoring-keywords']['mobile']) re['mobile'] = v['naver-monitoring-keywords']['mobile'];
            return re;
        }
        else return null;

    }

    safeId(r: string): string {

        r = r.replace(/\./g, '_');
        r = r.replace(/\$/g, '_');
        r = r.replace(/\#/g, '_');
        r = r.replace(/\[/g, '_');
        r = r.replace(/\]/g, '_');
        r = r.replace(/\//g, '_');

        return r;

    }
    get userId(): string {
        return this.safeId(this.user.email);
    }



    // login or register
    login(id, password) {
        id = id + '@adwriter.com';
        this.user.login(id, password).subscribe(re => {
            console.log("user.login: success: re: ", re);
        }, e => {
            console.log("user.login: error: ", e);
            if (e.code === SERVER_ERROR_CODE.CODE_USER_NOT_FOUND_BY_THAT_EMAIL) {
                let data = {
                    user_login: id,
                    user_email: id,
                    user_pass: password
                };
                this.user.register(data).subscribe(re => {
                    console.log("user.login => user.register => success: re: ", re);
                }, reg => {
                    alert(reg.message);
                })
            }
            else {
                alert(e.message);
            }
        });
    }


    /// library
    /**
     * Truncate a string over a given length and add ellipsis if necessary
     * @param {string} str - string to be truncated
     * @param {integer} limit - max length of the string before truncating
     * @return {string} truncated string
     */
    truncate(str, limit) {
        return (str.length < limit) ? str : str.substring(0, limit) + '...';
    }






    referenceSite() {
        if ( this.userId ) return this.db.child('users').child(this.userId).child('sites');
        else return null;
    }




}
