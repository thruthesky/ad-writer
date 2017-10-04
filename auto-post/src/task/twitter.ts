import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').argv;
import * as protocol from './../protocol';
import { getPost } from '../firebase';

if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

class Twitter extends Nightmare{
    private twitterUrl = 'https://mobile.twitter.com'
    private post = null;

    private id = this.argv.id;
    private password = this.argv.password;

    //login
    loginPage = "/login"
    usernameField = 'input[name="session[username_or_email]"]';
    passwordField = 'input[name="session[password]"]';
    //posting
    mainTweetPage = this.argv.category;
    composeTweetPage = "/compose/tweet";
    composeTweetArea = 'textArea[placeholder="What\'s happening?"]';
    tweetButton = 'div[data-testid="tweet-button"]';

    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main(){
        this.post = await getPost(argv.user, argv.key);
        if (this.post === null) protocol.error('fail', 'failed to get post from firebase');
        else protocol.send('got post from firebase');
        await this.login();
        await this.publish();
        protocol.end('success', 'task finished');
    }

    async login() {
        await this.nextAction("Logging in..")
        await this.get( this.twitterUrl + this.loginPage );
        await this.insert( this.usernameField, this.id );
        await this.typeEnter( this.passwordField, this.password );
      
        await this.nextAction("Checking user log in...")
        let isLogin = await this.waitDisappear( this.passwordField );
        await (await isLogin) ? await protocol.send("Login","success")
                              : await protocol.error("Login",'failed')
    }

    async publish(){
        let postReference = this.generatePostId
        let selector = `div:contains('${postReference}')`
        let postThis = await protocol.removeTags(this.post.content) + '\r\n' + postReference;

        await protocol.send("Go to compose tweet page.");
        await this.get( this.twitterUrl + this.composeTweetPage );
        
        await protocol.send("Typing Tweet");
        await this.type( this.composeTweetArea, postThis );
        
        await protocol.send("Click tweet button.");
        await this.click( this.tweetButton );
        
        // await this.get( this.twitterUrl + '/' + this.mainTweetPage );
        await protocol.send("Checking if tweet is posted!");
        let isTweeted = await this.waitAppear( selector , 5);
        ( await isTweeted) ? await protocol.send("tweet",'success tweet found')
                                 : await protocol.error("tweet","Tweet not found!");
    
    }
}



let options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Twitter(options)).main();