import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
import { db } from '../firebase';
import * as protocol from './../protocol';


class Sonub extends Nightmare {
    url = 'https://www.sonub.com';
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {
        protocol.set(this.argv.pid);

        let date = this.date('Y-m-d H:i:s');
        protocol.send('begin', "posting begins at: " + date);

        const snap = await db.child('ad-write')
            .child(this.argv.user)
            .child(this.argv.key)
            .once('value');
        const post = snap.val();
        if (!post) protocol.end('get-firebase-data-fail:');
        else protocol.send('get-firebase-data-ok:');

        // console.log(post);

        await this.get( this.url + '/user/login' );
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
        await this.click('#community-' + this.argv.category + '-button');
        

        // await this.get( this.url + '/forum/' + this.argv.category );

        // write
        await this.wait('#post-list-create-button');
        await this.click('#post-list-create-button');


        await this.wait('[name="post_title"]');
        protocol.send('open-post-create-page-ok');

        await this.insert('[name="post_title"]', post.title);

        let content = post.content;

        await this.insert('[name="post_content"]', content);
        await this.click('.post-create-button');
        await this.waitDisappear('.post-create-button');
        protocol.end('success');


    }




}


let options = {
    show: false,
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Sonub(options)).main();

