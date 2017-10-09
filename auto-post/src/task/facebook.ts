import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
import { getPost } from '../firebase';
import * as path from 'path'
import * as protocol from './../protocol';
import * as lib from './../auto-post-library';
import * as fs from 'fs';

const argv = require('yargs').string('category').argv;

if (argv.pid === void 0) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

class Facebook extends Nightmare {

    private serverUrl = 'https://m.facebook.com'
    private post = null;

    private id = argv.id;
    private password = argv.password;

    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    /**
     * entry point of the script - It posts the content and the url of the image that is uploaded to sonub website.
     * 
     */
    async main() {
        //  get data from firebase        
        this.post = await getPost(argv.user, argv.key);
        if (this.post === null) protocol.end('fail', 'failed to get post from firebase');
        else protocol.send('got post from firebase');

        await this.login();
        await this.publish();

        protocol.success();
    }

    private async login() {
        let $html = await this.get(this.serverUrl);
        protocol.send('login', 'logging in...')
        await this.insert('input[name="email"]', this.id);
        await this.insert('input[name="pass"]', this.password);
        await this.enter('input[name="pass"]');

        let re = await this.waitDisappear('input[name="pass"]', 5);
        if (!re) this.captureError('Still in login page after timeout!.', );

        await this.get(this.serverUrl);

        let isLogin = await this.waitAppear(`a:contains('Logout')`, 5);
        if (!isLogin) await this.captureError('Failed login.')
        protocol.send('login', 'success');
    }
    /**
     * For publishing on facebook.
     */
    private async publish() {
        // shaping the post
        let content = this.post.title + '\n' + lib.textify(this.post.content);
        let postThis = content.trim();

        protocol.send('Opening Group: ', argv.category);
        await this.get(this.serverUrl + '/groups/' + this.argv.category);

        let isGroupOpen = await this.waitAppear('a[name=groupMenuBottom]', 5);
        if (!isGroupOpen) await this.captureError('captureError on opening group page.');
        protocol.send('Opening :' + argv.category, 'success!')

        protocol.send('checking post text area');
        let canPost = await this.waitAppear('textarea[name="xc_message"]');
        if (!canPost) await this.captureError('Cant find textarea to post.');
        protocol.send('checking post text area', 'text area found!')

        protocol.send('Typing the post: ', 'typing..');
        await this.insert('textarea[name="xc_message"]', postThis);
        await this.click('input[name="view_post"]');

        // Verify post if posted.
        // pending?
        protocol.send('Verify post if posted')
        let isPending = await this.waitAppear(`a:contains('1 post requiring approval')`, 5);
        if (isPending) protocol.end('post', 'Post pending.'); // or delete old and post another.
        // posted?
        let isPosted = await this.findPost(postThis);
        if (!isPosted) await this.captureError('Post not found.');
        protocol.send('Posting', 'success');
    }

    /**
     * Checks if a post exists in a span.( facebook usually put posts' text into span  )
     * @param query - string to find 
     */
    private async findPost(query: string) {
        let arr = query.trim().split('\n')
        let selector = `span:contains('${arr[0].trim()}')`; // cannot use for wait()
        let re = await this.waitAppear(selector);

        return re;
    }
    /**
     * It captures the current screen state and fires 'protocol.end()' closing the script.
     * @param message 
     * @param filePath - where to save the captured image 
     * @param fileName - filename of the image.
     */
    private async captureError( message, filePath = path.join(__dirname, '..', 'screenshot'), fileName = lib.timeStamp() + '-facebook.png' ){
        
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
(new Facebook(options)).main();

