import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').argv;
import * as protocol from './../protocol';
import { getPost } from '../firebase';

if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());


class Philgo extends Nightmare {

    serverUrl = 'http://philgo.org';
    post = null;
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {

        /// get data from firebase
        this.post = await getPost(argv.user, argv.key);
        if (this.post === null) protocol.end('fail', 'failed to get post from firebase');
        else protocol.send('got post from firebase');

        /// post it
        await this.publish();
        
    }

    async publish() {

        await this.get( this.serverUrl + '/?module=member&action=login')
        await this.insert('.login_page_form input[name="id"]', argv.id);
        await this.insert('.login_page_form input[name="password"]', argv.password);
        await this.click('.login_page_form .submit');
        let re = await this.waitDisappear('.login_page_form');
        if ( re ) protocol.send('login-ok');
        else protocol.end('fail', 'login failed');
        

        await this.get( this.serverUrl + '?module=post&action=write&post_id=' + argv.category );


        await this.insert('input.subject', this.post.title);
        await this.insert('#content', this.post.content);
        await this.click('.post_write_submit');
        re = await this.waitAppear('.post_vote');
        if ( re ) protocol.end('success');
        else protocol.end('fail', 'failed after clicking post button');

    }
}


let options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Philgo(options)).main();
