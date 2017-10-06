const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const argv = require('yargs');

import { PuppeteerExtension } from './../../puppeteer-extension/peppeteer-extension';


class KakaoPlus extends PuppeteerExtension {
    constructor() {
        super();
    }
    async main() {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        this.set( browser, page );

        await this.page.goto('https://www.philgo.com');
        await this.getTitle();
        await this.getHtmlTitle();

        await this.browser.close();
    }
    async getTitle() {
        console.log('title: ', await this.page.title() );
    }
    async getHtmlTitle() {
        const $html = await this.html();
        console.log('html title: ', $html.find('title').text())
    }
}

(new KakaoPlus()).main();
