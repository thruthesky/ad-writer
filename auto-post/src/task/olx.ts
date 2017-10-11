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
        await this.login();
    }

    async login(){
        await this.get( this.olxUrl ).catch( e => this.captureError('Error opening the page.', this.olxUrl ) );
    }
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
(new Olx(options)).main();

