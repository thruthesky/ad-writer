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
(new Blogger(options)).main();