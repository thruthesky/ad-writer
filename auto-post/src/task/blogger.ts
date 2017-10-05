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
        await this.checkBlog( this.post.title );

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