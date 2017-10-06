import { async } from '@angular/core/testing';
import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').argv;
import * as protocol from './../protocol';
import * as lib from './../auto-post-library';

import { getPost } from '../firebase';

if (argv.pid === void 0) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());


class Facebook extends Nightmare {

    private serverUrl = 'https://m.facebook.com'
    private post = null;

    private id = this.argv.id;
    private password = this.argv.password;

    // m.facebook.com elements
    private loginButton = 'input[name="login"]';
    private usernameField = 'input[name="email"]';
    private passwordField = 'input[name="pass"]';
    private postTextArea = 'textarea[name="xc_message"]';
    private postButton = 'input[name="view_post"]';
    private groupPostWarn = `a:contains('${"1 post requiring approval"}')`;

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
        protocol.end('success', 'success');

    }

    private async login() {
        let $html = await this.get(this.serverUrl);
        await protocol.send('login', 'logging in...')
        await this.nextAction('Typing email and password.');
        await this.insert(this.usernameField, this.id);
        await this.insert(this.passwordField, this.password);
        await this.nextAction('Press enter to login.');
        await this.enter(this.passwordField);

        let re = await this.waitDisappear(this.passwordField);
        if (!re) protocol.end('login', 'failed');
        protocol.send('login', 'success');
        await this.wait('body');
    }
    /**
     * For publishing on facebook.
     */
    private async publish() {
        
        // shaping the post
        let postThis = this.post.title + '\r\n' + lib.textify(this.post.content);

        protocol.send('open forum: ' + this.argv.category, 'openning..')
        await this.get(this.serverUrl + '/groups/' + this.argv.category);

        protocol.send('checking post text area')
        await this.waitAppear(this.postTextArea);

        protocol.send('Typing the post: ', 'typing..');
        await this.insert(this.postTextArea, postThis)
            .click(this.postButton);

        // check if post is posted or pending
        let isPending = await this.waitAppear(this.groupPostWarn, 5);


        if (isPending) {
            protocol.send('post', 'Post pending.')
        }
        else {
            let arr = postThis.split("\n");
            let isPosted = await this.findPost( arr[0].trim() );
            (isPosted) ? protocol.send('post', 'ok')
                : protocol.end("post", 'Post has been submitted. Post is not pending. But post not found!');
        }
    }

    /**
     * Checks if a post exists in a span.( facebook usually put posts' text into span  )
     * @param query - string to find 
     */
    private async findPost(query: string) {
        let selector = `span:contains('${query}')`; // cannot use for wait()
        console.log('selector: ', selector);
        let $html = await this.getHtml();
        let re = await this.waitAppear(selector);

        return await re;
    }

}

let options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 700,
    openDevTools: { mode: '' },
};
(new Facebook(options)).main();
