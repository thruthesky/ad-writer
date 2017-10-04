
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


// Gem's addition
export function error(code, msg = ''){
    send( code, msg );
    process.exit(1);
}

export function removeTags( post: string ) {
    let pContents = [];
    let aHref = [];
    
    let p = $.load(post)('p');
    p.each( function( index, element ){
        $(this).find('a').remove();
        pContents[index] = $(this).text()
    } );

    let a = $.load(post)('a');
    a.each( function( index, element ){
        aHref[index] = $(this).attr('href');
    } );

    return pContents.join('\r\n') + '\r\n' + aHref.join('\r\n');

}
