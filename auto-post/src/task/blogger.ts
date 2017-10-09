import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').string('category').argv;
const $ = require('cheerio')
import * as protocol from './../protocol';
import * as lib from '../auto-post-library';
import * as path from 'path';
import * as fs from 'fs';
import { getPost } from '../firebase';
declare var document;

if (argv.pid === void 0) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

class Blogger extends Nightmare {
    private bloggerUrl = 'https://www.blogger.com'
    private post = null;

    private id = argv.id;
    private password = argv.password;
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }


    async main() {
        this.post = await getPost(argv.user, argv.key);
        if (this.post === null) protocol.end('fail', 'failed to get post from firebase');
        else protocol.send('got post from firebase');

        await this.login();
        await this.publish();
        await this.checkBlog();

        protocol.success();
    }
    /**
     * 
     * 
     * 
     */
    private async login(){
        await this.get( this.bloggerUrl + "/go/signin");
        let canLogin = await this.waitAppear('#identifierId', 5)
        if ( !canLogin ) await this.captureError('Cannot find email field!');
        
        protocol.send('Logging in..')
            await this.type( "#identifierId", this.id )
            await this.click("#identifierNext");

            await this.wait(3000);
            await this.insert( 'input[name="password"]', this.password );
            await this.click('#passwordNext');
        
        protocol.send('Exiting login page.');
            let outOfLoginPage = await this.waitDisappear('#passwordNext', 10);
            if ( !outOfLoginPage ) await this.captureError('Login page timeout exceeds!');

        protocol.send('Completing login...')
            let isLogin = await this.waitDisappear(`html:contains('Loading')`);
            if ( !isLogin ) await this.captureError('Login failed script will end.');
            protocol.send("Login", "ok");

    }

    private async publish(){
        protocol.send('Publishing start on', argv.category)
            let blogUrl = '/blogger.g?blogID=' + argv.category;
        
        protocol.send('Verifying if app can go to editor.')
            let canClickNewPost = await this.waitAppear('a[href="#editor/src=sidebar"]');
            if ( !canClickNewPost ) await this.captureError('Cant find link for editor!');
        
        protocol.send('Going to editor:' + this.bloggerUrl + blogUrl + '#editor/src=sidebar' )
            await this.get(this.bloggerUrl + blogUrl + '#editor/src=sidebar')
        
        // Check for elements for posting nicely
        protocol.send('Looking for html box.')
            let re = await this.waitAppear("#postingHtmlBox", 10);
            if (!re) await this.captureError('Cant find posting box!');
            protocol.send('Looking for html box', 'Found!')
        
        protocol.send('Waiting for extra resources before writing')
            let canPost = await this.waitDisappear( `div:contains('Loading')` );
            if (!canPost ) protocol.end('Loading exceeds timeout! Check internet.');
        
        // Write the post with reference ID
        protocol.send('Writing post...');
            await this.type( ".titleField", this.post.title.trim());
            await this.insert("#postingHtmlBox", this.post.content.trim());
            await this.click('.OYKEW4D-U-i > .blogg-primary');

        protocol.send('Publishing..');
            let isNotInPublishing = await this.waitAppear('.editPosts');
            if ( !isNotInPublishing ) await this.captureError("Admin page exceeds timeout!");
            protocol.send('In admin page');
    }

    private async checkBlog(){
        let content = lib.textify(this.post.content);
        let arr = content.trim().split('\n')
        protocol.send('Check blog if post is successful');
        
        // first check for title
        protocol.send('Looking for title');
            let title = await this.waitAppear(`a:contains("${this.post.title}")`.trim(), 5);
            if (title) protocol.success();
            if (!title) protocol.send('Looking for title', 'Title not found!');
        
        protocol.send('Looking for first line of text.');
            let firstLineText = await this.waitAppear(`a:contains("${arr[0].trim()}")`, 5);
            if (!firstLineText) await this.captureError('Blog post not found.');
            protocol.send('Blog post found.')
    }   

    /**
     * It captures the current screen state and fires 'protocol.end()' closing the script.
     * @param message 
     * @param filePath - where to save the captured image 
     * @param fileName - filename of the image.
     */
    private async captureError( message, filePath = path.join(__dirname, '..', 'screenshot'), fileName = lib.timeStamp() + '-blogger.png' ){
        
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
        
        await this.screenshot( path.join(filePath, fileName) );
        protocol.end('fail', `${message} Check screenshot at (${filePath}/${fileName})`);    

    }

}

let options = {
    show: argv.browser === 'true',
    x: 1000, y: 0, width: 800, height: 700,
    openDevTools: { mode: '' },
};
(new Blogger(options)).main();

