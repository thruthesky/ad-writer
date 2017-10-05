"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var protocol = require("./../protocol");
var argv = require('yargs').argv;
var puppeteer = require('puppeteer');
var firebase_1 = require("../firebase");
protocol.set(argv.pid);
protocol.send('begin', (new Date).toLocaleTimeString());
puppeteer.launch({ headless: argv.browser !== 'true' }).then(function (browser) { return __awaiter(_this, void 0, void 0, function () {
    var _this = this;
    var post, page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, firebase_1.getPost(argv.user, argv.key)];
            case 1:
                post = _a.sent();
                if (post === null)
                    protocol.end('fail', 'failed to get post from firebase');
                else
                    protocol.send('got post from firebase');
                return [4 /*yield*/, browser.newPage()];
            case 2:
                page = _a.sent();
                return [4 /*yield*/, page.setUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36")];
            case 3:
                _a.sent();
                return [4 /*yield*/, page.goto('http://www.tistory.com/')];
            case 4:
                _a.sent();
                return [4 /*yield*/, page.click('.link_login')];
            case 5:
                _a.sent();
                return [4 /*yield*/, page.waitFor('#loginId').then(function (a) { return protocol.send('open login page ok'); }).catch(function (e) { return protocol.end('failed to open login page'); })];
            case 6:
                _a.sent();
                return [4 /*yield*/, page.focus('#loginId')];
            case 7:
                _a.sent();
                return [4 /*yield*/, page.type(argv.id)];
            case 8:
                _a.sent();
                return [4 /*yield*/, page.focus('#loginPw').catch(function (e) { return protocol.end('password focus failed'); })];
            case 9:
                _a.sent();
                return [4 /*yield*/, page.type(argv.password).catch(function (e) { return protocol.end('password type failed'); })];
            case 10:
                _a.sent();
                return [4 /*yield*/, page.waitFor(2000)];
            case 11:
                _a.sent();
                return [4 /*yield*/, page.click('button[type="submit"]')
                        .then(function (a) { return protocol.send('login button clicked'); })
                        .catch(function (e) { return protocol.end('submit failed'); })];
            case 12:
                _a.sent();
                return [4 /*yield*/, page.waitFor('.gnb_tistory')
                        .then(function (a) { return protocol.send('login ok'); })
                        .catch(function (e) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, page.screenshot({ path: 'tistory-screenshot.png' })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, page.$('.tit_error')
                                            .then(function (a) { return protocol.end('failed to login. You may need authentication. see tistory screenshot.png'); })
                                            .catch(function (e) { return protocol.end('failed to login. Unknown error. see tistory-screenshot.png'); })];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 13:
                _a.sent();
                return [4 /*yield*/, page.goto('http://' + argv.category + '.tistory.com/admin/entry/post/?type=post&returnURL=/manage/posts/')];
            case 14:
                _a.sent();
                return [4 /*yield*/, page.waitFor('.btn_provisionally').then(function (a) { return protocol.send('open write page ok'); }).catch(function (e) { return protocol.end('failed to open write page'); })];
            case 15:
                _a.sent();
                return [4 /*yield*/, page.click('#tx_switchertoggle')];
            case 16:
                _a.sent();
                return [4 /*yield*/, page.waitFor(300)];
            case 17:
                _a.sent();
                return [4 /*yield*/, page.click('.btn_public')];
            case 18:
                _a.sent();
                return [4 /*yield*/, page.waitFor(300)];
            case 19:
                _a.sent();
                return [4 /*yield*/, page.focus('#titleBox')];
            case 20:
                _a.sent();
                return [4 /*yield*/, page.type(post.title)];
            case 21:
                _a.sent();
                return [4 /*yield*/, page.waitFor(300)];
            case 22:
                _a.sent();
                return [4 /*yield*/, page.focus('#tx_canvas_source')];
            case 23:
                _a.sent();
                return [4 /*yield*/, page.type(post.content)];
            case 24:
                _a.sent();
                return [4 /*yield*/, page.waitFor(500)];
            case 25:
                _a.sent();
                return [4 /*yield*/, page.click('.btn_comm.btn_save')];
            case 26:
                _a.sent();
                return [4 /*yield*/, page.waitFor('.tit_cont').then(function (a) { return protocol.end('success'); }).catch(function (e) { return protocol.end('failed after clicking post button'); })];
            case 27:
                _a.sent();
                return [4 /*yield*/, browser.close()];
            case 28:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=tistory.js.map