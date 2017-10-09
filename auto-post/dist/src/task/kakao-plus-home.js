"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var puppeteer = require('puppeteer');
var cheerio = require('cheerio');
var argv = require('yargs').argv;
var protocol = require("./../protocol");
var firebase_1 = require("../firebase");
if (argv.pid === void 0) {
    console.log('no pid');
    process.exit(1);
}
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());
var peppeteer_extension_1 = require("./../../puppeteer-extension/peppeteer-extension");
var lib = require("./../auto-post-library");
var KakaoPlus = (function (_super) {
    __extends(KakaoPlus, _super);
    function KakaoPlus() {
        return _super.call(this) || this;
    }
    KakaoPlus.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var post, browser, page, url, re, b, $html, content, bool;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, firebase_1.getPost(argv.user, argv.key)];
                    case 1:
                        post = _a.sent();
                        if (post === null)
                            protocol.end('fail', 'failed to get post from firebase');
                        else
                            protocol.send('got post from firebase');
                        return [4, puppeteer.launch({ headless: argv.browser !== 'true' })];
                    case 2:
                        browser = _a.sent();
                        return [4, browser.newPage()];
                    case 3:
                        page = _a.sent();
                        this.set(browser, page);
                        this.chrome();
                        url = "https://accounts.kakao.com/login?continue=https://center-pf.kakao.com/signup";
                        return [4, this.page.goto(url)];
                    case 4:
                        _a.sent();
                        return [4, this.waitAppear(['#recaptcha_area', '#email', 'input[name="email"]'])];
                    case 5:
                        re = _a.sent();
                        if (re === -1)
                            protocol.fail('login page open failed');
                        else if (re === 0)
                            protocol.end('capture appeared');
                        else
                            protocol.send('login page open ok');
                        return [4, this.insert('#email', argv.id)];
                    case 6:
                        _a.sent();
                        return [4, this.insert('#password', argv.password)];
                    case 7:
                        _a.sent();
                        return [4, this.page.click('#btn_login')];
                    case 8:
                        _a.sent();
                        protocol.send('login button clicked');
                        return [4, this.page.waitFor(1000)];
                    case 9:
                        _a.sent();
                        return [4, this.waitDisappear('#email')];
                    case 10:
                        b = _a.sent();
                        if (b)
                            protocol.send('login ok');
                        else {
                            this.page.screenshot({ path: 'kakao-plus-home-screenshot.png' });
                            protocol.fail('fail to login');
                        }
                        return [4, this.waitAppear(['.tit_plus', '.desc_backup'])];
                    case 11:
                        re = _a.sent();
                        if (re === -1) {
                            this.page.screenshot({ path: 'kakao-plus-home-screenshot.png' });
                            protocol.fail('check screenshot.');
                        }
                        return [4, this.page.goto("https://center-pf.kakao.com/" + argv.category + "/posts")];
                    case 12:
                        _a.sent();
                        if (!post['url_preview']) return [3, 18];
                        return [4, this.page.waitFor('.tab_g').then(function (a) { return protocol.send('opening link tab'); }).catch(function (e) { return protocol.end('no openling link tab'); })];
                    case 13:
                        _a.sent();
                        return [4, this.page.click('.tab_g li:nth-child(3) button')];
                    case 14:
                        _a.sent();
                        return [4, this.page.waitFor('.outlink_write input').then(function (a) { return protocol.send('url preview box open ok'); }).catch(function (e) { return protocol.end('url preview box open end'); })];
                    case 15:
                        _a.sent();
                        return [4, this.insert('.outlink_write input', post['url_preview'])];
                    case 16:
                        _a.sent();
                        return [4, this.page.waitFor(5000)];
                    case 17:
                        _a.sent();
                        _a.label = 18;
                    case 18: return [4, this.html()];
                    case 19:
                        $html = _a.sent();
                        this.insert('.box_write .tit_tf input', post.title);
                        this.page.waitFor(500);
                        content = lib.textify(post.content);
                        this.insert('.box_write textarea', content);
                        this.page.waitFor(6000);
                        return [4, this.html()];
                    case 20:
                        $html = _a.sent();
                        if ($html.find('.btn_g2').length)
                            protocol.send('clicking post button');
                        else
                            protocol.end('cannot find post button');
                        this.page.click('.btn_g2');
                        this.page.waitFor(1000);
                        this.page.screenshot({ path: 'kakao-plus-home-after-click-button-screenshot.png' });
                        bool = this.waitDisappear('.btn_g2');
                        if (!bool) return [3, 22];
                        return [4, this.browser.close()];
                    case 21:
                        _a.sent();
                        protocol.success();
                        return [3, 24];
                    case 22:
                        this.page.screenshot({ path: 'kakao-plus-home-after-click-button-screenshot.png' });
                        return [4, this.browser.close()];
                    case 23:
                        _a.sent();
                        protocol.fail();
                        _a.label = 24;
                    case 24: return [4, this.page.waitFor(200000)];
                    case 25:
                        _a.sent();
                        return [4, this.browser.close()];
                    case 26:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    return KakaoPlus;
}(peppeteer_extension_1.PuppeteerExtension));
(new KakaoPlus()).main();
//# sourceMappingURL=kakao-plus-home.js.map