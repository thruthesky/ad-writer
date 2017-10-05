import * as protocol from './../protocol';
const argv = require('yargs').argv;
const puppeteer = require('puppeteer');
import { getPost } from '../firebase';
// https://www.blogger.com/blogger.g?blogID=3804997078465626362#editor/src=sidebar

protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

puppeteer.launch({ headless: argv.browser !== 'true' }).then(async browser => {

    const post = await getPost(argv.user, argv.key);
    if (post === null) protocol.end('fail', 'failed to get post from firebase');
    else protocol.send('got post from firebase');


    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36");
    await page.goto('https://www.blogger.com/go/signin');


    
        await page.focus('input[type="email"]');
        await page.type( argv.id );
        await page.click( '#identifierNext' );
        await page.waitFor(300);
        await page.waitFor('input[type="password"]');
        
    await page.focus( 'input[type="password"]' );
    await page.type( argv.password )
    await page.click(this.passwordNextButton);

        
    // let canEnterPassword = await this.waitAppear(this.passwordField);
    // if (!canEnterPassword) return false;
    // await this.type(this.passwordField, this.password)
    //     .click(this.passwordNextButton);

});




/*
import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').argv;
const $ = require('cheerio');
import * as protocol from './../protocol';
import * as lib from '../auto-post-library'
import { getPost } from '../firebase';

if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

class Blogger extends Nightmare{
    private bloggerUrl = 'https://www.blogger.com'
    private post = null;

    private id = this.argv.id;
    private password = this.argv.password;
    
    loginPage = "/go/signin";
    usernameField = "#identifierId";
    identifierNextButton = "#identifierNext";
    passwordDiv ="#password";
    passwordField = 'input[name="password"]';
    passwordNextButton = '#passwordNext'

    //publish
    blogWritingPage = '#editor/src=sidebar'
    htmlBox = "#postingHtmlBox"
    htmlBoxWrapper = ".htmlBoxWrapper"
    composeBox = "#postingComposeBox"
    
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main(){
        console.log("Blogger bot starts.");
        await this.login();
        await this.publish();
    }
    private async login(){
        this.nextAction("Logging in..")
        await this.get( this.bloggerUrl + this.loginPage );
        this.nextAction("Input Name..")
        await this.type( this.usernameField, this.id )
                    .click(this.identifierNextButton);
        this.nextAction("Input Password..");
        let canEnterPassword = await this.waitAppear( this.passwordField );
        if( !canEnterPassword ) return false;
        await this.type( this.passwordField, this.password )
                    .click(this.passwordNextButton);
        
        this.nextAction("Checking user log in...")
        let isLogin = await this.waitDisappear( this.passwordField );
        // (isLogin) ? protocol.send("Login","success")
        //           : protocol.end("Login",'failed')
        (isLogin) ? console.log("Login success")
        : console.log("Login failed")
    }

    private async publish(){
        let html = await this.get(this.bloggerUrl + this.blogWritingPage)
        let re = await this.waitAppear(this.htmlBox);
        if (!re) console.log(re);
        await this.type(this.htmlBox, "Testing")
        console.log(re);
    }


}

let options = {
    show: argv.browser === 'true',
    x: 1000, y: 0, width: 800, height: 700,
    openDevTools: { mode: '' },
};
(new Blogger(options)).main()

*/

