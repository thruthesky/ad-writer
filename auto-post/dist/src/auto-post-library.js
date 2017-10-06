"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var $ = require('cheerio');
function textify(html) {
    var re = '';
    html = html.replace(/\r/g, '');
    html = html.replace(/\n/g, '');
    html = html.replace(/\s+/g, ' ');
    html = html.replace(/<p>/ig, '');
    html = html.replace(/<\/p>/ig, "\n");
    html = html.replace(/<div>/ig, '');
    html = html.replace(/<\/div>/ig, "\n");
    var $html = $.load(html)('body');
    re = $html.text();
    var $a = $html.find('a');
    var aDone = [];
    if ($a.length) {
        $a.each(function (i, e) {
            var txt = $(e).text();
            if (aDone.indexOf(txt) !== -1)
                return;
            var url = $(e).prop('href');
            re = re.split(txt).join(txt + " (" + url + ") ");
            aDone.push(txt);
        });
    }
    return re;
}
exports.textify = textify;
function timeStamp() {
    var date = new Date;
    return [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].join('-');
}
exports.timeStamp = timeStamp;
//# sourceMappingURL=auto-post-library.js.map