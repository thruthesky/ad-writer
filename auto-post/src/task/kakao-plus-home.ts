const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const argv = require('yargs').argv
import * as protocol from './../protocol';
import { getPost } from '../firebase';



if (argv.pid === void 0) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());



import { PuppeteerExtension } from './../../puppeteer-extension/peppeteer-extension';
import * as lib from './../auto-post-library';


class KakaoPlus extends PuppeteerExtension {
    constructor() {
        super();
    }
    async main() {

        const post = await getPost(argv.user, argv.key);
        if (post === null) protocol.end('fail', 'failed to get post from firebase');
        else protocol.send('got post from firebase');

    
        
        const browser = await puppeteer.launch({ headless: argv.browser !== 'true' });
        const page = await browser.newPage();
        this.set(browser, page);


        this.chrome();



        let url = "https://accounts.kakao.com/login?continue=https://center-pf.kakao.com/signup";
        await this.page.goto(url);
        let re = await this.waitAppear(['#recaptcha_area', '#email', 'input[name="email"]']);
        if (re === -1) protocol.fail('login page open failed');
        else if (re === 0) protocol.end('capture appeared');
        else protocol.send('login page open ok');


        /// 캡챠가 보이는 경우가 있음.

        await this.insert('#email', argv.id);
        await this.insert('#password', argv.password);
        await this.page.click('#btn_login');
        protocol.send('login button clicked');

        await this.page.waitFor(1000);
        let b = await this.waitDisappear('#email');
        if (b) protocol.send('login ok');
        else {
            this.page.screenshot({ path: 'kakao-plus-home-screenshot.png' });
            protocol.fail('fail to login');
        }

        re = await this.waitAppear(['.tit_plus', '.desc_backup']);
        if (re === -1) {
            this.page.screenshot({ path: 'kakao-plus-home-screenshot.png' });
            protocol.fail('check screenshot.');
        }

        await this.page.goto(`https://center-pf.kakao.com/${argv.category}/posts`);

        if ( post['url_preview'] ) {
            await this.page.waitFor('.tab_g').then( a => protocol.send('opening link tab') ).catch( e => protocol.end('no openling link tab'));
            await this.page.click('.tab_g li:nth-child(3) button');
            await this.page.waitFor('.outlink_write input').then( a => protocol.send('url preview box open ok') ).catch( e => protocol.end('url preview box open end') );
            await this.insert('.outlink_write input', post['url_preview']);
            await this.page.waitFor(5000);
        }



        let $html = await this.html();
        // console.log(".box_write .tit_tf input", $html.find('.box_write .tit_tf input').length);


        this.insert('.box_write .tit_tf input', post.title);
        this.page.waitFor(500);

        let content = lib.textify(post.content);
        this.insert('.box_write textarea', content);
        this.page.waitFor(6000);

        $html = await this.html();
        if ( $html.find('.btn_g2').length ) protocol.send('clicking post button');
        else protocol.end('cannot find post button');


        this.page.click('.btn_g2');

        this.page.waitFor(1000);
        this.page.screenshot({ path: 'kakao-plus-home-after-click-button-screenshot.png' });
        let bool = this.waitDisappear('.btn_g2');
        if ( bool ) {
            await this.browser.close();
            protocol.success();
        }
        else {
            this.page.screenshot({ path: 'kakao-plus-home-after-click-button-screenshot.png' });
            await this.browser.close();
            protocol.fail();
        }


        

        await this.page.waitFor(200000);
        await this.browser.close();
    }

}

(new KakaoPlus()).main();
