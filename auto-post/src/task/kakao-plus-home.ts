const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const argv = require('yargs').argv
import * as protocol from './../protocol';



if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());



import { PuppeteerExtension } from './../../puppeteer-extension/peppeteer-extension';


class KakaoPlus extends PuppeteerExtension {
    constructor() {
        super();
    }
    async main() {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        this.set( browser, page );


        let url = "https://accounts.kakao.com/login?continue=https://center-pf.kakao.com/signup";
        await this.page.goto( url );
        let re = await this.waitAppear(['#recaptcha_area', '#email', 'input[name="email"]']);
        if ( re === -1 ) protocol.fail('login page open failed');
        else if ( re === 0 ) protocol.end('capture appeared');
        else protocol.send('login page open ok');


        /// 캡챠가 보여서 중단.
            
        await this.insert( '#email', argv.id );
        await this.insert('#password', argv.password);
        await this.page.click('#btn_login');
        protocol.send('login button clicked');

        // re = await this.waitAppear(['#error-message']);
        // if ( re === 0 ) {
        //     let $html = await this.html();
        //     console.log('login fail', $html.find('#error-message').text());
        // }

        await this.page.waitFor(1000);
        let b = await this.waitDisappear( '#email' );
        if ( b ) protocol.send('login ok');
        else {
            this.page.screenshot({path: 'kakao-plus-home-screenshot.png'});
            protocol.fail('fail to login');
        }

        re = await this.waitAppear(['.tit_plus']);
        if ( re !== 0 ) {
            this.page.screenshot({path: 'kakao-plus-home-screenshot.png'});
            protocol.fail('check screenshot.');
        }




        await this.page.waitFor(20000);
        await this.browser.close();
    }
    
}

(new KakaoPlus()).main();
