
import { MyNightmare as Nightmare } from './../../nightmare/nightmare';
const argv = require('yargs').argv;
import * as protocol from './../protocol';
import { getPost } from '../firebase';
const strip_tags = require('locutus/php/strings/strip_tags');

if ( argv.pid === void 0 ) { console.log('no pid'); process.exit(1); }
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());


class NaverBlog extends Nightmare {

    post = null;
    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main() {

        /// get data from firebase
        this.post = await getPost(argv.user, argv.key);
        if (this.post === null) protocol.end('fail', 'failed to get post from firebase');
        else protocol.send('got post from firebase');

        /// post it
        await this.publish();
        
    }

    async publish() {

        await this.login();
        await this.openBlogEditor();
        await this.write();
    
    }
    async login() {
        await this.get('https://m.naver.com/aside/');
        await this.click('.user_name.user_logoff');
        await this.wait('#frmNIDLogin').then(a => protocol.send('open login page')).catch( e => protocol.end('failed to open login page') );
        await this.type('#id', argv.id);
        await this.type('#pw', argv.password);
        await this.click('#frmNIDLogin input[type="submit"]');
        let re = await this.waitSelectors(['#ext_profile', '_btn_reset']);
        if ( re === -1 ) protocol.end('login failed');
        else protocol.send('login success');
    }
    async openBlogEditor() {
        // await this.get('http://blog.editor.naver.com/editor?targetCategory=1');
        await this.get('http://m.blog.naver.com/PostList.nhn?blogId=fulljebi&categoryNo=' + argv.category);
        let $html = await this.get('http://m.blog.naver.com/PostWriteForm.nhn?blogId=fulljebi');
        if ( $html.find('.btn_close2').length ) {
            await this.click('.btn_close2');
            await this.wait(200);
        } 
    }
    async write() {
        
        await this.insert('#subject', this.post.title);
        await this.wait(200);

        

        let content = this.post.content;
        content = strip_tags( content );
        await this.insert('#contents', content);
        await this.wait(200);

        // await this.click('.btn_ok');
        // await this.wait('._postView').then( a => protocol.send('success') ).catch( e => protocol.end('failed after clicking post button'));

    }
}


let options = {
    show: argv.browser === 'true',
    x: 1408, y: 0, width: 360, height: 900,
    openDevTools: { mode: '' },
};
(new NaverBlog(options)).main();

