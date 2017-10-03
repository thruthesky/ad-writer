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

export function removeTags( post : string, cheerio = require('cheerio') ) {

    let content = cheerio.load(post)('html').text();
    let imageUrl = cheerio.load(post)('img').attr('src');

    return content + '\r\n' +imageUrl;
}
