"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyBef-7XTu-LqgV-3KGYgx8T1lxuZ7TYgZk",
    authDomain: "sonub-e2b13.firebaseapp.com",
    databaseURL: "https://sonub-e2b13.firebaseio.com",
    projectId: "sonub-e2b13",
    storageBucket: "sonub-e2b13.appspot.com",
    messagingSenderId: "196351881945"
};
firebase.initializeApp(config);
exports.db = firebase.database().ref().child('adv');
//# sourceMappingURL=firebase.js.map