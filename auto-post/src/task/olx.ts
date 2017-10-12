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

class Olx extends Nightmare {
    private olxUrl = 'https://www.olx.ph';
    private post = null;

    private id = argv.id;
    private password = argv.password;

    constructor(defaultOptions) {
        super(defaultOptions);
        this.firefox();
    }

    async main(){

        //  get data from firebase        
        // this.post = await getPost(argv.user, argv.key);
        // if (this.post === null) protocol.end('fail', 'failed to get post from firebase');
        // else protocol.send('got post from firebase');
    
    // Testing post object

    this.post = {
        title : 'This is title',
        content : `<p>This is the <strong>post</strong></p>`, // cannot be shorter than 40 characters
        price: `13400`,
        condition: '2nd hand'
    }

        await this.login();

        await this.publish();

        // protocol.success();
    }

    private async login() {
        await this.get( this.olxUrl + '/login' );
        
        protocol.send('Waiting to login...')
            let canLogin = await this.waitAppear('input[name="mobile"]', 5);
            if (!canLogin) await this.captureError(`Can't find mobile field.`);
        
        protocol.send('Clear fields.');
            await this.insert('input[name="mobile"]', '');
            await this.insert('input[name="password"]', '');
        protocol.send('Login..')
            await this.insert('input[name="mobile"]', this.id);
            await this.insert('input[name="password"]', this.password);
            await this.enter('input[name="password"]');

        protocol.send('Waiting for profile.');
            let isLogin = await this.waitAppear('.profile');
            if (!isLogin) await this.captureError('Profile not found.');
        
    }   

    private async publish() {

        protocol.send('Waiting for /ad/post link');
            let canPost = await this.waitAppear('a[href="/ad/post"]');
            if (!canPost) await this.captureError('Cant find link for /ad/post');
        
        protocol.send('Goto: ' + this.olxUrl + '/ad/post');
            await this.get(this.olxUrl + '/ad/post');

        protocol.send('Waiting for sell form.')    
            let canSell = await this.waitAppear('.sell-form');
            if (!canSell) await this.captureError('Cannot find sell form!');

        protocol.send('Posting for computer.');
            this.computers( this.post );

    }

    /**
     * It captures the current screen state and fires 'protocol.end()' closing the script.
     * @param message 
     * @param filePath - where to save the captured image 
     * @param fileName - filename of the image.
     */
    private async captureError( message, filePath = path.join(__dirname, '..', 'screenshot'), fileName = lib.timeStamp() + '-olx.png' ){
        
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
    
        await this.screenshot( path.join(filePath, fileName) );
        protocol.fail(message + 'Check screenshot at :' + path.join(filePath, fileName) );    

    }

    
    /**
     * Does posting under computers category.
     * @param post - an object that will contain inputs for computer()
     * computers inputs; 
        * title, 
        * category(required), 
        * condition(required),
        * price(required), 
        * description, 
        * location(required);
     */
    private async computers( post ) {
        // select category
        protocol.send('Selecting category');
        let category = argv.category.split('.');
        await this.click('#category-btn')                       .then(a => a).catch( e => this.captureError(e) );
        await this.click( '.category-' + category[0].trim() )   .then(a => a).catch( e => this.captureError(e) ); // main category
        await this.click( '.category-' + category[1].trim() )   .then(a => a).catch( e => this.captureError(e) ); // sub category

        // select item condition
        protocol.send('Selecting item condition');
        if( post.condition.indexOf('new') )  await this.select('#param_condition','1').then(a => a).catch( e => this.captureError(e) );;
        if( post.condition.indexOf('used') ) await this.select('#param_condition', '2').then(a => a).catch( e => this.captureError(e) );;
        if( post.condition.indexOf('2nd') )  await this.select('#param_condition', '2').then(a => a).catch( e => this.captureError(e) );;

        // input texts
        protocol.send('Typing into fields');
        await this.type('#title', post.title);
        await this.type('#param_price', post.price);
        await this.type('#description', lib.textify(post.content).trim());

        // get location
        protocol.send('Selecting location');
        await this.click('#location-btn')                     .then(a => a).catch( e => this.captureError(e) );
        await this.click('#location-1')                       .then(a => a).catch( e => this.captureError(e) ); // metro manila
        await this.click('#location-1')                       .then(a => a).catch( e => this.captureError(e) ); // manila
    
        protocol.send('Submit..')
        await this.click('.submit > div > .sell-button')            .then(a => a).catch( e => this.captureError(e) );
    }
}

let options = {
    show: argv.browser === 'true',
    x: 1072, y: 0, width: 850, height: 700,
    openDevTools: { mode: '' },
};
(new Olx(options)).main();

