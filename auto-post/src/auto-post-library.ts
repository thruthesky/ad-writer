const $ = require('cheerio');


/**
 * 
 * @param html - must be an HTML string.
 * 
 */
export function textify(html: string): string {
    let re = '';

    html = html.replace(/\r/g, '');
    html = html.replace(/\n/g, '');
    html = html.replace(/\s+/g, ' ');

    html = html.replace(/<p>/ig, '');
    html = html.replace(/<\/p>/ig, "\n");
    html = html.replace(/<div>/ig, '');
    html = html.replace(/<\/div>/ig, "\n");


    const $html = $.load(html)('body');



    re = $html.text();


    const $a = $html.find('a');
    let aDone = [];
    if ($a.length) {
        $a.each((i, e) => {
            const txt = $(e).text();
            if (aDone.indexOf(txt) !== -1) return;
            const url = $(e).prop('href');
            re = re.split(txt).join(`${txt} (${url}) `);
            aDone.push(txt);
        });
    }

    // console.log(aDone);

    return re;
}
/**
 * Returns time in year, month, date, hour, minutes, seconds(2017-10-6-17-24-58)
 */
export function timeStamp() {
    let date = new Date;
    return [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()].join('-');
}
