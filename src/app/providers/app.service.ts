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

@Injectable()
export class AppService {
    version = '0.92';
    login = false;
    user = {
        id: ''
    };
    db: firebase.database.Reference = null;
    constructor(
        private zone: NgZone,
        public ln: LanguageService,
        private router: Router
    ) {
        this.db = firebase.database().ref('/').child('adv');
        this.checkLogin();

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) window.scrollTo(0, 0);
        });
    }

    t(code, args?) {
        return this.ln.text(code, args);
    }

    doLogin(id, password) {
        const userRef = this.db.child('users').child(id);
        userRef.once('value', snap => {
            if (snap.val()) {
                const val = snap.val();
                if (val['password'] === password) {
                    this.afterLogin(id);
                }
                else {
                    alert("Wrong password");
                }
            }
            else {
                userRef.set({ 'password': password }).then(a => {
                    this.afterLogin(id);
                })
            }
        });
    }
    doLogout() {
        this.user.id = '';
        this.login = false;
    }
    afterLogin(id) {
        this.login = true;
        this.user.id = id;
        localStorage.setItem('user.id', this.user.id);
        this.render();
    }
    checkLogin() {
        this.user.id = localStorage.getItem('user.id');
        console.log('this.user.id', this.user.id);
        if (this.user.id) {
            this.login = true;
            this.render();
        }
    }

    render(timer = 10) {
        setTimeout(() => this.zone.run(() => { }), timer);
    }


    async loadSettings() {
        const snap = await this.db.child('users').child(this.user.id).once('value');
        return snap.val();
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

}
