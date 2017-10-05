import * as protocol from './../protocol';
const argv = require('yargs').argv;
const puppeteer = require('puppeteer');
import { getPost } from '../firebase';


protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());

puppeteer.launch({ headless: argv.browser !== 'true' }).then(async browser => {

    const post = await getPost(argv.user, argv.key);
    if (post === null) protocol.end('fail', 'failed to get post from firebase');
    else protocol.send('got post from firebase');

    
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36");
    // await page.setUserAgent("Opera/9.80 (X11; Linux i686; Ubuntu/14.10) Presto/2.12.388 Version/12.16");
    await page.goto('http://www.tistory.com/');
    await page.click('.link_login');
    await page.waitFor('#loginId').then(a => protocol.send('open login page ok')).catch(e => protocol.end('failed to open login page'));

    await page.focus('#loginId');
    await page.type(argv.id);
    await page.focus('#loginPw').catch(e => protocol.end('password focus failed'));
    await page.type(argv.password).catch(e => protocol.end('password type failed'));
    await page.waitFor(2000);
    await page.click('button[type="submit"]')
        .then(a => protocol.send('login button clicked'))
        .catch(e => protocol.end('submit failed'));

    /// 로그인 검사. Check login.
    await page.waitFor('.gnb_tistory') // 
        .then(a => protocol.send('login ok'))
        .catch(async e => { // failed to login.
            await page.screenshot({path: 'tistory-screenshot.png'});
            await page.$('.tit_error')
                .then( a => protocol.end('failed to login. You may need authentication. see tistory screenshot.png'))
                .catch( e => protocol.end('failed to login. Unknown error. see tistory-screenshot.png'));
        });

    await page.goto('http://' + argv.category + '.tistory.com/admin/entry/post/?type=post&returnURL=/manage/posts/');
    await page.waitFor('.btn_provisionally').then(a => protocol.send('open write page ok')).catch(e => protocol.end('failed to open write page'));

    await page.click('#tx_switchertoggle');
    await page.waitFor(300);

    await page.click('.btn_public');
    await page.waitFor(300);

    await page.focus('#titleBox');
    await page.type(post.title);
    await page.waitFor(300);
    await page.focus('#tx_canvas_source');
    await page.type(post.content);
    await page.waitFor(500);

    await page.click('.btn_comm.btn_save');
    await page.waitFor('.tit_cont').then(a => protocol.end('success')).catch(e => protocol.end('failed after clicking post button'));

    await browser.close();
});



