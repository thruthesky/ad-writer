
let $ = require('cheerio');
export let protocolName;

export function set(pid) {
    pid = pid.replace(/^"|"$/g, '');
    protocolName = pid;
}

export function send(code, msg = '') {
    console.log(`${protocolName}=${code}: ${msg}`);
}

export function end(code, msg = '') {
    send( code, msg );
    process.exit(0);
}

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
