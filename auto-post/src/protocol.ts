import { element } from 'protractor';
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

export function error(code, msg = ''){
    send( code, msg );
    process.exit(1);
}

export function removeTags( post : string, $ = require('cheerio') ) {
    let arr = [];
    let $html = $.load(post)('p');
    $html.each( function( i, element ){
        arr[i] = $(this).text();
    } );

    let siteUrl = $.load(post)('a').attr('href');

    return arr.join('\r\n') + siteUrl;
    // return  contents + '\r\n' + siteUrl;
//    console.log( contents + '\r\n' + siteUrl );
}


// removeTags( 
//     `
//     <h1>This is title</h1>
//     <p>
//     This is contents with link inside. <a href="https://www.sonub.com">click me</a>
//     </p>
//     `
//  )