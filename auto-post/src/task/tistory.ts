import * as protocol from './../protocol';
const argv = require('yargs').argv;
const puppeteer = require('puppeteer');
import { getPost } from '../firebase';


protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

puppeteer.launch({ headless: argv.browser !== 'true' }).then(async browser => {

    const post = await getPost(argv.user, argv.key);
    if (post === null) protocol.end('fail', 'failed to get post from firebase');
    else protocol.send('got post from firebase');

    const page = await browser.newPage();
    await page.goto('http://www.tistory.com/');
    await page.click('.link_login');
    await page.waitFor('#loginId').then(a => protocol.send('open login page ok')).catch(e => protocol.end('failed to open login page'));

    await page.focus('#loginId');
    await page.type(argv.id);
    await page.focus('#loginPw').catch(e => protocol.end('password focus failed'));
    await page.type(argv.password).catch(e => protocol.end('password type failed'));
    await page.waitFor(2000);
    await page.click('button[type="submit"]').catch(e => protocol.end('submit failed'));
    await page.waitFor('.profile_info').then(a => protocol.send('login ok')).catch(e => protocol.end('failed to login.'));

    await page.goto('http://' + argv.category + '.tistory.com/admin/entry/post/?type=post&returnURL=/manage/posts/');
    await page.waitFor('.btn_provisionally').then(a => protocol.send('open write page ok')).catch(e => protocol.end('failed to open write page'));

    await page.click('#tx_switchertoggle');
    await page.waitFor(300);

    await page.click('.btn_public');
    await page.waitFor(300);

    await page.focus('#titleBox');
    await page.type(post.title);
    await page.waitFor(300);
    await page.focus('#tx_canvas_source');
    await page.type(post.content);
    await page.waitFor(500);

    await page.click('.btn_comm.btn_save');
    await page.waitFor('.tit_cont').then(a => protocol.end('success')).catch(e => protocol.end('failed after clicking post button'));

    await browser.close();
});



/*
import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').argv;
import * as protocol from './../protocol';
import { getPost } from '../firebase';
const strip_tags = require('locutus/php/strings/strip_tags');

if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());


class TiStory extends Nightmare {

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

        await this.login();
        await this.openBlogEditor();
        await this.write();
    
    }
    async login() {
        await this.get('http://www.tistory.com/');
        await this.click('.link_login');
        // await this.wait('#loginId');
        // await this.click('.link_daumlogin');

        await this.wait('#loginId').then( a => protocol.send('open login page ok')).catch( e => protocol.end('failed to open login page') );
        await this.type('#loginId', argv.id)
        await this.type('#loginPw', argv.password);
        await this.click('button[type="submit"]');
        await this.wait('.profile_info').then( a => protocol.send('login ok')).catch( e => protocol.end('failed to login') );
    }
    async openBlogEditor() {
        await this.get('http://' + argv.category + '.tistory.com/admin/entry/post/?type=post&returnURL=/manage/posts/');
        await this.wait('.btn_provisionally').then( a => protocol.send('open write page ok')).catch( e => protocol.end('failed to open write page') );
    }
    async write() {
        
        await this.click('.tx-list');
        await this.wait(300);
        await this.click('.btn_public');
        await this.wait(300);
        await this.insert('#titleBox', this.post.title);
        await this.wait(300);
        await this.insert('#tx_canvas_source', this.post.content);
        await this.wait(500);

        

        

        let content = this.post.content;
        content = strip_tags( content );
        await this.insert('#contents', content);
        await this.wait(200);

        // await this.click('.btn_ok');
        // await this.wait('._postView').then( a => protocol.send('success') ).catch( e => protocol.end('failed after clicking post button'));

    }
}


let options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 900,
    openDevTools: { mode: '' },
};
(new TiStory(options)).main();

*/
