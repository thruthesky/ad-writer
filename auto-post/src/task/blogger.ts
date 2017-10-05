import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').string('category').argv;
const $ = require('cheerio')
import * as protocol from './../protocol';
import * as lib from '../auto-post-library'
import { getPost } from '../firebase';
declare var document;

if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

class Blogger extends Nightmare{
    private bloggerUrl = 'https://www.blogger.com'
    private post = null;

    private id = argv.id;
    private password = argv.password;
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main(){
        this.post = await getPost(argv.user, argv.key);
        if (this.post === null) protocol.end('fail', 'failed to get post from firebase');
        else protocol.send('got post from firebase');

        await this.login();
        await this.publish();

        // protocol.end('task done.')
    }
    /**
     * 
     * 
     * 
     */
    private async login(){
        await this.get( this.bloggerUrl + "/go/signin");
        protocol.send('Logging in..')
        await this.type( "#identifierId", this.id )
        await this.click("#identifierNext");

        await this.wait(3000);
        await this.insert( 'input[name="password"]', this.password );
        await this.click('#passwordNext');
        //Wait for login to finish
        let isLogin = await this.waitDisappear(`html:contains('Loading')`);
        if(!isLogin) protocol.end('Login failed script will end.');
        protocol.send("Login","Wait for login to finish");

    }

    private async publish(){
        

        protocol.send('Going to blog with id: ' + argv.category)
        let blogUrl = '/blogger.g?blogID=' + argv.category;
        
        let canClickNewPost = await this.waitAppear('a[href="#editor/src=sidebar"]');
        if ( !canClickNewPost ) protocol.end('Not properly logged in! check internet.');
        protocol.send('Going to publishing page: ' + this.bloggerUrl + blogUrl + '#editor/src=sidebar' )
        await this.get(this.bloggerUrl + blogUrl +'#editor/src=sidebar')
        
        //Check for elements for posting nicely
        protocol.send('Checking if possible to post.')
        let re = await this.waitAppear("#postingHtmlBox");
        if(!re) protocol.end('Cant find posting box! check internet');

        let canPost = await this.waitDisappear( `div:contains('Loading')` );
        if (!canPost ) protocol.end('Loading exceeds timeout! Check internet.');
        
        //Write the post with reference ID
        protocol.send('Writing post...')
        await this.type( ".titleField", this.post.title);
        await this.insert("#postingHtmlBox", this.post.content);
        await this.click('.OYKEW4D-U-i > .blogg-primary');
        protocol.send('Publishing')
        let isNotInPublishing = await this.waitAppear('.editPosts');
        if( !isNotInPublishing ) protocol.send("Exiting publishing page exceeds timeout! Check blog manually if properly posted.")
        protocol.send('Publising done');
    }

    private async checkBlog( content ){
        let selector = `div:contains('${content}')`;
        protocol.send('Checking if properly publised!')

        protocol.send('Visiting the Blog:' + argv.endpoint);
        await this.get(argv.endpoint);
        let re = await this.waitAppear(selector);
        if (!re) protocol.end('Post not found. Check it manually')
        protocol.send('Post Found!');

    }
}

let options = {
    show: argv.browser === 'true',
    x: 1000, y: 0, width: 800, height: 700,
    openDevTools: { mode: '' },
};
(new Blogger(options)).main();




// // imp  
// import * as protocol from './../protocol';
// import * as lib from './../auto-post-library';
// const puppeteer = require('puppeteer');
// const argv = require('yargs').string('category').argv;
// import { getPost } from '../firebase';



// const bloggerUrl = 'https://www.blogger.com'
// const waitTime = 6000;
// protocol.set(argv.pid);
// protocol.send('begin', (new Date).toLocaleTimeString());

// let browser = puppeteer.launch({ headless: argv.browser !== 'true' }).then(
//     async browser => { 
//         const post = await getPost(argv.user, argv.key);
//         if (post === null) protocol.end('fail', 'failed to get post from firebase');
//         else protocol.send('got post from firebase');
        
//         const page = await browser.newPage();
//         await login( page );
//         await publish( page, post );
//         await browser.close();

//     });

// /**
//  * 
//  * @param page 
//  *      - const page = browser.newPage()
//  */
// async function login( page ){
    
//     await page.goto( bloggerUrl + '/go/signin' );
//     let html = await lib.getPage( page );

//     await page.waitFor('#identifierId');
//     console.log('Enter username...')
//     await page.focus('#identifierId').catch(e => protocol.end('password focus failed'));
//     await page.type(argv.id).catch(e => protocol.end('password type failed'));
//     await page.press('Enter');
//     // await page.click('#identifierNext');

//     console.log('Enter password...')
//     await page.waitFor(waitTime);
//     await page.focus('input[name="password"]').catch(e => protocol.end('password focus failed'));
//     await page.type(argv.password).catch(e => protocol.end('password type failed'));
//     await page.press('Enter');
//     // await page.click('#passwordNext');
// }

// async function publish( page, post ){
    
//     await page.waitFor('a[href="#editor/src=sidebar"]')
//     let blog = '/blogger.g?blogID=' + argv.category;
//     await page.goto( bloggerUrl + blog +'#editor/src=sidebar');
//     await page.wait(waitTime);
//     await page.waitFor('#postingHtmlBox').catch( e => protocol.end('cant find #postingHtmlBox'));
//     await page.focus('#postingHtmlBox').catch( e => protocol.end("Error focusing on htmlbox"));
//     await page.type('post.content').catch( e => protocol.end("error typing on htmlbox"));
// }


