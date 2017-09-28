import { Injectable } from '@angular/core';
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

@Injectable()
export class AppService {
    login = false;
    user = {
        id: ''
    };
    db: firebase.database.Reference = null;
    constructor() {
        this.db = firebase.database().ref('/').child('adv');
    }
}

