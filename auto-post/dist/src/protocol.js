"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require('cheerio');
function set(pid) {
    exports.protocolName = pid;
}
exports.set = set;
function send(code, msg) {
    if (msg === void 0) { msg = ''; }
    console.log(exports.protocolName + "=" + code + ": " + msg);
}
exports.send = send;
function end(code, msg) {
    if (msg === void 0) { msg = ''; }
    send(code, msg);
    process.exit(0);
}
exports.end = end;
function error(code, msg) {
    if (msg === void 0) { msg = ''; }
    send(code, msg);
    process.exit(1);
}
exports.error = error;
function removeTags(post) {
    var pContents = [];
    var aHref = [];
    var p = $.load(post)('p');
    p.each(function (index, element) {
        $(this).find('a').remove();
        pContents[index] = $(this).text();
    });
    var a = $.load(post)('a');
    a.each(function (index, element) {
        aHref[index] = $(this).attr('href');
    });
    return pContents.join('\r\n') + '\r\n' + aHref.join('\r\n');
}
exports.removeTags = removeTags;
//# sourceMappingURL=protocol.js.map