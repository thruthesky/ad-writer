
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

export function success(){
    end('success')
}