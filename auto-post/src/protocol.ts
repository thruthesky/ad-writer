
let $ = require('cheerio');
export let protocolName;

export function set(pid) {
    protocolName = pid;
}

export function send(code, msg = '') {
    console.log(`${protocolName}=${code}: ${msg}`);
}

export function end(code, msg = '') {
    send( code, msg );
    process.exit(0);
}

<<<<<<< HEAD
export function success() {
    end('success');
}

/**
 * Call this only when you terminate the script.
 * 
 * @param msg message
 * 
 * @code protocol.fail('message');
 * 
 */
export function fail(msg = '') {
    end( 'fail', msg );
}
=======
export function success(){
    end('success')
}
>>>>>>> 35589c1593b2017827a473e6eca928d81e0ba8fc
