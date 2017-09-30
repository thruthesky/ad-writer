import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
import { db } from '../firebase';
import * as protocol from './../protocol';


class Sonub extends Nightmare {
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {
        protocol.set('sonub', this.argv.category);

        let date = this.date('Y-m-d H:i:s');
        protocol.send('begin', "posting begins at: " + date);

        const snap = await db.child('ad-write')
            .child(this.argv.user)
            .child(this.argv.key)
            .once('value');
        const post = snap.val();
        if (!post) protocol.end('get-firebase-data-fail:');
        else protocol.send('get-firebase-data-ok:');

        await this.get('https://www.sonub.com/user/login');
        await this.insert('#register_user_login', this.argv.id);
        await this.insert('#register_user_pass', this.argv.password);
        await this.click('.page-form-submit');

        const n = await this.waitSelectors(['.error', '.home-form-header']);

        if (n !== 1) protocol.end('login-fail');
        else protocol.send('login-ok');



        /// move to discussion forum
        await this.click('#header-menu-icon');
        await this.wait('#menu-page-header');
        await this.click('#menu-community');
        await this.wait('#community-header');
        await this.click('#community-discussion-button');
        await this.wait('#post-list-discussion');



        // write
        await this.wait('#post-list-create-button');
        await this.click('#post-list-create-button');
        await this.click('.post-create-button');


        // await this.submit('.post-create-button');
        






        // protocol.end('end');


    }




}


let options = {
    show: true,
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Sonub(options)).main();

