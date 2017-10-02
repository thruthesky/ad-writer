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


export const db = firebase.database().ref().child('adv');
export async function getPost(user, key) {
    const snap = await db.child('ad-write')
        .child(user)
        .child(key)
        .once('value');
    return snap.val();
}

