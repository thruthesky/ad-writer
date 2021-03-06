import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').string('category').argv;
import * as protocol from './../protocol';
import * as lib from '../auto-post-library'
import * as path from 'path'
import { getPost } from '../firebase';
import * as fs from 'fs';


if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

class Twitter extends Nightmare{
    private twitterUrl = 'https://mobile.twitter.com'
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
        protocol.success();
    }

    private async login() {
        protocol.send("Logging in..")
            await this.get( this.twitterUrl + '/login' );
            await this.insert( 'input[name="session[username_or_email]"]', this.id );
            await this.typeEnter( 'input[name="session[password]"]', this.password );
      
        protocol.send("Checking user log in...");
            let isLogin = await this.waitDisappear( 'input[name="session[password]"]' );
            if (!isLogin) await this.captureError("Still in login page after timeout exceeds!")
        
        protocol.send('Waiting for link to compose tweet page.');
            let isLinkReady = await this.waitAppear(`a[href='/compose/tweet']`, 10);
            if ( !isLinkReady ) await this.captureError('Link not found after timeout!');
            protocol.send("Login", 'success');
    
    } // end of login()

    private async publish(){
        // shaping the post
        let content = this.post.title.trim() + '\n' + lib.textify(this.post.content.trim());
        let postThis = content.trim();

        protocol.send("Go to compose tweet page.");
            await this.get( this.twitterUrl + "/compose/tweet" );
            let canPost = await this.waitAppear('textArea[placeholder="What\'s happening?"]');
            if (!canPost) await this.captureError('Cant find tweet text area!');

        protocol.send("Compose Tweet");
            await this.insert( 'textArea[placeholder="What\'s happening?"]', postThis )

        protocol.send("Click tweet button.");
            await this.click( 'div[data-testid="tweet-button"]' );
            let isTweeted = await this.waitDisappear( 'textArea[placeholder="What\'s happening?"]', 5 );
            if ( !isTweeted ) await this.captureError('Composing tweet timeout exceeds!')
                 protocol.send("Click tweet button", 'Out of tweet page.'); 
        
        /**
         * Verify/Check if tweet is successful.
         */
        protocol.send('Waiting for articles.')
            let articleLoaded = await this.waitAppear('div[role="article"]');
            if ( !articleLoaded ) await this.captureError('Articles not properly loaded');
                protocol.send('Waiting for articles', 'Articles Found! Success')
       
        protocol.send(`Going to ${this.twitterUrl}/${argv.category}`)
            await this.get(`${this.twitterUrl}/${argv.category}`);
            let isProfileLoaded = await this.waitAppear(`div:contains('Edit profile')`);
            if ( !isProfileLoaded ) await this.captureError('Profile page not loaded properly.');
                protocol.send(`Going to ${this.twitterUrl}/${argv.category}`, `success Edit profile button found`)

        // checking for new tweet by first line of text.
        protocol.send("Verifying Tweet task...");
            let arr = postThis.split('\n')
            let selector = `span:contains('${arr[0].trim()}')`   
            let tweetFound = await this.waitAppear( selector , 5);
            if ( !tweetFound ) await this.captureError("Tweet not found");
                // protocol.send("Checking Tweet", 'Tweet found!');
            
    } // end of publish()

    /**
     * It captures the current screen state and fires 'protocol.end()' closing the script.
     * @param message 
     * @param filePath - where to save the captured image 
     * @param fileName - filename of the image.
     */
    private async captureError( message, filePath = path.join(__dirname, '..', 'screenshot'), fileName = lib.timeStamp() + '-twitter.png' ){
        
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
    
        await this.screenshot( path.join(filePath, fileName) );
        protocol.fail(message + 'Check screenshot at :' + path.join(filePath, fileName) );    

    }
}

let options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Twitter(options)).main();

